// Exact orchestrator response captured from the backend end-to-end test
// (raw_input: Ahmed + Sara biryani/karahi order). Used for UI development.
export const MOCK_RESPONSE = {
  status: 'success',
  trace: [
    {
      agent: 'operations',
      status: 'complete',
      summary: '2 orders parsed',
      output: {
        orders: [
          {
            id: '1',
            customer: 'Ahmed',
            items: [{ name: 'Biryani', quantity: 2, unit_price: 500 }],
            total: 1000,
            status: 'fulfilled',
            payment_status: 'paid',
          },
          {
            id: '2',
            customer: 'Sara',
            items: [{ name: 'Karahi', quantity: 1, unit_price: 800 }],
            total: 800,
            status: 'insufficient_stock',
            payment_status: 'unpaid',
          },
        ],
        total_orders: 2,
        fulfilled_count: 1,
        pending_count: 0,
      },
    },
    {
      agent: 'inventory',
      status: 'complete',
      summary: '2 restock alerts',
      output: {
        depleted_items: [
          { item: 'Rice', used: 1.0, remaining: 0.0 },
          { item: 'Chicken', used: 2.0, remaining: 0.0 },
        ],
        restock_alerts: [
          {
            item: 'Rice',
            current_stock: 0.0,
            recommended_restock: 5.0,
            urgency: 'critical',
          },
          {
            item: 'Chicken',
            current_stock: 0.0,
            recommended_restock: 5.0,
            urgency: 'critical',
          },
        ],
        can_fulfill_tomorrow: false,
      },
    },
    {
      agent: 'finance',
      status: 'complete',
      summary: 'Profit: 700 PKR',
      output: {
        total_revenue: 1000,
        total_costs: 300,
        net_profit: 700,
        profit_margin_pct: 70.0,
        unpaid_amount: 800,
        at_risk_customers: [
          { customer: 'Sara', amount_owed: 800, orders_unpaid: 1 },
        ],
        summary_urdu:
          'Ahmed ka paisa mil gaya, Sara ka abhi nahi mila. Sara ko dekhna parega.',
      },
    },
    {
      agent: 'strategy',
      status: 'complete',
      summary: '3 actions generated',
      output: {
        actions: [
          {
            priority: 1,
            action: 'Restock critical inventory items immediately',
            reason:
              'Rice and Chicken are out of stock, preventing fulfillment of orders and impacting revenue potential.',
          },
          {
            priority: 2,
            action: 'Follow up with Sara for payment',
            reason:
              'Sara has an unpaid balance of 800, which is impacting cash flow.',
          },
          {
            priority: 3,
            action: 'Review stock management procedures',
            reason:
              'Insufficient stock led to an unfulfilled order, indicating a need for better inventory management.',
          },
        ],
        top_performing_item: 'Biryani',
        warning: 'Stock nearly out',
      },
    },
  ],
  report: {
    operations: {
      orders: [
        {
          id: '1',
          customer: 'Ahmed',
          items: [{ name: 'Biryani', quantity: 2, unit_price: 500 }],
          total: 1000,
          status: 'fulfilled',
          payment_status: 'paid',
        },
        {
          id: '2',
          customer: 'Sara',
          items: [{ name: 'Karahi', quantity: 1, unit_price: 800 }],
          total: 800,
          status: 'insufficient_stock',
          payment_status: 'unpaid',
        },
      ],
      total_orders: 2,
      fulfilled_count: 1,
      pending_count: 0,
    },
    inventory: {
      depleted_items: [
        { item: 'Rice', used: 1.0, remaining: 0.0 },
        { item: 'Chicken', used: 2.0, remaining: 0.0 },
      ],
      restock_alerts: [
        {
          item: 'Rice',
          current_stock: 0.0,
          recommended_restock: 5.0,
          urgency: 'critical',
        },
        {
          item: 'Chicken',
          current_stock: 0.0,
          recommended_restock: 5.0,
          urgency: 'critical',
        },
      ],
      can_fulfill_tomorrow: false,
    },
    finance: {
      total_revenue: 1000,
      total_costs: 300,
      net_profit: 700,
      profit_margin_pct: 70.0,
      unpaid_amount: 800,
      at_risk_customers: [
        { customer: 'Sara', amount_owed: 800, orders_unpaid: 1 },
      ],
      summary_urdu:
        'Ahmed ka paisa mil gaya, Sara ka abhi nahi mila. Sara ko dekhna parega.',
    },
    strategy: {
      actions: [
        {
          priority: 1,
          action: 'Restock critical inventory items immediately',
          reason:
            'Rice and Chicken are out of stock, preventing fulfillment of orders and impacting revenue potential.',
        },
        {
          priority: 2,
          action: 'Follow up with Sara for payment',
          reason:
            'Sara has an unpaid balance of 800, which is impacting cash flow.',
        },
        {
          priority: 3,
          action: 'Review stock management procedures',
          reason:
            'Insufficient stock led to an unfulfilled order, indicating a need for better inventory management.',
        },
      ],
      top_performing_item: 'Biryani',
      warning: 'Stock nearly out',
    },
  },
}
