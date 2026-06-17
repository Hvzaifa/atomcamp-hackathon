"""Inventory agent: computes stock consumption and restock alerts."""

from __future__ import annotations

import json

from .openai_client import call_llm

SYSTEM_PROMPT = (
    "You are an inventory agent. Given the orders processed and starting inventory, "
    "calculate what stock was consumed. Flag items below safe threshold. Determine if "
    "tomorrow's likely demand can be met. Return ONLY valid JSON with keys: "
    "depleted_items (array of {item, used, remaining}), restock_alerts (array of "
    "{item, current_stock, recommended_restock, urgency}), can_fulfill_tomorrow "
    "(boolean). urgency must be one of: critical, low, ok."
)


async def run_inventory(operations_output, inventory) -> dict:
    user_prompt = (
        f"Orders processed:\n{json.dumps(operations_output, default=str, indent=2)}\n\n"
        f"Starting inventory:\n{json.dumps(inventory, default=str, indent=2)}"
    )
    return await call_llm(SYSTEM_PROMPT, user_prompt)
