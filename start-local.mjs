#!/usr/bin/env node

/**
 * Start script for running the project locally with Node.js 18.x
 * Simplified version that directly runs the necessary commands
 */

import { spawnSync, spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get directory name in ESM
const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('Starting Retell AI Voice Agent App locally with Node.js 18.x compatibility...');

// Create local vite config
const viteConfigPath = path.join(__dirname, 'vite.config.local.js');
if (!fs.existsSync(viteConfigPath)) {
  const viteConfig = `
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from 'url';

// Get dirname in ESM
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client/src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets"),
    },
  },
  root: path.resolve(__dirname, "client"),
  server: {
    host: "0.0.0.0", 
    port: 3000
  }
});
`;
  
  fs.writeFileSync(viteConfigPath, viteConfig);
  console.log('Created local Vite configuration');
}

// Set environment variables
process.env.NODE_ENV = 'development';
process.env.VITE_CONFIG_PATH = viteConfigPath;
process.env.PROJECT_ROOT = __dirname;

// Start the development server
console.log('Starting development server...');
const devProcess = spawn('npx', ['tsx', 'server/index.ts'], {
  env: { ...process.env },
  stdio: 'inherit'
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('Shutting down...');
  devProcess.kill('SIGINT');
  process.exit(0);
});

devProcess.on('close', (code) => {
  console.log(`Development server exited with code ${code}`);
  process.exit(code);
});