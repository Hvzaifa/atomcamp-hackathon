"""FastAPI entrypoint for the multi-agent orchestration backend."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from agents.orchestrator import run_orchestration
from models.schemas import OrchestrateRequest

app = FastAPI(title="Business Agent Orchestrator", version="1.0")

app.add_middleware(
    CORSMiddleware,
    # Allow all origins for now. allow_credentials must be False when using "*".
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "Business Agent Orchestrator API. See /docs for usage."}


@app.get("/health")
async def health():
    return {"status": "ok", "version": "1.0"}


@app.post("/orchestrate")
async def orchestrate(body: OrchestrateRequest):
    return await run_orchestration(body)
