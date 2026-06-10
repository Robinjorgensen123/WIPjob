import express from "express";

// Enkel Express-app som exporteras för testning med Supertest.
// Kommentaren förklarar syftet på svenska enligt projektreglerna.
const app = express();

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

// Om filen körs direkt (ej via test), starta servern.
if (process.env.NODE_ENV !== "test") {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    /* eslint-disable no-console */
    console.log(`Server listening on port ${port}`);
  });
}

export default app;
