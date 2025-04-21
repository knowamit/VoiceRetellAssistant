#!/usr/bin/env node

/**
 * Compatibility script for running the project on Node.js v18.x
 * This script provides a workaround for import.meta.dirname which is not available in Node.js 18
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

// Get the current working directory as the project root
const projectRoot = process.cwd();

console.log('Setting up compatibility environment for Node.js 18.x...');
console.log(`Project root detected as: ${projectRoot}`);

// Create a temporary TypeScript file with the correct paths
const tempFilePath = path.join(projectRoot, 'temp-server.ts');
const tempContent = `
import { app } from './server/index';
import { createServer } from 'http';
import { setupVite, log, serveStatic } from './server/vite';

// Define paths using Node.js 18 compatible approach
process.env.PROJECT_ROOT = '${projectRoot.replace(/\\/g, '\\\\')}';

// Start the server
const PORT = process.env.PORT || 5000;
const server = createServer(app);

async function startServer() {
  try {
    if (process.env.NODE_ENV === 'development') {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }
    
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

// Create a patched version of the server/index.ts file if it doesn't use the correct method
// We'll create a backup first
const serverIndexPath = path.join(projectRoot, 'server', 'index.ts');
const serverIndexBackupPath = path.join(projectRoot, 'server', 'index.ts.backup');

// Check if we already have a backup
const hasBackup = fs.existsSync(serverIndexBackupPath);

if (!hasBackup) {
  // Read the content of the server/index.ts file
  const serverIndexContent = fs.readFileSync(serverIndexPath, 'utf8');
  
  // Create a backup of the original file
  fs.writeFileSync(serverIndexBackupPath, serverIndexContent);
  console.log('Created backup of server/index.ts.');
  
  // Check if the file uses import.meta.dirname and patch it if needed
  if (serverIndexContent.includes('import.meta.dirname')) {
    const patchedContent = serverIndexContent
      .replace(/import\.meta\.dirname/g, "process.env.PROJECT_ROOT");
    
    fs.writeFileSync(serverIndexPath, patchedContent);
    console.log('Patched server/index.ts for Node.js 18 compatibility.');
  }
}

// Create a vite.config.ts proxy if needed
const viteConfigPath = path.join(projectRoot, 'vite.config.ts');
const viteConfigProxyPath = path.join(projectRoot, 'vite.config.proxy.ts');

// Check if we already have a vite config proxy
const hasViteProxy = fs.existsSync(viteConfigProxyPath);

if (!hasViteProxy) {
  const viteProxyContent = `
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

// Use Node.js 18 compatible path approach
const projectRoot = process.env.PROJECT_ROOT || process.cwd();

export default defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    themePlugin(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(projectRoot, "client", "src"),
      "@shared": path.resolve(projectRoot, "shared"),
      "@assets": path.resolve(projectRoot, "attached_assets"),
    },
  },
  root: path.resolve(projectRoot, "client"),
  build: {
    outDir: path.resolve(projectRoot, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    host: "0.0.0.0",
    port: 3000,
  }
});
`;

  fs.writeFileSync(viteConfigProxyPath, viteProxyContent);
  console.log('Created vite.config.proxy.ts for Node.js 18 compatibility.');
}

// Start the server using tsx and our temp file
console.log('Starting server with compatibility settings...');
process.env.NODE_ENV = 'development';
process.env.VITE_CONFIG_PATH = viteConfigProxyPath;

const child = spawn('npx', ['tsx', tempFilePath], {
  env: { ...process.env },
  stdio: 'inherit',
  shell: true
});

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