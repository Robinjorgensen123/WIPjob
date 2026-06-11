# ?? Copilot Task Tracker: Test-Driven Development (TDD) Edition

## Instructions for Copilot

- **Rule 1**: You are strictly forbidden from writing production code before writing its corresponding test.
- **Rule 2**: Build strictly ONE micro-step at a time. Follow the Red-Green-Refactor cycle.
- **Rule 3**: After a step passes its tests and is verified, update this file (`COPILOT_TRACKER.md`) changing `[ ]` to `[x]`.
- **Rule 4**: Do not move forward until the user explicitly commands it.

---

## ?? Phase 1: Project & Test Setup

- [x] **Micro-Step 1.1**: Initialize directories. Create `/frontend` (Vite, React, Tailwind) and `/backend`. In backend, install `jest` and `supertest` for TDD testing.
- [ ] **Micro-Step 1.2**: Create a smoke test file `backend/tests/server.test.js` that checks if the server root `/` responds. Verify the test fails (Red).
- [ ] **Micro-Step 1.3**: Create `backend/server.js` with just enough code to make the smoke test pass (Green).
- [x] **Micro-Step 1.3**: Create `backend/server.js` with just enough code to make the smoke test pass (Green).

---

## ?? Phase 2: Resume Data Base

- [ ] **Micro-Step 2.1**: Write a test in `backend/tests/resume.test.js` asserting that the resume module exports an object containing valid string fields for profile, skills, and experience. (Red)
- [ ] **Micro-Step 2.2**: Create `backend/data/myResume.js` with your profile details to make the test pass. (Green)
 - [x] **Micro-Step 2.2**: Create `backend/data/myResume.js` with your profile details to make the test pass. (Green)

---

## ?? Phase 3: Backend Bones (Jobs API)

- [ ] **Micro-Step 3.1**: Write a test in `backend/tests/server.test.js` for `GET /api/jobs`. It must assert a `200 OK` status and that the response is an array containing job objects. (Red)
- [ ] **Micro-Step 3.2**: Implement the `GET /api/jobs` endpoint in `server.js` with 5 mock junior developer jobs to make the test pass. (Green)
 - [x] **Micro-Step 3.2**: Implement the `GET /api/jobs` endpoint in `server.js` with 5 mock junior developer jobs to make the test pass. (Green)

---

## ?? Phase 4: External Integrations (AI & Mail)

- [ ] **Micro-Step 4.1**: Write a test for `POST /api/generate-cv`. It should mock the AI SDK and assert that when a job description is sent, the server responds with a JSON object containing `{ "coverLetter": "...", "keyMatches": [] }`. (Red)
- [ ] **Micro-Step 4.2**: Create `backend/.env` placeholders. Implement the logic for `/api/generate-cv` using the AI SDK to satisfy the test. (Green)
- [ ] **Micro-Step 4.3**: Write a test for `POST /api/send-email` that mocks the Resend integration, asserting a successful email dispatch status. (Red)
- [ ] **Micro-Step 4.4**: Implement the Resend logic for `/api/send-email` to make the test pass. (Green)

---

## ?? Phase 5: Frontend Layout & UI Tests (React)

- [ ] **Micro-Step 5.1**: Install `@testing-library/react` and `jest` in the frontend folder. Write a component test for `App.jsx` checking that a loading spinner or job list area renders. (Red)
- [ ] **Micro-Step 5.2**: Build the basic Tailwind split-screen layout in `src/App.jsx` to pass the render test. (Green)
- [ ] **Micro-Step 5.3**: Write a frontend integration test that mocks the API calls and asserts that clicking "Select & Tailor" displays the generated text. (Red)
- [ ] **Micro-Step 5.4**: Implement state, fetch-logic, and wire up the buttons in React to pass all remaining frontend tests. (Green)

---

## ?? Definition of Done for EACH Micro-Step

Before checking a box, Copilot must verify:

1. The test was written first and failed. Then code was written and the test now passes (`npm test` runs green).
2. Code contains clear inline comments in Swedish explaining the logic.
3. The `README.md` file has been updated with a short technical summary of the step.
