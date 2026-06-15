import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import JobSearch from "./JobSearch";

// Mocka statiska assets så Jest inte försöker parse:a SVG/PNG/CSS vid import
jest.mock("../assets/react.svg", () => "react.svg");
jest.mock("../assets/vite.svg", () => "vite.svg");
jest.mock("../assets/hero.png", () => "hero.png");
jest.mock("../App.css", () => ({}));

import App from "../App";
import { BrowserRouter } from "react-router-dom";

// Test för JobSearch-sidan
// Micro-Step 7.3: Mocka backend `/api/jobs` och verifiera att JobSearch
// renderar titlar och företagsnamn korrekt.
describe("JobSearch page - integration med backend (mock)", () => {
  // Återställ mocks efter varje test så vi inte påverkar andra tester
  afterEach(() => {
    jest.restoreAllMocks();
    try {
      delete global.fetch;
    } catch (e) {}
  });

  test("hämtar jobb från /api/jobs och visar titlar och företag", async () => {
    // --- Arrange: mocka global.fetch så att vår komponent tror att den
    // pratade med backend och fick en array med jobbobjekt.
    const mockJobs = [
      {
        id: "af-1",
        title: "Frontend Engineer",
        company: "Acme Corp",
        description: "Bygg användargränssnitt med React och JavaScript",
      },
      {
        id: "af-2",
        title: "Junior JavaScript Developer",
        company: "DevStudio",
        description: "Arbeta med Node.js och moderna JS-ramverk",
      },
    ];

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => mockJobs,
    });

    // --- Act: rendera komponenten innanför en Router (komponenten kan
    // använda länkar eller routing-beteende)
    render(
      <BrowserRouter>
        <JobSearch onSelectJob={jest.fn()} />
      </BrowserRouter>,
    );

    // --- Assert: vänta asynkront tills jobbtitlarna syns i DOM:en
    const firstTitle = await screen.findByText(/Frontend Engineer/i);
    expect(firstTitle).toBeTruthy();

    const firstCompany = await screen.findByText(/Acme Corp/i);
    expect(firstCompany).toBeTruthy();
  });

  test("POST /api/generate-cv ska inkludera CV från localStorage (RED)", async () => {
    // Sätt ett unikt test-CV i localStorage innan render
    const testCv = "Detta är mitt dynamiska test-CV för AI-matching";
    localStorage.setItem("user_cv", testCv);

    // Variabel för att fånga POST-body
    let postedBody = null;

    // Mocka fetch så att GET /api/jobs returnerar ett jobb och
    // POST /api/generate-cv fångas
    global.fetch = jest.fn((url, opts) => {
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

      if (String(url).includes("/api/generate-cv")) {
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

    // Rendera hela App så click -> generate-cv används från App
    render(<App />);

    // Navigera till Job-sidan
    const jobsLink = await screen.findByRole("link", { name: /Sök Jobb/i });
    fireEvent.click(jobsLink);

    // Vänta på att jobben renderas
    await screen.findByText(/Frontend Engineer/i);

    // Klicka på Select & Tailor
    const tailorBtn = screen.getByText(/Select & Tailor/i);
    fireEvent.click(tailorBtn);

    // Vänta att POST-anropet har gjorts
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());

    // Kontrollera att POST-body innehåller vår sparade CV-text
    // Detta bör vara rött tills vi uppdaterar applikationen att inkludera CV i POST
    expect(postedBody).toBeTruthy();
    expect(JSON.stringify(postedBody)).toMatch(
      /Detta är mitt dynamiska test-CV för AI-matching/,
    );
  });
});

// === Phase 11: Frontend UI Overhaul (Micro-Step 11.1) ===
// Nya komponenttester som förväntar sig avancerade UI-element: sök/filter,
// status-chips per jobbkort och en modal/action-yta för AI-brevet.
// Viktigt: Vi ändrar ENBART testerna nu så att de initialt failar (Red).
describe("JobSearch UI overhaul - advanced elements (RED)", () => {
  afterEach(() => {
    jest.restoreAllMocks();
    try {
      delete global.fetch;
    } catch (e) {}
  });

  test("sidan innehåller ett sök- eller filterfält för jobb", async () => {
    // Mocka fetch så komponenten får jobb att rendera
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => [
        { id: "job-1", title: "Frontend Engineer", company: "Acme", status: "Ej sökt" },
      ],
    });

    render(
      <BrowserRouter>
        <JobSearch onSelectJob={jest.fn()} />
      </BrowserRouter>,
    );

    // Vänta tills komponenten gjort sin fetch
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());

    // Förväntar ett sökfält (role=searchbox) eller input med placeholder som innehåller 'sök'
    const searchbox = screen.queryByRole("searchbox") || screen.queryByPlaceholderText(/sök|search/i);

    // Detta bör vara sant i den nya designen — testet bör initialt FAILA
    expect(searchbox).not.toBeNull();
  });

  test("varje jobbkort visar en status-tagg/chip (t.ex. 'Ej sökt', 'Sparad')", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => [
        { id: "job-1", title: "Frontend Engineer", company: "Acme", status: "Ej sökt" },
        { id: "job-2", title: "Backend Dev", company: "Beta", status: "Sparad" },
      ],
    });

    render(
      <BrowserRouter>
        <JobSearch onSelectJob={jest.fn()} />
      </BrowserRouter>,
    );

    await waitFor(() => expect(global.fetch).toHaveBeenCalled());

    // Hämta alla listitems som representerar jobbkort
    const items = screen.queryAllByRole("listitem");
    expect(items.length).toBeGreaterThan(0);

    // Kontrollera att minst ett jobbkort innehåller en status-tagg
    const statusRegex = /Ej sökt|Sparad|Skräddarsydd/;
    const anyHasStatus = items.some((el) => statusRegex.test(el.textContent));

    // I den nya UI:n ska detta vara sant — vi förväntar oss ett rött test tills vi implementerar.
    expect(anyHasStatus).toBe(true);
  });

  test("finns en modal eller action-yta för att visa det AI-genererade brevet", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => [
        { id: "job-1", title: "Frontend Engineer", company: "Acme", status: "Ej sökt" },
      ],
    });

    render(
      <BrowserRouter>
        <JobSearch onSelectJob={jest.fn()} />
      </BrowserRouter>,
    );

    await waitFor(() => expect(global.fetch).toHaveBeenCalled());

    // Leta efter modal: role="dialog" eller testid "ai-letter-modal"
    const dialog = screen.queryByRole("dialog") || screen.queryByTestId("ai-letter-modal");

    // Detta ska finnas i design-överhalningen — initialt RED
    expect(dialog).not.toBeNull();
  });
});
