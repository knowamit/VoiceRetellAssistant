import express, { type Express, type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import session from "express-session";
import MemoryStore from "memorystore";
import { registerRoutes } from "./routes";
import { log } from "./vite";
import path from "path";

// Create the Session Store
const MemoryStoreSession = MemoryStore(session);

// Create the express app
export const app: Express = express();

// Add middleware to parse requests
app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Add session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || "keyboard cat",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === "production" },
    store: new MemoryStoreSession({
      checkPeriod: 86400000, // prune expired entries every 24h
    }),
  }),
);

// Use the project root from environment variable (set by compatibility script)
const projectRoot = process.env.PROJECT_ROOT || process.cwd();

// Setup static file serving for attached assets
app.use('/assets', express.static(path.join(projectRoot, 'attached_assets')));

// Start the server if this file is run directly
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  
  registerRoutes(app).then((server) => {
    server.listen(PORT, "0.0.0.0", () => {
      log(`serving on port ${PORT}`);
    });
  });
}

// Error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});