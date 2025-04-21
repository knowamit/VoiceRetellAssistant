#!/usr/bin/env node

/**
 * Bootstrap script for running the app locally with Node.js 18
 * This is a simple, direct approach avoiding the complexity of the previous scripts
 */

import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory (ESM replacement for __dirname)
const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('Bootstrapping Retell AI Voice Agent App for local development...');

// Create patch file for vite config
const viteLocalPath = path.join(__dirname, 'vite.config.local.js');
if (!fs.existsSync(viteLocalPath)) {
  console.log('Creating local Vite configuration...');
  const viteContent = `
// Local Vite configuration for Node.js 18.x
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory (ESM replacement for __dirname)
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'client/src'),
      '@shared': path.resolve(__dirname, 'shared'),
      '@assets': path.resolve(__dirname, 'attached_assets'),
    },
  },
  root: path.resolve(__dirname, 'client'),
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
`;
  
  fs.writeFileSync(viteLocalPath, viteContent);
}

// Create patch file for express server
const serverPath = path.join(__dirname, 'server.mjs');
if (!fs.existsSync(serverPath)) {
  console.log('Creating server bootstrap file...');
  const serverContent = `
// Bootstrap express server for local development
import express from 'express';
import { createServer } from 'http';
import { fileURLToPath } from 'url';
import path from 'path';
import { registerRoutes } from './server/routes.js';

// Get current directory (ESM replacement for __dirname)
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Add request logging
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (req.path.startsWith('/api')) {
      console.log(\`\${req.method} \${req.path} \${res.statusCode} in \${duration}ms\`);
    }
  });
  next();
});

// Start the server
async function startServer() {
  try {
    const server = await registerRoutes(app);
    
    // Add error handling
    app.use((err, _req, res, _next) => {
      console.error(err);
      res.status(500).json({ message: err.message || 'Server error' });
    });
    
    // Start listening
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, '0.0.0.0', () => {
      console.log(\`Server running on http://localhost:\${PORT}\`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
`;
  
  fs.writeFileSync(serverPath, serverContent);
}

// Start the processes
console.log('Starting API server...');
const apiServer = spawn('node', ['--loader', 'tsx', 'server.mjs'], {
  env: { ...process.env, NODE_ENV: 'development' },
  stdio: 'inherit'
});

console.log('Starting Vite development server...');
const viteServer = spawn('npx', ['vite', '--config', viteLocalPath], {
  env: { ...process.env, NODE_ENV: 'development' },
  stdio: 'inherit'
});

// Handle termination
process.on('SIGINT', () => {
  console.log('Shutting down servers...');
  apiServer.kill('SIGINT');
  viteServer.kill('SIGINT');
  process.exit(0);
});

apiServer.on('close', (code) => {
  console.log(`API server exited with code ${code}`);
  viteServer.kill('SIGINT');
  process.exit(code);
});

viteServer.on('close', (code) => {
  console.log(`Vite server exited with code ${code}`);
  apiServer.kill('SIGINT');
});