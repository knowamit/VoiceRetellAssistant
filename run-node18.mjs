#!/usr/bin/env node

/**
 * Direct compatibility script for Node.js 18.x
 * This script handles the import.meta.dirname issue by patching node's module loader
 */

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Get the current directory
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Create patch files directory if it doesn't exist
const patchDir = path.join(__dirname, '.node18-compat');
if (!fs.existsSync(patchDir)) {
  fs.mkdirSync(patchDir, { recursive: true });
}

// Create a loader.mjs file to intercept imports
const loaderPath = path.join(patchDir, 'loader.mjs');
const loaderContent = `
// Custom ESM loader for Node.js 18.x
import { URL, pathToFileURL } from 'url';
import path from 'path';
import fs from 'fs';

// Store the project root
const projectRoot = '${__dirname.replace(/\\/g, '\\\\')}';

// This loader intercepts module loads to patch import.meta.dirname references
export async function resolve(specifier, context, nextResolve) {
  // Just pass to the next resolver
  return nextResolve(specifier, context);
}

export async function load(url, context, nextLoad) {
  // Load the module normally
  const result = await nextLoad(url, context);
  
  // Only transform JavaScript/TypeScript modules
  if (result.format === 'module' || result.format === 'commonjs') {
    const { source } = result;
    
    // Only modify text-based sources
    if (source instanceof ArrayBuffer || typeof source === 'string') {
      let code = source instanceof ArrayBuffer 
        ? Buffer.from(source).toString('utf8')
        : source;
      
      // Check if code contains import.meta.dirname
      if (code.includes('import.meta.dirname')) {
        // Replace import.meta.dirname with the project root
        code = code.replace(/import\\.meta\\.dirname/g, \`"\${projectRoot}"\`);
        
        // Return the modified code
        return {
          format: result.format,
          source: code,
          shortCircuit: true,
        };
      }
    }
  }
  
  // Return the original module
  return result;
}
`;

fs.writeFileSync(loaderPath, loaderContent);
console.log(`Created ESM loader hook at ${loaderPath}`);

// Create a simple starter script
console.log('Starting application with Node.js 18.x compatibility...');
console.log('This runs the original npm run dev command with hooks for compatibility');

// Run the dev script with our custom loader
const devProcess = spawn('npm', ['run', 'dev'], {
  env: {
    ...process.env,
    NODE_OPTIONS: `--experimental-loader=${loaderPath}`
  },
  stdio: 'inherit',
  shell: true
});

// Handle process signals
process.on('SIGINT', () => {
  console.log('Shutting down...');
  devProcess.kill('SIGINT');
});

devProcess.on('close', (code) => {
  console.log(`Server exited with code ${code}`);
  process.exit(code);
});