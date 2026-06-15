// Enkel röktest för frontend: renderar <App /> och kontrollerar
// att huvudrubriken "Job Application Accelerator" finns.
// Kommentarer på svenska enligt projektregler.
import React from "react";
import { render, screen, within, fireEvent } from "@testing-library/react";

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

    // Förväntar att huvudrubriken (h1) finns på sidan
    const heading = screen.getByRole("heading", {
      name: /Job Application Accelerator/i,
      level: 1,
    });
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

    // Rendera komponenten och navigera till Job-sidan
    render(<App />);
    const jobsLink = screen.getByRole("link", { name: /Sök Jobb/i });
    fireEvent.click(jobsLink);

    // Hitta Job-list-sektionen (ny rubrik på svenska: "Jobb") och sök efter jobbens titlar inom sektionen
    const sectionHeading = await screen.findByRole("heading", {
      // Uppdaterad för att matcha nya UI-texten
      name: /Jobb/i,
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

// Integrationstest del 2: verifierar att klick på "Select & Tailor" triggar en POST
// till /api/generate-cv och att det genererade brevet visas i Tailored CV Area.
describe("App (integrationstest: Select & Tailor)", () => {
  test("klickar Select & Tailor och visar genererat brev från /api/generate-cv", async () => {
    // Förbered fiktiva jobb och ett fiktivt svar för generate-cv
    const fakeJobs = [
      { id: 1, title: "Frontend Engineer", company: "Acme" },
      { id: 2, title: "Backend Developer", company: "Globex" },
    ];

    const fakeGenerated = {
      coverLetter: "Detta är ett genererat brev för testet",
      keyMatches: ["Skill A", "Skill B"],
    };

    // Mocka fetch så att GET /api/jobs returnerar jobben och POST /api/generate-cv returnerar det genererade brevet
    const originalFetch = global.fetch;
    global.fetch = jest.fn((input, init) => {
      const url = typeof input === "string" ? input : input?.url;
      const method = init?.method || "GET";
      if (url && url.includes("/api/jobs") && method === "GET") {
        return Promise.resolve({ ok: true, json: async () => fakeJobs });
      }
      if (url && url.includes("/api/generate-cv") && method === "POST") {
        return Promise.resolve({ ok: true, json: async () => fakeGenerated });
      }
      return Promise.resolve({ ok: false, status: 404 });
    });

    // Rendera App och navigera till Job-sidan
    render(<App />);
    const jobsLink = screen.getByRole("link", { name: /Sök Jobb/i });
    fireEvent.click(jobsLink);
    await screen.findByText(/Frontend Engineer/i);

    // Klicka på den första "Select & Tailor"-knappen
    const buttons = await screen.findAllByText(/Select & Tailor/i);
    fireEvent.click(buttons[0]);

    // Verifiera att det genererade brevet visas i Tailored CV Area.
    // Använd `within` för att scoped sökning i den dedikerade `aside`-sektionen
    // så vi undviker dubbelmatch mot modalens innehåll.
    const asideHeading = await screen.findByRole("heading", {
      name: /Tailored CV \/ Cover Letter Area/i,
    });
    const aside = asideHeading.closest("aside") || document.body;
    const asideUtils = within(aside);
    await asideUtils.findByText(/Detta är ett genererat brev för testet/i);

    // Återställ fetch
    global.fetch = originalFetch;
  });
});

// Routing/test för Navbar (Micro-Step 6.1)
// Testet kontrollerar att en framtida Navbar renderas med länkarna
// "Home", "Sök Jobb" och "CV". Testet skrivs först och förväntas
// misslyckas (Red) eftersom router/navbar ännu inte är implementerad.
describe("App (routing/navbar)", () => {
  test("renderar Navbar med länkar: Home, Sök Jobb och CV", () => {
    // Rendera App-komponenten
    render(<App />);

    // Förväntar att navigationstexterna finns (kommer vara rött tills Navbar implementeras)
    expect(screen.getByText(/Home/i)).toBeTruthy();
    expect(screen.getByText(/Sök Jobb/i)).toBeTruthy();
    expect(screen.getByText(/^CV$/i)).toBeTruthy();
  });
});

// Navigationstest (Micro-Step 6.3)
// Testet kontrollerar navigationen: klicka på "CV" och förväntar sig att CV-sidan
// visar texten "Ladda upp ditt CV", sedan klicka på "Sök Jobb" och kontrollera
// att jobblistan visas igen.
describe("App (routing/navigation)", () => {
  test("navigerar till CV och tillbaka till Sök Jobb", async () => {
    // Rendera App-komponenten (innefattar BrowserRouter och Navbar)
    render(<App />);

    // Klicka på länken 'CV' i Navbaren
    const cvLink = screen.getByRole("link", { name: /CV/i });
    fireEvent.click(cvLink);

    // Förväntar att CV-sidan visar texten "Ladda upp ditt CV" (kommer vara rött tills sidan implementeras)
    expect(await screen.findByText(/Ladda upp ditt CV/i)).toBeTruthy();

    // Klicka på 'Sök Jobb' och verifiera att jobblistan visas igen
    const jobsLink = screen.getByText(/Sök Jobb/i);
    fireEvent.click(jobsLink);
    // Uppdaterad kontroll: leta efter den svenska rubriken 'Jobb'
    expect(await screen.findByRole("heading", { name: /Jobb/i })).toBeTruthy();
  });
});
