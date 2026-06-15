// Detta är ett Jest-test som använder Supertest för att göra HTTP-förfrågningar
// mot Express-appen exporterat från `../server.js`.
// Vi skriver testerna nu och förväntar oss att de initialt misslyckas (Red)
// eftersom implementationen av vissa endpoints ännu inte finns.

import request from "supertest";
import { jest } from "@jest/globals";

// För testsyfte sätt en test-API-nyckel så server.js initierar OpenAI-klienten.
process.env.OPENAI_API_KEY = "test";

// Mocka OpenAI SDK innan vi importerar app så att konstruktorn `new OpenAI()`
// i server.js använder vår mock. Vi exponerar `createMock` så tester kan
// spionera på vad som skickas till SDK:ns `create`-metod.
let createMock;
jest.mock("openai", () => {
  createMock = jest.fn().mockResolvedValue({
    choices: [
      {
        message: {
          content: JSON.stringify({ coverLetter: "mock", keyMatches: [] }),
        },
      },
    ],
  });

  function OpenAI() {
    return { chat: { completions: { create: createMock } } };
  }

  return { __esModule: true, default: OpenAI };
});

import app from "../server.js"; // Importera Express-appen efter mock-setup

// Tester för rot-routen `/`
describe("Root route `/`", () => {
  // Detta test skickar en GET-förfrågan till rot-routen
  // och förväntar sig HTTP-status 200.
  test("GET / should respond with 200", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
  });
});

// Micro-Step 3.1: Test för GET /api/jobs
describe("GET /api/jobs", () => {
  // Testet gör en GET-förfrågan till /api/jobs och verifierar:
  // 1) status 200
  // 2) att response.body är en Array
  // 3) att det första objektet innehåller fälten id, title, company, description
  test("should return 200 and an array of job objects with required fields", async () => {
    const res = await request(app).get("/api/jobs");

    // Förväntar HTTP 200
    expect(res.status).toBe(200);

    // Förväntar att kroppen är en array
    expect(Array.isArray(res.body)).toBe(true);

    // Förväntar minst ett jobbobjekt så vi kan kontrollera fälten
    expect(res.body.length).toBeGreaterThan(0);
    const first = res.body[0];
    expect(first).toHaveProperty("id");
    expect(first).toHaveProperty("title");
    expect(first).toHaveProperty("company");
    expect(first).toHaveProperty("description");
  });
});

// === Phase 7: Real Job Search Integration (Arbetsförmedlingen) ===
// Micro-Step 7.1: Test som verifierar att servern gör ett externt anrop
// till Arbetsförmedlingens JobSearch API (sökord: "JavaScript") och mappar
// om det externa svaret till vårt frontend-vänliga format.
describe("GET /api/jobs (Arbetsförmedlingen integration - mock)", () => {
  // Rensa och återställ mocks efter varje test
  afterEach(() => {
    jest.restoreAllMocks();
    // Ta bort global.fetch så andra tester inte påverkas
    try {
      delete global.fetch;
    } catch (e) {}
  });

  test("bör göra ett externt anrop med sökord 'JavaScript' och returnera mappad array", async () => {
    // --- Arrange ---
    // Simulera Arbetsförmedlingens API-svarstruktur. Vi antar en wrapper
    // med en lista under t.ex. `hits` där varje item har headline,
    // employer.name och description.text.
    const mockExternal = {
      hits: [
        {
          id: "af-1",
          headline: "Frontend Engineer",
          employer: { name: "Acme Corp" },
          description: { text: "Utveckla webbapplikationer med React och JS" },
        },
      ],
    };

    // Skapa en global.fetch mock så vi kan spy:a på anropet.
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => mockExternal,
    });

    // --- Act ---
    const res = await request(app).get("/api/jobs");

    // --- Assert ---
    // Förväntar att servern försökte hämta data externt
    expect(global.fetch).toHaveBeenCalled();

    // Kontrollera att URL eller query innehåller 'JavaScript' (sökordet)
    const calledUrl = global.fetch.mock.calls[0][0];
    expect(String(calledUrl)).toMatch(/JavaScript/i);

    // Servern ska returnera 200 och en array
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    // Kontrollera att mappningen från extern struktur till vårt format sker
    // Vi förväntar oss fälten: id, title, company, description
    expect(res.body.length).toBeGreaterThan(0);
    const first = res.body[0];
    expect(first).toHaveProperty("id");
    expect(first).toHaveProperty("title");
    expect(first).toHaveProperty("company");
    expect(first).toHaveProperty("description");

    // Kontrollera att värdena kommer från mocken
    expect(first.id).toBe("af-1");
    expect(first.title).toMatch(/Frontend Engineer/i);
    expect(first.company).toMatch(/Acme Corp/i);
    expect(first.description).toMatch(/React/i);
  });
});

// === Phase 10: Production AI Integration (Un-mocking the AI) ===
// Micro-Step 10.1: Integrationstest som verifierar payload byggd mot det
// officiella OpenAI SDK:t. Vi mockar SDK:n men spionerar på anropsargumenten
// för att säkerställa att `userCv` faktiskt skickas med i prompten.
describe("POST /api/generate-cv (SDK payload assertion)", () => {
  afterEach(() => {
    jest.restoreAllMocks();
    // Rensa test-API-nyckel så andra tester inte oavsiktligt använder den
    try {
      delete process.env.OPENAI_API_KEY;
    } catch (e) {}
  });

  test("ska skicka en meddelandepayload till OpenAI som innehåller text från userCv", async () => {
    // --- Arrange ---
    // Unikt fragment i userCv så vi kan söka efter det i prompten
    const uniqueSnippet = "SPECIAL_CV_MARKER_TypeScriptReact";
    const jobDescription =
      "Sök: Frontend-utvecklare med React/TypeScript-kunskaper";

    // Här skickar vi både jobDescription och userCv i body enligt testkravet.
    const userCv = `Profile: Robin - Fullstack dev\nSkills: React, TypeScript, Node.js\nNote: ${uniqueSnippet}`;

    // --- Act ---
    const res = await request(app)
      .post("/api/generate-cv")
      .send({ jobDescription, userCv })
      .set("Accept", "application/json");

    // --- Assert ---
    // Först, förväntar vi att servern försökte anropa OpenAI SDK:n
    expect(createMock).toHaveBeenCalled();

    // Hämta det första anrops-argumentet till create-metoden
    const calledArg = createMock.mock.calls[0][0];

    // Kontrollera att `messages` finns och att en user-message innehåller vår userCv-text
    expect(calledArg).toHaveProperty("messages");
    const messages = calledArg.messages;
    const userMessage = messages.find((m) => m.role === "user");

    // Säkerhetskontroll: userMessage ska existera och vara en sträng
    expect(userMessage).toBeDefined();
    expect(typeof userMessage.content).toBe("string");

    // Här är den viktiga assertionen: prompten som skickas till SDK:n måste
    // innehålla texten från `userCv` (vårt unika fragment).
    expect(userMessage.content).toMatch(new RegExp(uniqueSnippet));

    // Vi förväntar oss fortfarande att endpointen returnerar ett JSON-objekt
    expect(res.status).toBe(200);
    expect(typeof res.body).toBe("object");
  });
});
