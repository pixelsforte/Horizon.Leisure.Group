import express from "express";
import router, { seedDefaultAdmin } from "./app";
import { connectDb } from "./dbService";

async function bootstrap() {
  const app = express();
  const PORT = process.env.PORT || 3001;

  // JSON Request body parsers
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // CORS Headers support
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }
    next();
  });

  // Base API routes mount point
  app.use("/api", router);

  // Health probe
  app.get("/health", (req, res) => {
    res.json({ status: "ok", service: "Horizon CRM Backend" });
  });

  // Connect to the Database (Mongoose with JSON Fallback)
  await connectDb();

  // Seed default administrator login credential
  await seedDefaultAdmin();

  app.listen(Number(PORT), "0.0.0.0", () => {
    console.log(`=============================================================`);
    console.log(`  HORIZON LEISURE CRM BACKEND IS ACTIVE!                     `);
    console.log(`  Local Endpoint: http://localhost:${PORT}                    `);
    console.log(`  Default Admin: admin / password123                        `);
    console.log(`=============================================================`);
  });
}

bootstrap().catch((err) => {
  console.error("Critical error during backend bootstrap:", err);
  process.exit(1);
});
