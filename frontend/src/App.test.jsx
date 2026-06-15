// Enkel röktest för frontend: renderar <App /> och kontrollerar
// att huvudrubriken "Job Application Accelerator" finns.
// Kommentarer på svenska enligt projektregler.
import React from "react";
import { render, screen, within } from "@testing-library/react";

// Mocka statiska resurser och css så att import i App.jsx inte kastar
jest.mock("./assets/react.svg", () => "react.svg");
jest.mock("./assets/vite.svg", () => "vite.svg");
jest.mock("./assets/hero.png", () => "hero.png");
jest.mock("./App.css", () => ({}));

// Standard-mock för global.fetch så vanliga tester inte kraschar när komponenten mountas
// Integrationstestet kan själv mocka fetch mer specifikt.
beforeAll(() => {
  if (typeof global.fetch === "undefined") {
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: true, json: async () => [] }),
    );
  }
});

import App from "./App.jsx";

describe("App (smoke test)", () => {
  test("renderar huvudrubriken 'Job Application Accelerator'", () => {
    // Rendera App-komponenten
    render(<App />);

    // Förväntar att rubriken finns på sidan (sök med RegExp)
    // Vi använder getByText - om texten inte finns kommer testet att misslyckas.
    const heading = screen.getByText(/Job Application Accelerator/i);
    expect(heading).toBeTruthy();
  });
});

// Integrationstest: verifierar att applikationen hämtar och renderar jobb från /api/jobs
// Kommentarer och beskrivningar på svenska enligt projektregler.
describe("App (integrationstest: hämtar jobb)", () => {
  test("hämtar jobb från /api/jobs och renderar dem i Job List Area", async () => {
    // Mocka global fetch för att returnera två fiktiva jobb
    const fakeJobs = [
      { id: 1, title: "Frontend Engineer", company: "Acme" },
      { id: 2, title: "Backend Developer", company: "Globex" },
    ];

    const originalFetch = global.fetch;
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: true, json: async () => fakeJobs }),
    );

    // Rendera komponenten
    render(<App />);

    // Hitta Job List Area-sektionen och sök efter jobbens titlar inom sektionen
    const sectionHeading = await screen.findByRole("heading", {
      name: /Job List Area/i,
    });
    const section = sectionHeading.closest("section") || document.body;
    const utils = within(section);

    // Väntar asynkront på att jobbtitlarna dyker upp
    expect(await utils.findByText(/Frontend Engineer/i)).toBeTruthy();
    expect(await utils.findByText(/Backend Developer/i)).toBeTruthy();

    // Återställ original fetch
    global.fetch = originalFetch;
  });
});
