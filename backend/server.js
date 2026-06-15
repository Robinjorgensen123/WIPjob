import express from "express";
// Ladda miljövariabler från .env (om fil finns)
import dotenv from "dotenv";
dotenv.config();
// Importera CV-data (ES Modules-syntax enligt package.json:type = module)
import myResume from "./data/myResume.js";
// OpenAI/Gemini SDK-konfiguration
import OpenAI from "openai";

// Enkel Express-app som exporteras för testning med Supertest.
// Kommentaren förklarar syftet på svenska enligt projektreglerna.
const app = express();

// Middleware för att parsa JSON-body i inkommande requests
app.use(express.json());

// Konfigurera OpenAI-klienten med API-nyckel från miljön.
// Skapa klient endast om nyckel finns för att undvika fel i testmiljö.
const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

// Rot-route för hälsokontroll – returnerar 200 OK.
app.get("/", (req, res) => {
  // Svarstext används bara för manuell debugging, testen kollar statuskoden.
  res.status(200).send("OK");
});

// API-route: GET /api/jobs
// Returnerar en hårdkodad lista med jobbannonser för juniora utvecklare.
// Detta är "minsta möjliga" implementation för att göra Micro-Step 3.1/3.2
// grön: ett 200-svar med en array av jobbobjekt som innehåller id, title,
// company och description.
app.get("/api/jobs", (req, res) => {
  // Hårdkodad array med 5 fiktiva, realistiska jobbannonser
  const jobs = [
    {
      id: "job-1",
      title: "Junior React-utvecklare",
      company: "Nordic Web Solutions",
      description:
        "Arbeta i ett team med React och TypeScript för att bygga användargränssnitt. Grundläggande kunskaper i HTML/CSS krävs.",
    },
    {
      id: "job-2",
      title: "Junior Fullstack JavaScript-utvecklare",
      company: "Startup Labs",
      description:
        "Bygg REST-API:er i Node.js/Express och koppla dem till en React-front. Erfarenhet av Git och testning är meriterande.",
    },
    {
      id: "job-3",
      title: "Frontend-utvecklare (React/TypeScript)",
      company: "GreenTech Agency",
      description:
        "Fokus på komponentutveckling i React med TypeScript. Arbete med designsystem och tillgänglighet.",
    },
    {
      id: "job-4",
      title: "Junior JavaScript-utvecklare",
      company: "eComify",
      description:
        "Underhåll och förbättra befintliga frontendlösningar. Grundläggande Node.js-kunskaper används för små backend-uppgifter.",
    },
    {
      id: "job-5",
      title: "Junior Frontend Engineer",
      company: "PixelWorks",
      description:
        "Jobba med moderna verktyg (Vite, React, Tailwind) för att leverera snabba och responsiva webapplikationer.",
    },
  ];

  // Returnera listan som JSON med status 200
  res.status(200).json(jobs);
});

// POST /api/generate-cv
// Tar emot `jobDescription` i request-body och returnerar strikt JSON
// med fälten `coverLetter` (string) och `keyMatches` (array).
// Kommentaren och prompten är skrivna på svenska enligt instruktion.
app.post("/api/generate-cv", async (req, res) => {
  try {
    const { jobDescription } = req.body || {};
    if (!jobDescription || typeof jobDescription !== "string") {
      return res.status(400).json({ error: "Missing or invalid jobDescription" });
    }

    // Systemprompt: instruera AI att agera som en erfaren teknisk rekryterare
    // och matcha jobbannonsen mot kandidatens profil, skills och källa i CV:t.
    const systemPrompt = `Du är en erfaren teknisk rekryterare som får i uppdrag att matcha en jobbannons mot en kandidats CV. Kandidaten beskrivs nedan. Ge två saker i strikt JSON-format: 1) "coverLetter": ett professionellt, koncist och målgruppsanpassat personligt brev på svenska (max ~2200 tecken) som förklarar varför kandidaten är lämplig för den angivna tjänsten; 2) "keyMatches": en array av korta strängar som listar de viktigaste matchande kompetenserna eller erfarenheterna (t.ex. "React", "Module Federation", "CI/CD") och varför de är relevanta (kort). Använd endast informationen i kandidatprofilen nedan — hitta matchningar mellan jobbannonsens krav och kandidatens 'profile', 'skills' och 'experience' (och 'raw' om nödvändigt). Returnera endast giltig JSON (ingen annan text).`;

    // Bygg meddelandeflödet för API-anropet
    const userContent = `Job description:\n${jobDescription}\n\nCandidate CV:\nProfile:\n${myResume.profile}\n\nSkills:\n${myResume.skills}\n\nExperience:\n${myResume.experience}\n`;

    let assistantText = null;

    // Om vi har en giltig OpenAI-nyckel, försök att använda SDK:n.
    if (process.env.OPENAI_API_KEY) {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userContent },
        ],
        max_tokens: 800,
        temperature: 0.2,
      });

      assistantText = completion?.choices?.[0]?.message?.content || null;
    }

    // Om vi fick svar från OpenAI, försök parsning till JSON.
    if (assistantText) {
      try {
        // Försök direkt JSON-parse (API:et förväntas returnera ren JSON)
        const parsed = JSON.parse(assistantText);
        return res.status(200).json(parsed);
      } catch (err) {
        // Om svaret inte är exakt JSON, extrahera JSON-objektet ur texten
        const match = assistantText.match(/\{[\s\S]*\}/);
        if (match) {
          try {
            const parsed = JSON.parse(match[0]);
            return res.status(200).json(parsed);
          } catch (err2) {
            // fallthrough to local fallback
          }
        }
      }
    }

    // Lokal fallback (om ingen API-nyckel eller parsing misslyckades):
    // Enkel, deterministisk matchning baserat på skill-keywords.
    const skillsList = myResume.skills.split(",").map((s) => s.trim());
    const lowerJob = jobDescription.toLowerCase();
    const keyMatches = [];
    for (const skill of skillsList) {
      const simple = skill.replace(/\(.+\)/, "").trim();
      const token = simple.split(/\s|\//)[0];
      if (token && lowerJob.includes(token.toLowerCase())) {
        keyMatches.push(`${simple} — matchar jobbannonsen`);
      }
    }

    // Sammansatt, kortfattat personligt brev på svenska som fallback.
    const coverLetter = `Hej,\n\nJag heter ${myResume.profile.split(" - ")[0]} och jag vill uttrycka mitt intresse för rollen. ${myResume.profile} Mina främsta matchningar mot den här tjänsten är: ${keyMatches.join(", ") || "ingen tydlig matchning hittades"}. Jag ser fram emot att bidra med mina erfarenheter inom ${skillsList.slice(0,3).join(", ")} och att växa i rollen.\n\nVänliga hälsningar,\nRobin`;

    return res.status(200).json({ coverLetter, keyMatches });
  } catch (error) {
    // Felhantering: logga och returnera generisk fel-svar
    /* eslint-disable no-console */
    console.error("Error in /api/generate-cv:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Om filen körs direkt (ej via test), starta servern.
if (process.env.NODE_ENV !== "test") {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    /* eslint-disable no-console */
    console.log(`Server listening on port ${port}`);
  });
}

export default app;
