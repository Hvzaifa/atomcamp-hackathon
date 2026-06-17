"""Finance agent: revenue, costs, profit, and credit-risk analysis."""

from __future__ import annotations

import json

from .openai_client import call_llm

SYSTEM_PROMPT = (
    "You are a finance agent for an informal Pakistani business. Calculate total "
    "revenue from PAID orders only, total costs from expenses mentioned in raw input "
    "plus inventory consumed, and net profit. Flag any customer with 2 or more unpaid "
    "orders as a credit risk. Write summary_urdu as 1-2 casual Roman Urdu sentences a "
    "non-technical shopkeeper would understand. Return ONLY valid JSON with keys: "
    "total_revenue, total_costs, net_profit, profit_margin_pct, unpaid_amount, "
    "at_risk_customers (array of {customer, amount_owed, orders_unpaid}), summary_urdu."
)


async def run_finance(operations_output, inventory_output, raw_input, currency) -> dict:
    user_prompt = (
        f"Currency: {currency}\n\n"
        f"Raw input:\n{raw_input}\n\n"
        f"Operations output:\n{json.dumps(operations_output, default=str, indent=2)}\n\n"
        f"Inventory output:\n{json.dumps(inventory_output, default=str, indent=2)}"
    )
    return await call_llm(SYSTEM_PROMPT, user_prompt)
