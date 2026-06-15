// Tester för Supabase-integration (Phase 9.1 - 9.3)
// Filen innehåller flera tester: miljövariabler, hälso-endpoint och ett
// integrationstest för att spåra jobb via Supabase (mockat). Filen är skriven
// enligt TDD: först test (Red), sedan implementera routen i server.js.

import request from "supertest";
// Ladda .env i testmiljön så att process.env innehåller placeholders
import dotenv from "dotenv";
dotenv.config();

// Kontrollera att nödvändiga Supabase-miljövariabler är laddade
describe("Supabase environment variables", () => {
  test("process.env.SUPABASE_URL and process.env.SUPABASE_ANON_KEY should be defined", () => {
    // Vi förväntar oss att dessa variabler finns i .env i produktionsläge.
    // För TDD börjar vi med ett test som kommer att misslyckas om de saknas.
    expect(process.env.SUPABASE_URL).toBeDefined();
    expect(process.env.SUPABASE_ANON_KEY).toBeDefined();
  });
});

// Kontrollera att applikationen erbjuder en hälso-endpoint eller initierar klient
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
    // Återställ moduler så vi kan injicera en mock-klient innan server-import
    jest.resetModules();

    // Mocka Supabase-klienten genom att injicera en global mock som
    // `server.js` kommer att upptäcka (globalThis.__SUPABASE_MOCK__).
    // Mocka insert så att den returnerar ett objekt med en `select()`-metod
    // som i sin tur returnerar en promise med { data, error }.
    const mockSelect = jest
      .fn()
      .mockResolvedValue({ data: [{ id: "1" }], error: null });
    const mockInsert = jest.fn().mockReturnValue({ select: mockSelect });
    const mockFrom = jest.fn().mockReturnValue({ insert: mockInsert });
    globalThis.__SUPABASE_MOCK__ = { from: mockFrom };

    // Nu importerar vi servern som kommer att använda den injicerade mocken
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
    expect(mockInsert).toHaveBeenCalledWith(
      expect.arrayContaining([expect.objectContaining({ job_id: "123" })]),
    );
    expect(mockSelect).toHaveBeenCalled();

    // Rensa den globala mocken för att inte påverka andra tester
    delete globalThis.__SUPABASE_MOCK__;
  });
});
