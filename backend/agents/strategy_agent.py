"""Strategy agent: actionable recommendations from the full day's data."""

from __future__ import annotations

import json

from .openai_client import call_llm

SYSTEM_PROMPT = (
    "You are a business strategy agent. Based on today's full operations, inventory, "
    "and finance data, generate exactly 3 specific actionable recommendations for "
    "tomorrow, ranked by priority. Identify the top-selling item. Flag any anomaly "
    "(stock nearly out, high unpaid balance, loss-making item) in the warning field, "
    "or null if none. Return ONLY valid JSON with keys: actions (array of {priority, "
    "action, reason}), top_performing_item, warning. "
    "Always use the provided currency code (e.g. PKR) when mentioning money. "
    "Never use $ or other currency symbols."
)


async def run_strategy(operations_output, inventory_output, finance_output, currency) -> dict:
    user_prompt = (
        f"Currency: {currency}\n\n"
        f"Operations output:\n{json.dumps(operations_output, default=str, indent=2)}\n\n"
        f"Inventory output:\n{json.dumps(inventory_output, default=str, indent=2)}\n\n"
        f"Finance output:\n{json.dumps(finance_output, default=str, indent=2)}"
    )
    return await call_llm(SYSTEM_PROMPT, user_prompt)
