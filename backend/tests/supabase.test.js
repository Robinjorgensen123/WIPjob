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
    expect(res.status).toBe(200);
  });
});
