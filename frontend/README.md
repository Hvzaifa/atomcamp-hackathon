# relay.ai — Frontend

React + Vite single-page app for **relay.ai**: describe your business day in plain
words and four AI agents (Operations, Inventory, Finance, Strategy) turn it into
orders, inventory alerts, profit, and tomorrow's plan.

## Tech stack

- **React 19** + **Vite** (HMR, fast builds)
- **Tailwind CSS** for styling (glassmorphism / Swiss-style UI)
- **Framer Motion** for animations
- **Axios** for talking to the backend API

## Getting started

```bash
# install dependencies
npm install

# copy the env template and adjust if needed
cp .env.example .env

# start the dev server (http://localhost:5173)
npm run dev
```

## Environment variables

All Vite env vars are prefixed with `VITE_` and are **bundled into the client
JavaScript** — treat them as public and never store secrets in them.

| Variable        | Description                          | Example                     |
| --------------- | ------------------------------------ | --------------------------- |
| `VITE_API_URL`  | Base URL of the backend API          | `http://localhost:8000`     |

- `.env` — local development (gitignored)
- `.env.production` — used by `npm run build` for the deployed app (contains only
  the public production API URL, no secrets)
- `.env.example` — template; copy to `.env` to get started

## Scripts

| Command           | Description                              |
| ----------------- | ---------------------------------------- |
| `npm run dev`     | Start the Vite dev server with HMR       |
| `npm run build`   | Production build to `dist/`              |
| `npm run preview` | Preview the production build locally     |
| `npm run lint`    | Run ESLint                               |

## Project structure

```
frontend/
├── src/
│   ├── components/   # InputPanel, AgentTrace, OutputPanel
│   ├── hooks/        # useOrchestrate — calls the backend
│   ├── App.jsx       # app shell + layout
│   └── index.css     # Tailwind layers + glass styles
├── .env.example      # env template
└── vite.config.js
```

The backend (FastAPI) lives in [`../backend`](../backend).
