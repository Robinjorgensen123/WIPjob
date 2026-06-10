// Detta är ett Jest-test som använder Supertest för att göra HTTP-förfrågningar
// mot Express-appen exporterat från `../server.js`.
// Vi skriver testerna nu och förväntar oss att de initialt misslyckas (Red)
// eftersom implementationen av vissa endpoints ännu inte finns.

import request from "supertest";
import app from "../server.js"; // Importerar Express-appen

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
