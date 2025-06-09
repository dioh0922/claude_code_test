# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Start server**: `npm start` or `npm run dev` - Starts the Express server on port 3000
- **Install dependencies**: `npm install`
- **Test**: No test framework is currently configured (test script exits with error)

## Architecture

This is a minimal Node.js Express server with the following structure:

- **Main application**: `index.js` - Single-file Express server with JSON middleware
- **Dependencies**: Uses Express.js v5.1.0 for HTTP server functionality
- **API Endpoints**:
  - `GET /` - Returns a simple "Hello World!" JSON message
  - `GET /list` - Returns an empty items array

The server runs on port 3000 and uses `express.json()` middleware for parsing JSON request bodies.