import express from "express";

// Enkel Express-app som exporteras för testning med Supertest.
// Kommentaren förklarar syftet på svenska enligt projektreglerna.
const app = express();

// Rot-route för hälsokontroll – returnerar 200 OK.
app.get("/", (req, res) => {
  // Svarstext används bara för manuell debugging, testen kollar statuskoden.
  res.status(200).send("OK");
});

// Om filen körs direkt (ej via test), starta servern.
if (process.env.NODE_ENV !== "test") {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    /* eslint-disable no-console */
    console.log(`Server listening on port ${port}`);
  });
}

export default app;
