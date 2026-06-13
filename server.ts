import express from "express";
import { app } from "./src/apiServer";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const PORT = 3000;

  // Serve static files / Vite asset resolver
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Professional KidBikeEval Server booted securely on http://localhost:${PORT}`);
  });
}

startServer();
