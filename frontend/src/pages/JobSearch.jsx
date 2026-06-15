import React, { useState, useEffect } from "react";

// JobSearch: innehåller jobblistan och logik för att hämta jobb från /api/jobs
// Tar emot en prop `onSelectJob(jobDescription)` som anropas när användaren
// klickar "Select & Tailor" på ett jobb.
export default function JobSearch({ onSelectJob }) {
  const [jobs, setJobs] = useState([]);

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

    return () => (mounted = false);
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Job List Area</h2>
      {jobs.length === 0 ? (
        <p className="text-sm text-gray-500">
          Här listas tillgängliga jobb (placeholder).
        </p>
      ) : (
        <ul>
          {jobs.map((job) => (
            <li key={job.id} className="mb-4">
              <div className="text-lg font-medium">{job.title}</div>
              <div className="text-sm text-gray-500">{job.company}</div>
              <button
                className="mt-2 inline-block bg-green-500 text-white px-3 py-1 rounded"
                onClick={() => onSelectJob(`${job.title} at ${job.company}`)}
              >
                Select & Tailor
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
