import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import "./App.css";

// Huvudkomponenten för applikationen.
// Kommentarer på svenska för att förklara layouten.
function App() {
  const [selectedJob, setSelectedJob] = useState(null);

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
              <p className="text-sm text-gray-500">
                Här listas tillgängliga jobb (placeholder).
              </p>
            </section>

            {/* Högersida: Tailored CV / Cover Letter Area */}
            <aside className="lg:w-1/2 bg-white rounded-lg shadow p-6">
              {/* Kommentar: här visas det genererade personliga brevet */}
              <h2 className="text-xl font-semibold mb-4">
                Tailored CV / Cover Letter Area
              </h2>
              <p className="text-sm text-gray-500">
                Det här området visar det skräddarsydda brevet.
              </p>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
