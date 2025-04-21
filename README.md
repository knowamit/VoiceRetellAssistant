# Retell AI Voice Agent Web App

A web application that integrates with Retell AI to enable voice agent calls with a clean, modern interface.

## Project Overview

This application allows users to:
- Configure API settings for Retell AI integration
- Make voice calls to AI agents
- View call history
- Control calls (start, end, mute)

## Running Locally with Node.js 18.x

This project was designed for Node.js 20+, but if you're using Node.js 18.x, we've created several compatibility options:

### Option 1: Run with Custom ESM Loader (Recommended)

This is the easiest method - it uses an ESM loader to patch the code at runtime:

```bash
node run-node18.mjs
```

This approach:
- Adds a custom ES module loader that fixes import.meta.dirname references
- Doesn't modify any original files
- Runs the standard npm run dev command with compatibility hooks

### Option 2: Alternative Methods

If Option 1 doesn't work, try these alternatives:

```bash
# Use the bootstrap script for a split frontend/backend approach
node bootstrap.mjs

# Use the simpler start script
node start-local.mjs
```

### Troubleshooting

If you're still seeing errors related to `import.meta.dirname`, consider:

1. Upgrading to Node.js 20+ (strongly recommended)
2. Using the Replit environment where it works out of the box

## Features

- **API Configuration**: Enter your Retell AI Agent ID and API Key
- **Voice Calling**: Initiate and control voice calls with AI agents
- **Call History**: View past calls with duration and timestamps
- **Modern UI**: Clean, responsive interface design

## Development

For normal development on Node.js 20+:

```bash
npm run dev
```

This command uses the standard Replit workflow named "Start application".

## Technical Notes

- React frontend with Shadcn/UI components
- Express backend with in-memory storage
- Vite for fast development experience
- RESTful API for integrated voice agent functionality