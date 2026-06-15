import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CVManager from "./CVManager";
import { BrowserRouter } from "react-router-dom";

// Micro-Step 8.1 (RED): Test som kräver en textarea för CV-inmatning,
// en knapp för att spara och ett framgångsmeddelande efter sparning.
// Detta test är avsett att vara rött tills funktionaliteten implementeras.
describe("CVManager - TDD red test (expected to fail)", () => {
  test("har textarea, en 'Spara CV' knapp och visar bekräftelse vid sparning", async () => {
    // Rendera komponenten (inom Router i fall den använder länkar)
    render(
      <BrowserRouter>
        <CVManager />
      </BrowserRouter>,
    );

    // Förväntar att det finns en textarea där användaren kan klistra in sitt CV.
    // Vi använder placeholder- eller label-sökning så testet är tydligt.
    // Detta kommer att kasta ett tydligt fel (rött) om textarea saknas.
    const textarea = screen.getByPlaceholderText(
      /klistra in ditt cv|paste your cv|din cv/i,
    );
    // Simulera att användaren skriver in text i textarean
    fireEvent.change(textarea, { target: { value: "Mitt CV-innehåll" } });

    // Hitta spara-knappen (case-insensitiv matchning)
    const saveBtn = screen.getByRole("button", { name: /spara cv/i });
    // Klicka på spara
    fireEvent.click(saveBtn);

    // Vänta på bekräftelsemeddelande som indikerar att CV sparats
    const msg = await screen.findByText(/cv sparat framgångsrikt|sparat/i);
    expect(msg).toBeTruthy();
  });
});
