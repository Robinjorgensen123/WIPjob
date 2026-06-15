import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

// Mocka statiska assets så Jest inte försöker parse:a SVG/PNG under test
jest.mock("../assets/react.svg", () => "react.svg");
jest.mock("../assets/vite.svg", () => "vite.svg");
jest.mock("../assets/hero.png", () => "hero.png");
jest.mock("../App.css", () => ({}));

import App from "../App";

// Micro-Step 8.3: verifiera att det CV som ligger i localStorage skickas
// med i anropet till POST /api/generate-cv när användaren klickar "Select & Tailor".
// Testet sätter först ett unikt test-CV i localStorage, mockar global.fetch
// för både GET /api/jobs och POST /api/generate-cv, klickar på knappen och
// kontrollerar vad som skickades i POST-body.
describe("JobSearch -> generate-cv should include dynamic CV from localStorage", () => {
  afterEach(() => {
    jest.restoreAllMocks();
    try {
      delete global.fetch;
    } catch (e) {}
    localStorage.clear();
  });

  test("POST /api/generate-cv innehåller CV från localStorage (RED för nu)", async () => {
    // --- Arrange ---
    // Sätt ett unikt test-CV i localStorage före render
    const testCv = "Detta är mitt dynamiska test-CV för AI";
    localStorage.setItem("user_cv", testCv);

    // Variabel för att fånga vad som postas till /api/generate-cv
    let postedBody = null;

    // Mocka global.fetch för både GET /api/jobs och POST /api/generate-cv
    global.fetch = jest.fn((url, opts) => {
      // Mock för jobs-listan
      if (String(url).includes("/api/jobs")) {
        return Promise.resolve({
          ok: true,
          json: async () => [
            {
              id: "job-1",
              title: "Frontend Engineer",
              company: "Acme Corp",
              description: "...",
            },
          ],
        });
      }

      // Mock för generate-cv POST
      if (String(url).includes("/api/generate-cv")) {
        // Spara request-body så vi kan asserta på det senare
        try {
          postedBody = opts && opts.body ? JSON.parse(opts.body) : null;
        } catch (e) {
          postedBody = null;
        }
        return Promise.resolve({
          ok: true,
          json: async () => ({ coverLetter: "ok" }),
        });
      }

      return Promise.reject(new Error("Unexpected fetch url: " + url));
    });

    // --- Act ---
    render(<App />);

    // Navigera till Job-sidan via navbar-länk
    const jobsLink = await screen.findByRole("link", { name: /Sök Jobb/i });
    fireEvent.click(jobsLink);

    // Vänta på att jobbtiteln renderas
    await screen.findByText(/Frontend Engineer/i);

    // Klicka på Select & Tailor för det första jobbet
    const tailorBtn = screen.getByText(/Select & Tailor/i);
    fireEvent.click(tailorBtn);

    // --- Assert ---
    // Vänta tills POST-anropet fångats
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });

    // Kontrollera att POST-body innehåller vår test-CV
    // Enligt nuvarande implementation kommer detta troligen att vara falskt (RED),
    // eftersom App fortfarande skickar endast jobDescription. Testet ska därför
    // misslyckas tills vi uppdaterar App/JobSearch-logiken.
    expect(postedBody).toBeTruthy();
    expect(JSON.stringify(postedBody)).toMatch(
      /Detta är mitt dynamiska test-CV för AI/,
    );
  });
});
