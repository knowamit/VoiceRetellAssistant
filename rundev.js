#!/usr/bin/env node

/**
 * Simple script to start the application in development mode
 * Compatible with Node.js 18.x
 */

import { spawnSync } from 'child_process';

console.log('Starting development server compatible with Node.js 18.x...');

// Run the compatibility script
spawnSync('node', ['compatibility.js'], {
  stdio: 'inherit',
  shell: true
});