import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import "./App.css";

// Huvudkomponenten för applikationen.
// Kommentarer på svenska för att förklara layouten.
function App() {
  const [selectedJob, setSelectedJob] = useState(null);
  // State för att lagra jobb som hämtas från API
  const [jobs, setJobs] = useState([]);
  // State för att lagra det genererade personliga brevet
  const [generatedLetter, setGeneratedLetter] = useState(null);
  // State för att indikera laddning vid generate-cv-anrop
  const [isGenerating, setIsGenerating] = useState(false);

  // useEffect som körs en gång vid mount och hämtar jobb från /api/jobs
  useEffect(() => {
    let mounted = true;

    fetch("/api/jobs")
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => {
        if (mounted && Array.isArray(data)) setJobs(data);
      })
      .catch(() => {
        if (mounted) setJobs([]);
      });

    return () => {
      mounted = false;
    };
  }, []);

  // Asynkron funktion som anropas när användaren klickar "Select & Tailor"
  // Tar emot en textbeskrivning av jobbet och postar den till /api/generate-cv
  async function handleSelectJob(jobDescription) {
    try {
      setIsGenerating(true);
      const res = await fetch("/api/generate-cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription }),
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
    <div className="min-h-screen bg-gray-50 text-gray-900">
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
            {/* Vänstersida: Job List Area */}
            <section className="lg:w-1/2 bg-white rounded-lg shadow p-6">
              {/* Kommentar: här kommer en lista med jobbannonser */}
              <h2 className="text-xl font-semibold mb-4">Job List Area</h2>

              {/* Rendera jobben när de är hämtade från API:et */}
              {jobs.length === 0 ? (
                <p className="text-sm text-gray-500">
                  Här listas tillgängliga jobb (placeholder).
                </p>
              ) : (
                <ul>
                  {jobs.map((job) => (
                    <li key={job.id} className="mb-4">
                      {/* Visa jobbtitel och företag så tester kan hitta dem */}
                      <div className="text-lg font-medium">{job.title}</div>
                      <div className="text-sm text-gray-500">{job.company}</div>
                      {/* Select & Tailor-knapp som triggar generate-cv POST-anrop */}
                      <button
                        className="mt-2 inline-block bg-green-500 text-white px-3 py-1 rounded"
                        onClick={() =>
                          handleSelectJob(`${job.title} at ${job.company}`)
                        }
                      >
                        Select & Tailor
                      </button>
                    </li>
                  ))}
                </ul>
              )}
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
  );
}

export default App;
