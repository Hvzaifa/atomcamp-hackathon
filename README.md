# relay.ai — Multi-Agent Business Intelligence

> Describe your business day in plain words (English, Urdu, or Roman Urdu) and
> four AI agents turn it into orders, inventory alerts, profit, and tomorrow's plan.

relay.ai is a hackathon project built for small-business owners. Instead of
spreadsheets, the user types a free-form sentence like:

> _"Ahmed ne 2 biryani order ki 500 wali, paisa de diya. Sara ne 1 karahi mangai
> 800 ki, abhi paisa nahi diya. Expenses: 300 PKR gas."_

…and gets a structured business report back.

---

## Architecture

```
┌──────────────┐        POST /orchestrate        ┌────────────────────────────┐
│   Frontend   │  ───────────────────────────▶   │          Backend           │
│ React + Vite │                                  │         FastAPI            │
│  (Tailwind,  │  ◀───────────────────────────   │                            │
│   Framer)    │        { trace, report }         │   Orchestrator chains:     │
└──────────────┘                                  │   1. Operations  📋        │
                                                  │   2. Inventory   📦        │
                                                  │   3. Finance     💰        │
                                                  │   4. Strategy    🎯        │
                                                  │   (each calls gpt-4o)      │
                                                  └────────────────────────────┘
```

The backend runs a **sequential multi-agent pipeline**. Each agent is a focused
LLM call whose output feeds the next:

| # | Agent          | Input                                   | Output                                                        |
|---|----------------|-----------------------------------------|---------------------------------------------------------------|
| 1 | **Operations** | raw text + inventory + currency         | parsed orders (customer, items, total, status, payment)       |
| 2 | **Inventory**  | operations output + inventory           | restock alerts, "can fulfill tomorrow?"                       |
| 3 | **Finance**    | operations + inventory + raw text       | revenue, costs, net profit, unpaid, at-risk customers, Urdu summary |
| 4 | **Strategy**   | operations + inventory + finance        | prioritized actions, top item, warnings                       |

The orchestrator returns both a **`trace`** (per-agent status for the live
pipeline animation) and a combined **`report`** (the four agent outputs).

---

## Repository layout

```
atomcamp/
├── backend/                 # FastAPI multi-agent service
│   ├── main.py              # app + CORS + routes (/, /health, /orchestrate)
│   ├── agents/
│   │   ├── orchestrator.py  # chains the four agents, builds the report
│   │   ├── operations_agent.py
│   │   ├── inventory_agent.py
│   │   ├── finance_agent.py
│   │   ├── strategy_agent.py
│   │   └── openai_client.py # shared async OpenAI client + resilient call_llm
│   ├── models/schemas.py    # Pydantic request/response contracts
│   ├── requirements.txt
│   ├── Procfile             # uvicorn entry for Railway/Heroku-style hosts
│   └── .env.example
│
├── frontend/                # React + Vite single-page app
│   ├── src/
│   │   ├── components/       # InputPanel, AgentTrace, OutputPanel
│   │   ├── hooks/            # useOrchestrate — calls the backend
│   │   ├── api/              # axios client + mock response
│   │   ├── App.jsx
│   │   └── index.css         # Tailwind layers + glass styles
│   ├── .env.example
│   └── README.md            # frontend-specific docs
│
└── README.md                # you are here
```

---

## Tech stack

**Backend** — Python · FastAPI · Uvicorn · Pydantic v2 · OpenAI (`gpt-4o`) · python-dotenv
**Frontend** — React 19 · Vite · Tailwind CSS · Framer Motion · Axios

---

## Getting started

### Prerequisites
- **Python 3.10+** and **Node.js 18+**
- An **OpenAI API key**

### 1. Backend

```bash
cd backend

# create & activate a virtual environment
python -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate

# install dependencies
pip install -r requirements.txt

# configure secrets
cp .env.example .env              # then edit .env and set OPENAI_API_KEY

# run the API (http://localhost:8000, docs at /docs)
uvicorn main:app --reload --port 8000
```

### 2. Frontend

```bash
cd frontend

npm install
cp .env.example .env              # VITE_API_URL defaults to http://localhost:8000

npm run dev                       # http://localhost:5173
```

Open the dev URL, type a business day, and hit **Run analysis**.

---

## Environment variables

| Scope    | Variable          | Secret? | Description                                            |
|----------|-------------------|---------|--------------------------------------------------------|
| Backend  | `OPENAI_API_KEY`  | **Yes** | OpenAI key used by all agents. Lives in `backend/.env` (gitignored). |
| Frontend | `VITE_API_URL`    | No      | Base URL of the backend. Bundled into client JS — public by design. |

> ⚠️ **Never put secrets in `VITE_*` variables** — Vite compiles them into the
> shipped JavaScript. The real secret (`OPENAI_API_KEY`) stays server-side only.
>
> `.env` files are gitignored. `.env.example` files are committed templates.
> `frontend/.env.production` is committed but contains **only the public backend
> URL**, no secrets.

---

## API reference

Base URL: `http://localhost:8000` (local) — interactive docs at `/docs`.

### `GET /health`
```json
{ "status": "ok", "version": "1.0" }
```

### `POST /orchestrate`

**Request**
```json
{
  "raw_input": "Ahmed ne 2 biryani order ki 500 wali, paisa de diya.",
  "business_type": "",
  "currency": "PKR",
  "inventory": [
    { "item": "biryani", "quantity": 10, "unit_cost": 300 }
  ]
}
```

**Response**
```json
{
  "status": "success",
  "trace": [
    { "agent": "operations", "status": "complete", "summary": "1 orders parsed", "output": { } }
  ],
  "report": {
    "operations": { },
    "inventory":  { },
    "finance":    { },
    "strategy":   { }
  }
}
```

The pipeline never crashes the request: any agent/LLM failure resolves to an
`{"error": ...}` object (with API keys redacted) and a partial `trace`.

---

## Scripts

**Frontend** (`cd frontend`)

| Command           | Description                          |
|-------------------|--------------------------------------|
| `npm run dev`     | Dev server with HMR                  |
| `npm run build`   | Production build to `dist/`          |
| `npm run preview` | Preview the production build         |
| `npm run lint`    | Run ESLint                           |

**Backend** (`cd backend`)

| Command                              | Description            |
|--------------------------------------|------------------------|
| `uvicorn main:app --reload`          | Run the dev server     |
| `python test_request.py`             | Send a sample request  |

---

## Deployment

- **Backend** deploys to Railway (or any Heroku-style host) via the `Procfile`:
  `web: uvicorn main:app --host 0.0.0.0 --port $PORT`. Set `OPENAI_API_KEY` in
  the host's environment.
- **Frontend** builds to static assets (`npm run build`) using
  `.env.production`'s `VITE_API_URL`. Deploy `dist/` to any static host.
- CORS is currently open (`allow_origins=["*"]`) to simplify the deployed setup.

---

## License

Hackathon project — no license specified.
