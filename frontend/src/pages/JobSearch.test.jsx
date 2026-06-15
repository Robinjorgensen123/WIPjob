import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import JobSearch from "./JobSearch";
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
});
