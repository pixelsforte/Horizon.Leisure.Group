import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import backendRouter, { seedDefaultAdmin } from "./backend/src/app";
import { connectDb } from "./backend/src/dbService";

async function startServer() {
  const app = express();
const PORT = Number(process.env.PORT) || 3000;

  // 1. Setup global express request parsers
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // 2. Connect to the database (MongoDB with local JSON fallback)
  await connectDb();

  // 3. One-Time Setup page will be displayed if no administrators exist in the database.
  // Seeding default admin automatically is disabled to allow testing the setup flow.

  // 4. Mount unified REST API endpoints first
  app.use("/api", backendRouter);

  // Simple integrated API health checker
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      service: "Horizon Leisure Group Full-Stack Portal",
    });
  });

  // 5. Mount Vite development middleware or serve compiled static files
  if (process.env.NODE_ENV !== "production") {
    console.log("Vite dev server middleware mode initialized.");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Production static distribution serving mode initialized.");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // 6. Start the server on port 3000
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`=============================================================`);
    console.log(`  HORIZON LEISURE CRM DEV SERVER BOOTED SUCCESS!              `);
    console.log(`Server running on port ${PORT}`);
    console.log(`  Default Admin Panel Route: http://localhost:${PORT}/admin    `);
    console.log(`  Default Credentials: admin / password123                  `);
    console.log(`=============================================================`);
  });
}

startServer().catch((err) => {
  console.error("Critical: Failed to start the integrated server:", err);
  process.exit(1);
});
