import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import Home from "./pages/Home";
import JobSearch from "./pages/JobSearch";
import CVManager from "./pages/CVManager";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import "./App.css";

// Huvudkomponenten för applikationen.
// Kommentarer på svenska för att förklara layouten.
function App() {
  const [selectedJob, setSelectedJob] = useState(null);
  // State för det genererade personliga brevet
  const [generatedLetter, setGeneratedLetter] = useState(null);
  // State för att indikera laddning vid generate-cv-anrop
  const [isGenerating, setIsGenerating] = useState(false);

  // Asynkron funktion som anropas när användaren klickar "Select & Tailor"
  // Tar emot en textbeskrivning av jobbet och postar den till /api/generate-cv
  async function handleSelectJob(jobDescription) {
    try {
      setIsGenerating(true);
      // Hämta användarens sparade CV från localStorage om det finns.
      // Vi fångar eventuella fel (t.ex. i testmiljöer) och använder tom sträng som fallback.
      let userCv = "";
      try {
        userCv = localStorage.getItem("user_cv") || "";
      } catch (e) {
        // Ignorera localStorage-fel i testmiljö
      }

      // Skicka både jobbets beskrivning och det dynamiska användar-CV:t
      // till backend så AI:n kan använda användarens faktiska CV vid generering.
      const res = await fetch("/api/generate-cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription, userCv }),
      });
      if (!res.ok) throw new Error("Network response was not ok");
      const data = await res.json();
      // Spara det genererade brevet i state så det visas i UI:t
      setGeneratedLetter(data.coverLetter || null);
    } catch (err) {
      setGeneratedLetter(null);
    } finally {
      setIsGenerating(false);
    }
  }

  // Enkel layout med Tailwind-klassnamn (kräver Tailwind i projektet för full styling).
  // Delar upp vyen i två kolumner på större skärmar och i staplade sektioner på små skärmar.
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <Navbar />
        {/* Header med huvudrubrik */}
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight">
              Job Application Accelerator
            </h1>
          </div>
        </header>

        {/* Split-screen layout: vänster = jobblista, höger = personligt brev */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Vänstersida: Routes visar Home, JobSearch eller CVManager */}
              <section className="lg:w-1/2 bg-white rounded-lg shadow p-6">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route
                    path="/jobs"
                    element={<JobSearch onSelectJob={handleSelectJob} />}
                  />
                  <Route path="/cv" element={<CVManager />} />
                </Routes>
              </section>

              {/* Högersida: Tailored CV / Cover Letter Area */}
              <aside className="lg:w-1/2 bg-white rounded-lg shadow p-6">
                {/* Kommentar: här visas det genererade personliga brevet */}
                <h2 className="text-xl font-semibold mb-4">
                  Tailored CV / Cover Letter Area
                </h2>
                {/* Visa en laddningsindikator vid generering */}
                {isGenerating && (
                  <p className="text-sm text-gray-500">Genererar...</p>
                )}

                {/* Om vi har ett genererat brev, rendera det här */}
                {generatedLetter ? (
                  <div className="prose">
                    <p>{generatedLetter}</p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    Det här området visar det skräddarsydda brevet.
                  </p>
                )}
              </aside>
            </div>
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
