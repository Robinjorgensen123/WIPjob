// Detta är ett grundläggande Jest-test som använder Supertest
// för att göra en HTTP-förfrågan mot Express-appen som
// senare kommer att exporteras från `../server.js`.
// Vi skapar endast testet nu — `../server.js` finns inte ännu,
// vilket gör att testet förväntas misslyckas ("Red").

// Använder ES-moduler: importera Supertest och Express-appen
import request from 'supertest';
import app from '../server.js'; // Importerar Express-appen (finns inte än)

// Gruppen innehåller tester för rot-routen `/`
describe('Root route `/`', () => {
  // Detta test skickar en GET-förfrågan till rot-routen
  // och förväntar sig HTTP-status 200.
  test('GET / should respond with 200', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
  });
});
