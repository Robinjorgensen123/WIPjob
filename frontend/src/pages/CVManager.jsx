import React, { useState, useEffect } from "react";

// CVManager: hanterar insättning och lokal lagring av användarens CV-text.
// Funktionaliteten inkluderar:
// - läsa tidigare sparat CV från localStorage vid mount
// - låta användaren klistra in eller skriva sitt CV i en textarea
// - spara CV:t till localStorage när användaren klickar "Spara CV"
// - visa ett kort bekräftelsemeddelande efter sparning
export default function CVManager() {
  // State för CV-texten
  const [cvText, setCvText] = useState("");
  // State för att visa ett framgångsmeddelande efter sparning
  const [savedMessage, setSavedMessage] = useState("");

  // När komponenten mountas, kontrollera om det finns ett sparat CV i localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("user_cv");
      if (saved) setCvText(saved);
    } catch (e) {
      // localStorage kan vara otillgängligt i vissa testmiljöer eller inkapslade contexts
      // Vi fångar och ignorerar fel så att UI fortfarande fungerar.
      // eslint-disable-next-line no-console
      console.warn("Could not read user_cv from localStorage", e.message);
    }
  }, []);

  // Spara CV:t i localStorage och visa en bekräftelse i några sekunder
  function handleSave() {
    try {
      localStorage.setItem("user_cv", cvText);
      setSavedMessage("CV sparat framgångsrikt!");
      // Töm meddelandet efter 2 sekunder
      setTimeout(() => setSavedMessage(""), 2000);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn("Could not save user_cv to localStorage", e.message);
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Ladda upp ditt CV</h2>

      <label htmlFor="cv-textarea" className="block text-sm font-medium text-gray-700 mb-2">
        Klistra in ditt CV
      </label>

      <textarea
        id="cv-textarea"
        placeholder="Klistra in ditt CV här"
        value={cvText}
        onChange={(e) => setCvText(e.target.value)}
        className="w-full border rounded p-2 mb-3 min-h-[120px]"
      />

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={handleSave}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Spara CV
        </button>

        {savedMessage && <span className="text-green-600">{savedMessage}</span>}
      </div>

      <p className="text-sm text-gray-600 mt-4">Ditt CV lagras lokalt i din webbläsare.</p>
    </div>
  );
}
