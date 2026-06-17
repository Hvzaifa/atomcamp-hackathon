"""Pydantic v2 models defining the API contract for the orchestration backend."""

from __future__ import annotations

from typing import Any, Optional

from pydantic import BaseModel, Field


# ---------------------------------------------------------------------------
# Request models
# ---------------------------------------------------------------------------


class InventoryItem(BaseModel):
    item: str
    quantity: float = 0.0
    unit_cost: float = 0.0


class OrchestrateRequest(BaseModel):
    raw_input: str
    business_type: str = ""
    currency: str = "PKR"
    inventory: list[InventoryItem] = Field(default_factory=list)


# ---------------------------------------------------------------------------
# Operations
# ---------------------------------------------------------------------------


class OrderItem(BaseModel):
    name: str
    quantity: float = 0.0
    unit_price: float = 0.0


class Order(BaseModel):
    id: str = ""
    customer: str = ""
    items: list[OrderItem] = Field(default_factory=list)
    total: float = 0.0
    status: str = ""
    payment_status: str = ""


class OperationsOutput(BaseModel):
    orders: list[Order] = Field(default_factory=list)
    total_orders: int = 0
    fulfilled_count: int = 0
    pending_count: int = 0


# ---------------------------------------------------------------------------
# Inventory
# ---------------------------------------------------------------------------


class InventoryOutput(BaseModel):
    depleted_items: list[Any] = Field(default_factory=list)
    restock_alerts: list[dict[str, Any]] = Field(default_factory=list)
    can_fulfill_tomorrow: bool = True


# ---------------------------------------------------------------------------
# Finance
# ---------------------------------------------------------------------------


class FinanceOutput(BaseModel):
    total_revenue: float = 0.0
    total_costs: float = 0.0
    net_profit: float = 0.0
    profit_margin_pct: float = 0.0
    unpaid_amount: float = 0.0
    at_risk_customers: list[dict[str, Any]] = Field(default_factory=list)
    summary_urdu: str = ""


# ---------------------------------------------------------------------------
# Strategy
# ---------------------------------------------------------------------------


class StrategyOutput(BaseModel):
    actions: list[dict[str, Any]] = Field(default_factory=list)
    top_performing_item: str = ""
    warning: Optional[str] = None


# ---------------------------------------------------------------------------
# Orchestration envelope
# ---------------------------------------------------------------------------


class TraceItem(BaseModel):
    agent: str = ""
    status: str = ""
    summary: str = ""
    output: dict[str, Any] = Field(default_factory=dict)


class OrchestrateResponse(BaseModel):
    status: str = ""
    trace: list[TraceItem] = Field(default_factory=list)
    report: dict[str, Any] = Field(default_factory=dict)
