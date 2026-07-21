import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";

// Backend integrations
import connectDB from "./backend/src/config/db.js";
import backendApp from "./backend/src/app.js";
import { startScheduler } from "./backend/src/scheduler/reminderScheduler.js";
import Logger from "./backend/src/utils/Logger.js";

// Load environmental parameters
dotenv.config();

const PORT = 3000;

async function startServer() {
  const app = express();

  // 1. Establish Database Connection
  await connectDB();

  // 2. Start Automated Background Schedulers
  startScheduler();

  // 3. Proxy API calls to our backend App
  app.use((req, res, next) => {
    if (req.url.startsWith("/api")) {
      return backendApp(req, res, next);
    }
    next();
  });

  // 4. Set up Vite dev-server or static build serving
  if (process.env.NODE_ENV !== "production") {
    Logger.info("Starting development server (Vite middleware)...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    Logger.info("Starting production server (Serving static assets)...");
    const distPath = path.join(process.cwd(), "dist");
    
    // Serve Vite assets statically
    app.use(express.static(distPath));
    
    // Support SPA route redirection
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // 5. Start HTTP Listener
  app.listen(PORT, "0.0.0.0", () => {
    Logger.info(`Full-stack server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  Logger.error(`Full-stack server crash: ${err.message}`);
  process.exit(1);
});
