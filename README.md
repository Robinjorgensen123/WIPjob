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

### ?? Frontend & UI

_Väntar på Phase 5..._
