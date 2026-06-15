// Test för POST /api/generate-cv
// Mockar OpenAI SDK så att inga verkliga nätverksanrop görs under tester.
import request from "supertest";
import { jest } from "@jest/globals";

// Mocka 'openai' så att serverns anrop returnerar en kontrollerad respons
jest.mock("openai", () => {
  // Returnera en konstruktör så att `new OpenAI()` fungerar i server.js
  function OpenAI() {
    return {
      chat: {
        completions: {
          create: jest.fn().mockResolvedValue({
            choices: [
              {
                message: {
                  content: JSON.stringify({
                    coverLetter: "Detta är ett mockat personligt brev.",
                    keyMatches: ["React", "Node.js"],
                  }),
                },
              },
            ],
          }),
        },
      },
    };
  }

  return { __esModule: true, default: OpenAI };
});

import app from "../server.js";

describe("POST /api/generate-cv", () => {
  test("bör returnera 200 och ett JSON-objekt med coverLetter och keyMatches", async () => {
    const jobDescription = {
      description: "Vi söker en React-utvecklare med Node.js-erfarenhet.",
    };

    const res = await request(app)
      .post("/api/generate-cv")
      .send({ jobDescription: JSON.stringify(jobDescription) })
      .set("Accept", "application/json");

    // Förväntar status 200
    expect(res.status).toBe(200);

    // Svarskroppen ska vara ett objekt
    expect(typeof res.body).toBe("object");

    // coverLetter ska vara en sträng
    expect(res.body).toHaveProperty("coverLetter");
    expect(typeof res.body.coverLetter).toBe("string");

    // keyMatches ska vara en array
    expect(res.body).toHaveProperty("keyMatches");
    expect(Array.isArray(res.body.keyMatches)).toBe(true);
  });
});
