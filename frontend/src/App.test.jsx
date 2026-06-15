// Enkel röktest för frontend: renderar <App /> och kontrollerar
// att huvudrubriken "Job Application Accelerator" finns.
// Kommentarer på svenska enligt projektregler.
import React from "react";
import { render, screen } from "@testing-library/react";

// Mocka statiska resurser och css så att import i App.jsx inte kastar
jest.mock("./assets/react.svg", () => "react.svg");
jest.mock("./assets/vite.svg", () => "vite.svg");
jest.mock("./assets/hero.png", () => "hero.png");
jest.mock("./App.css", () => ({}));

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
