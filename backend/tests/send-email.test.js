// Test för POST /api/send-email
// Mockar `resend` för att undvika att skicka riktiga mail under tester.
import request from "supertest";
import { jest } from "@jest/globals";

// Mocka `resend`-paketet och ge en kontrollerad framgångsrespons
jest.mock("resend", () => {
  return {
    __esModule: true,
    default: {
      messages: {
        send: jest.fn().mockResolvedValue({ id: "msg_123", status: "sent" }),
      },
    },
  };
});

import app from "../server.js";

describe("POST /api/send-email", () => {
  test("bör returnera 200 och { success: true } vid lyckat skick", async () => {
    const coverLetter = "Hej, detta är ett kort personligt brev.";

    const res = await request(app)
      .post("/api/send-email")
      .send({ coverLetter })
      .set("Accept", "application/json");

    // Förväntar status 200
    expect(res.status).toBe(200);

    // Förväntar framgångsobjekt
    expect(res.body).toBeDefined();
    // Antingen { success: true } eller liknande framgångsmeddelande
    expect(
      res.body.success === true || typeof res.body.message === "string",
    ).toBe(true);
  });
});
