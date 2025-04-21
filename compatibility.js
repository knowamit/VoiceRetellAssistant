#!/usr/bin/env node

/**
 * Compatibility script for running the project on Node.js v18.x
 * This script provides a workaround for import.meta.dirname which is not available in Node.js 18
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

// Get the current working directory as the project root
const projectRoot = process.cwd();

console.log('Setting up compatibility environment for Node.js 18.x...');
console.log(`Project root detected as: ${projectRoot}`);

// Create a temporary TypeScript file with the correct paths
const tempFilePath = path.join(projectRoot, 'temp-server.ts');
const tempContent = `
import express from 'express';
import { createServer } from 'http';
import { registerRoutes } from './server/routes';
import { log } from './server/vite';

// Define paths using Node.js 18 compatible approach
process.env.PROJECT_ROOT = '${projectRoot.replace(/\\/g, '\\\\')}';

// Create Express app
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Add logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = \`\${req.method} \${path} \${res.statusCode} in \${duration}ms\`;
      if (capturedJsonResponse) {
        logLine += \` :: \${JSON.stringify(capturedJsonResponse)}\`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

async function startServer() {
  try {
    const server = await registerRoutes(app);

    // Error handler
    app.use((err, _req, res, _next) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      res.status(status).json({ message });
    });

    // Set up imports dynamically to avoid Node.js 18 issues
    const { setupVite, serveStatic } = await import('./server/vite.js');

    // Set up Vite or static serving
    if (process.env.NODE_ENV === 'development') {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }

    // Start server
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, '0.0.0.0', () => {
      log(\`serving on port \${PORT}\`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
`;

// Write the temporary file
fs.writeFileSync(tempFilePath, tempContent);
console.log('Created temporary server startup file.');

// Create a patched version of the vite.config.ts if needed
const viteConfigProxyPath = path.join(projectRoot, 'vite.config.local.js');

// Create vite config proxy
const viteProxyContent = `
// Local vite configuration for Node.js 18 compatibility
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from 'url';

// Get dirname in ESM
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client/src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets"),
    },
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    host: "0.0.0.0", 
    port: 3000,
  }
});
`;

fs.writeFileSync(viteConfigProxyPath, viteProxyContent);
console.log('Created vite.config.local.js for Node.js 18 compatibility.');

// Start the server using tsx and our temp file
console.log('Starting server with compatibility settings...');
process.env.NODE_ENV = 'development';
process.env.VITE_CONFIG_PATH = viteConfigProxyPath;

// Use spawn from child_process
const child = spawn('npx', ['tsx', tempFilePath], {
  env: { ...process.env },
  stdio: 'inherit',
  shell: true
});

// Event listeners
child.on('close', (code) => {
  console.log(`Server process exited with code ${code}`);
  
  // Clean up temp file when the server exits
  try {
    fs.unlinkSync(tempFilePath);
    console.log('Cleaned up temporary files.');
  } catch (err) {
    console.error('Failed to clean up temporary files:', err);
  }
});

// Handle process termination
process.on('SIGINT', () => {
  child.kill('SIGINT');
});

process.on('SIGTERM', () => {
  child.kill('SIGTERM');
});