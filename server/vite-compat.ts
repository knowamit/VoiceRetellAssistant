import { type Express } from "express";
import { type Server } from "http";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

// The project root is set by the compatibility script
const projectRoot = process.env.PROJECT_ROOT || process.cwd();

export function log(message: string, source = "express") {
  const now = new Date();
  const timeStr = now.toLocaleTimeString();
  console.log(`${timeStr} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  // Create Vite server in middleware mode and configure the app type as
  // 'custom', disabling Vite's own HTML serving logic so the parent server
  // can take control
  const viteConfigPath = process.env.VITE_CONFIG_PATH || path.join(projectRoot, 'vite.config.ts');
  
  log(`Using Vite config from: ${viteConfigPath}`, "vite-compat");

  const vite = await createViteServer({
    configFile: viteConfigPath,
    server: { middlewareMode: true },
    appType: "custom",
  });

  // Use vite's connect instance as middleware
  app.use(vite.middlewares);

  return vite;
}

export function serveStatic(app: Express) {
  // Serve static assets
  app.use(express.static(path.join(projectRoot, "dist", "public")));

  // Serve index.html for all requests that don't match a static file or API route
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) {
      return next();
    }

    const indexHtml = path.join(projectRoot, "dist", "public", "index.html");
    
    if (fs.existsSync(indexHtml)) {
      res.sendFile(indexHtml);
    } else {
      next(new Error("index.html not found"));
    }
  });
}