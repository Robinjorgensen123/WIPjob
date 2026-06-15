// Tester för Supabase-integration (Phase 9.1)
// Filen innehåller endast tester och ska initialt misslyckas (Red)
// eftersom miljövariablerna och klientinitialisering ännu inte finns.

import request from "supertest";
import app from "../server.js"; // Importerar Express-appen (ska inte ändras här)

// Kontrollera att nödvändiga Supabase-miljövariabler är laddade
describe("Supabase environment variables", () => {
  test("process.env.SUPABASE_URL and process.env.SUPABASE_ANON_KEY should be defined", () => {
    // Vi förväntar oss att dessa variabler finns i .env i produktionsläge.
    // För TDD börjar vi med ett test som kommer att misslyckas om de saknas.
    expect(process.env.SUPABASE_URL).toBeDefined();
    expect(process.env.SUPABASE_ANON_KEY).toBeDefined();
  });
});

// Kontrollera att applikationen erbjuder en hälsokontroll eller initierar klient
describe("App health / Supabase client init", () => {
  // Detta test försöker anropa en hälso-endpoint som inte behöver vara
  // implementerad ännu. Syftet är att verifiera att appen inte kraschar
  // vid init och att vi får ett tydligt rött test tills vi implementerar
  // Supabase-klienten och hälsoendpoints.
  test("GET /health should respond (or app should initialise without crashing)", async () => {
    const res = await request(app).get("/health");
    import request from "supertest";

    // OBS: Denna testfil använder dynamisk import av `../server.js` i varje test
    // så att vi kan mocka moduler (t.ex. @supabase/supabase-js) innan servern
    // initieras. Detta gör det möjligt att testa beteenden både med och utan
    // en riktig Supabase-klient.

    // Kontrollera att nödvändiga Supabase-miljövariabler är laddade
    describe("Supabase environment variables", () => {
      test("process.env.SUPABASE_URL and process.env.SUPABASE_ANON_KEY should be defined", () => {
        // Vi förväntar oss att dessa variabler finns i .env i produktionsläge.
        // För TDD börjar vi med ett test som kommer att misslyckas om de saknas.
        expect(process.env.SUPABASE_URL).toBeDefined();
        expect(process.env.SUPABASE_ANON_KEY).toBeDefined();
      });
    });

    // Kontrollera att applikationen erbjuder en hälsokontroll eller initierar klient
    describe("App health / Supabase client init", () => {
      test("GET /health should respond (or app should initialise without crashing)", async () => {
        // Ladda om moduler så servern initialiseras fräscht för testet
        jest.resetModules();
        const { default: app } = await import("../server.js");
        const res = await request(app).get("/health");
        expect(res.status).toBe(200);
      });
    });

    // === Phase 9.3: Test för POST /api/tracked-jobs (Supabase-spara) ===
    describe("POST /api/tracked-jobs (Supabase integration - mock)", () => {
      afterEach(() => {
        // Återställ mocks efter varje test för att undvika sidoeffekter
        jest.restoreAllMocks();
        try {
          delete global.fetch;
        } catch (e) {}
      });

      test("should call supabase.from().insert() and return 201 Created when job is tracked", async () => {
        // --- Arrange ---
        // Återställ moduler så vi kan mocka @supabase/supabase-js innan server-import
        jest.resetModules();

        // Mocka Supabase-klienten: createClient() returnerar ett objekt
        // med en `from`-metod som i sin tur har `insert`.
        const mockInsert = jest.fn().mockResolvedValue({ data: [{ id: "1" }], error: null });
        const mockFrom = jest.fn().mockReturnValue({ insert: mockInsert });

        // Mocka ES-modulen @supabase/supabase-js innan vi importerar servern.
        // Detta gör att när server.js anropar createClient() så får den vår
        // mockade klient med en `from().insert()`-funktion.
        await jest.unstable_mockModule("@supabase/supabase-js", () => ({
          createClient: () => ({ from: mockFrom }),
        }));

        // Nu importerar vi servern som kommer att använda den mockade createClient
        const { default: app } = await import("../server.js");

        // Testpayload som ska skickas till endpointen
        const payload = {
          jobId: "123",
          title: "Frontend-utvecklare",
          company: "Acme Corp",
          status: "Saved",
        };

        // --- Act ---
        const res = await request(app).post("/api/tracked-jobs").send(payload);

        // --- Assert ---
        // Vi förväntar oss att endpointen svarar med 201 Created och en JSON-body
        // som bekräftar att jobbet har registrerats. Eftersom routen ännu inte
        // finns i `server.js`, kommer detta test initialt att misslyckas (Red).
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("id");

        // Kontrollera att vår mockade supabase-klient anropades korrekt.
        expect(mockFrom).toHaveBeenCalled();
        expect(mockInsert).toHaveBeenCalledWith(expect.objectContaining({ jobId: "123" }));
      });
    });
