"""Orchestrator: chains the four agents sequentially and builds the report."""

from __future__ import annotations

from models.schemas import OrchestrateRequest

from .finance_agent import run_finance
from .inventory_agent import run_inventory
from .operations_agent import run_operations
from .strategy_agent import run_strategy


def _trace_item(agent: str, result: dict, summary: str) -> dict:
    status = "error" if "error" in result else "complete"
    return {"agent": agent, "status": status, "summary": summary, "output": result}


async def run_orchestration(body: OrchestrateRequest) -> dict:
    # Plain dicts so each agent serializes the inventory cleanly as JSON.
    inventory = [item.model_dump() for item in body.inventory]

    trace: list[dict] = []

    try:
        ops = await run_operations(body.raw_input, inventory, body.currency)
        trace.append(
            _trace_item("operations", ops, f"{ops.get('total_orders', 0)} orders parsed")
        )

        inv = await run_inventory(ops, inventory)
        trace.append(
            _trace_item(
                "inventory", inv, f"{len(inv.get('restock_alerts', []))} restock alerts"
            )
        )

        fin = await run_finance(ops, inv, body.raw_input, body.currency)
        trace.append(
            _trace_item(
                "finance", fin, f"Profit: {fin.get('net_profit', 0)} {body.currency}"
            )
        )

        strat = await run_strategy(ops, inv, fin, body.currency)
        trace.append(
            _trace_item(
                "strategy", strat, f"{len(strat.get('actions', []))} actions generated"
            )
        )

        return {
            "status": "success",
            "trace": trace,
            "report": {
                "operations": ops,
                "inventory": inv,
                "finance": fin,
                "strategy": strat,
            },
        }
    except Exception as e:  # never crash the request
        return {"status": "error", "message": str(e), "trace": trace}
