"""Operations agent: parses raw input into structured orders."""

from __future__ import annotations

import json

from .openai_client import call_llm

SYSTEM_PROMPT = (
    "You are an operations agent for a small business. Parse the raw input and "
    "extract all orders. Identify each customer, their items, quantities, prices, "
    "and whether payment was mentioned. Infer fulfillment status based on inventory "
    "if provided. Return ONLY valid JSON with keys: orders (array of {id, customer, "
    "items:[{name, quantity, unit_price}], total, status, payment_status}), "
    "total_orders, fulfilled_count, pending_count. status must be one of: fulfilled, "
    "pending, insufficient_stock. payment_status must be one of: paid, unpaid, unknown. "
    "An empty inventory means stock is untracked, not zero. If the inventory list is "
    "empty or not provided, you must NOT mark any order as insufficient_stock; instead "
    "default status to 'fulfilled' when payment_status is 'paid', and 'pending' when "
    "unpaid. Only use 'insufficient_stock' when inventory data is explicitly provided "
    "AND the required item is genuinely short."
)


async def run_operations(raw_input, inventory, currency) -> dict:
    user_prompt = (
        f"Currency: {currency}\n\n"
        f"Raw input:\n{raw_input}\n\n"
        f"Starting inventory:\n{json.dumps(inventory, default=str, indent=2)}"
    )
    result = await call_llm(SYSTEM_PROMPT, user_prompt)

    # Normalize orders so the frontend always sees string ids and list items.
    orders = result.get("orders")
    if isinstance(orders, list):
        for order in orders:
            if not isinstance(order, dict):
                continue
            if "id" in order and order["id"] is not None:
                order["id"] = str(order["id"])
            items = order.get("items")
            if items is None:
                order["items"] = []
            elif not isinstance(items, list):
                order["items"] = [items]

    return result
