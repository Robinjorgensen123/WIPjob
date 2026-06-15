# Job Application Accelerator ??

Detta är en fullstack-applikation byggd för att maximera hastigheten och kvaliteten vid jobbansökningar för juniora utvecklare. Appen hämtar annonser, anpassar CV:t med AI och förhandsvisar ansökan via e-post.

## Systemarkitektur & Logg (Uppdateras l�pande)

### ?? Backend & API-struktur

Micro-Step 1.3: En minimal Express-app skapades i `backend/server.js`.
Appen exporterar `app` för testning och svarar på `GET /` med status 200.
Detta gjorde att smoke-testet för rot-routen gick från Red → Green.

Micro-Step 2.2: En resume-datafil skapades i `backend/data/myResume.js`.
Filen exporterar ett objekt med `profile`, `skills` och `experience`
för en fullstack JavaScript-utvecklare så att resume-testet kan gå grönt.

Micro-Step 3.2: Implementerade `GET /api/jobs` i `backend/server.js`.
Endpointen returnerar en hårdkodad array med 5 fiktiva juniorjobb (fält: `id`, `title`, `company`, `description`) så backend-smoke-testet för jobb-API:t går grönt.

Micro-Step 10.2: Implementerade produktionellt AI-SDK-anrop i `backend/server.js`.

- `POST /api/generate-cv` accepterar nu både `jobDescription` och `userCv` i request-body.
- Servern bygger en svensk `system`-prompt och en `user`-prompt som injicerar användarens CV och jobbannonsen, och anropar `openai.chat.completions.create()` med dessa meddelanden.
- Testerna inkluderar ett integrationstest som spionerar på SDK-anropet för att säkerställa att `userCv` levereras korrekt till modellen.

Micro-Step 11.2: Frontend UI-överhalning för `JobSearch`.

- `JobSearch.jsx` innehåller nu ett sökfält (client-side filtrering), status-chips för varje jobb baserat på `status`-fältet, och en modal för att visa AI-genererat personligt brev.
- Använder Tailwind-klasser för moderna skuggor, rounded-corners och responsiv layout.
- Enhetstester (`frontend/src/pages/JobSearch.test.jsx`) verifierar sökfält, status-tags och modal (R->G enligt TDD-flödet).

Micro-Step 11.3: Slutgiltigt end-to-end smoke-test (frontend).

- En end-to-end smoke-test körs mot frontendens routing och `JobSearch`-flöde, verifierar navigation, att det dynamiska CV:t injiceras från `localStorage` till `POST /api/generate-cv`, och att användaren får korrekt UI-feedback (loading, success eller fel). Testen använder jest + testing-library och mockar nätverksanrop.

Micro-Step 11.4: Global styling och polering.

- Global CSS och Tailwind-variabler finjusterade för konsekvent spacing, färgschema och responsivitet.
- Felmeddelanden förbättrade och centraliserade; UI visar användarvänliga svenskspråkiga meddelanden vid nätverksfel eller tomt CV.
- Små visuella förbättringar applicerade i `src/index.css` och komponenters Tailwind-klasser.

### ?? Frontend & UI

_Väntar på Phase 5..._
