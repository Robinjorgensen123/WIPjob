# Project Blueprint: Job Application Accelerator

## Architecture

- Frontend: React (Vite) + Tailwind
- Backend: Node.js (Express)

## Rules for Copilot

1. Write inline comments in Swedish explaining the code logic.
2. Never mark a step as finished until you have documented its data flow in the root `README.md`.
3. Keep the MVP local and simple.
4. Follow strict TDD (Test-Driven Development): Write the test before writing the production code.

## Project File Structure

Use this exact file structure for development:

- Root: `COPILOT_TRACKER.md`, `INSTRUCTIONS.md`, `README.md`
- Backend Root: `backend/server.js`, `backend/package.json`
- Backend Data: `backend/data/myResume.js`
- Backend Tests: `backend/tests/server.test.js`, `backend/tests/resume.test.js`
- Frontend Root: `frontend/` (Standard Vite + React + Tailwind structure)
