import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);
  app.use(express.json({ limit: "10kb" }));

  // Safe demo endpoint: it only creates a temporary session identifier.
  // No password, PIN or authentication secret is accepted or persisted.
  app.post("/api/demo-session", (req, res) => {
    const identifier = typeof req.body?.identifier === "string" ? req.body.identifier.trim() : "";
    if (!identifier || identifier.length > 120) {
      res.status(400).json({ ok: false, error: "Identifiant de démonstration invalide." });
      return;
    }
    const sessionId = `demo-${crypto.randomBytes(4).toString("hex")}`;
    res.json({ ok: true, sessionId, status: "simulated_authenticated" });
  });

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true, service: "credit-agricole-demo" });
  });

  const staticPath = process.env.NODE_ENV === "production"
    ? path.resolve(__dirname, "public")
    : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;
  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
