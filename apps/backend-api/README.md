# Backend API

A small, security-conscious Node.js/Express API written in TypeScript.

## Features

- Health and version endpoints
- Example `/api/v1/echo` route
- Helmet, basic logging, request IDs
- Centralized error handling with structured JSON errors
- Jest tests (unit + integration)
- Dockerfile for production

## Getting Started

```bash
cd apps/backend-api

# install deps
npm install

# run in dev mode
npm run dev

# run tests
npm test

# build
npm run build

# run compiled app
npm start
```

Environment variables are defined in `.env.example`.

