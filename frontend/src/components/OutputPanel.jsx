import { useEffect } from 'react'
import { motion, animate, useMotionValue, useTransform } from 'framer-motion'

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.15 },
  },
}

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
}

const STATUS_BADGE = {
  fulfilled: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  insufficient_stock: 'bg-red-100 text-red-700',
}

const PAYMENT_BADGE = {
  paid: 'bg-green-100 text-green-700',
  unpaid: 'bg-red-100 text-red-700',
  unknown: 'bg-gray-100 text-gray-600',
}

const URGENCY_BADGE = {
  critical: 'bg-red-100 text-red-700',
  low: 'bg-yellow-100 text-yellow-700',
  ok: 'bg-green-100 text-green-700',
}

const fmt = (n) => Number(n ?? 0).toLocaleString()

// Animates a number counting up from 0 to its value over 0.8s.
function AnimatedNumber({ value }) {
  const target = Number(value ?? 0)
  const count = useMotionValue(0)
  const display = useTransform(count, (v) => Math.round(v).toLocaleString())

  useEffect(() => {
    const controls = animate(count, target, { duration: 0.8, ease: 'easeOut' })
    return () => controls.stop()
  }, [count, target])

  return <motion.span>{display}</motion.span>
}

function Card({ title, children }) {
  return (
    <section className="bg-white rounded-lg shadow p-5">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-4">
        {title}
      </h2>
      {children}
    </section>
  )
}

function Badge({ className, children }) {
  return (
    <span
      className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${className}`}
    >
      {children}
    </span>
  )
}

function OrdersSection({ operations }) {
  const orders = operations?.orders ?? []
  return (
    <Card title="📋 Orders">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b border-gray-200">
              <th className="py-2 pr-4 font-medium">Customer</th>
              <th className="py-2 pr-4 font-medium">Items</th>
              <th className="py-2 pr-4 font-medium">Total</th>
              <th className="py-2 pr-4 font-medium">Status</th>
              <th className="py-2 font-medium">Payment</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, i) => (
              <tr key={order.id ?? i} className="border-b border-gray-100">
                <td className="py-2 pr-4 font-medium text-gray-800">
                  {order.customer}
                </td>
                <td className="py-2 pr-4 text-gray-600">
                  {(order.items ?? [])
                    .map((it) => `${it.quantity}× ${it.name}`)
                    .join(', ')}
                </td>
                <td className="py-2 pr-4 text-gray-800">{fmt(order.total)}</td>
                <td className="py-2 pr-4">
                  <Badge className={STATUS_BADGE[order.status] ?? 'bg-gray-100 text-gray-600'}>
                    {order.status}
                  </Badge>
                </td>
                <td className="py-2">
                  <Badge className={PAYMENT_BADGE[order.payment_status] ?? 'bg-gray-100 text-gray-600'}>
                    {order.payment_status}
                  </Badge>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={5} className="py-3 text-gray-400 text-center">
                  No orders
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

function InventorySection({ inventory }) {
  const alerts = inventory?.restock_alerts ?? []
  return (
    <Card title="📦 Inventory">
      {alerts.length > 0 && inventory?.can_fulfill_tomorrow === false && (
        <div className="mb-4 rounded-md bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
          ⚠️ Cannot fulfill tomorrow's demand
        </div>
      )}
      <div className="space-y-2">
        {alerts.map((alert, i) => (
          <div
            key={alert.item ?? i}
            className="flex items-center justify-between rounded-md border border-gray-100 px-3 py-2 text-sm"
          >
            <span className="font-medium text-gray-800">{alert.item}</span>
            <span className="text-gray-500">
              Stock: {fmt(alert.current_stock)} · Restock: {fmt(alert.recommended_restock)}
            </span>
            <Badge className={URGENCY_BADGE[alert.urgency] ?? 'bg-gray-100 text-gray-600'}>
              {alert.urgency}
            </Badge>
          </div>
        ))}
        {alerts.length === 0 && (
          <p className="text-sm text-gray-400">Inventory not tracked for this entry.</p>
        )}
      </div>
    </Card>
  )
}

function Stat({ label, value, valueClass = 'text-gray-800' }) {
  return (
    <div className="flex-1 rounded-md bg-gray-50 px-4 py-3 text-center">
      <div className="text-xs uppercase tracking-wide text-gray-500">{label}</div>
      <div className={`mt-1 text-xl font-bold ${valueClass}`}>
        <AnimatedNumber value={value} />
      </div>
    </div>
  )
}

function FinanceSection({ finance }) {
  const atRisk = finance?.at_risk_customers ?? []
  return (
    <Card title="💰 Finance">
      <div className="flex flex-wrap gap-3">
        <Stat label="Revenue" value={finance?.total_revenue} />
        <Stat label="Costs" value={finance?.total_costs} />
        <Stat
          label="Net Profit"
          value={finance?.net_profit}
          valueClass="text-green-600"
        />
        <Stat
          label="Unpaid"
          value={finance?.unpaid_amount}
          valueClass="text-red-600"
        />
      </div>

      {finance?.summary_urdu && (
        <div className="mt-4 rounded-md bg-blue-50 border border-blue-100 px-4 py-3 text-lg text-blue-900">
          {finance.summary_urdu}
        </div>
      )}

      {atRisk.length > 0 && (
        <div className="mt-4 space-y-2">
          {atRisk.map((c, i) => (
            <div
              key={c.customer ?? i}
              className="flex items-center justify-between rounded-md bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700"
            >
              <span className="font-medium">{c.customer}</span>
              <span>Owes {fmt(c.amount_owed)}</span>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}

function StrategySection({ strategy }) {
  const actions = strategy?.actions ?? []
  return (
    <Card title="🎯 Strategy">
      {strategy?.warning && (
        <div className="mb-4 rounded-md bg-amber-50 border border-amber-200 px-3 py-2 text-sm text-amber-800">
          ⚠️ {strategy.warning}
        </div>
      )}

      <div className="space-y-3">
        {actions.map((action, i) => (
          <div
            key={i}
            className="flex gap-3 rounded-md border border-gray-100 p-3"
          >
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
              {action.priority ?? i + 1}
            </div>
            <div>
              <p className="font-bold text-gray-800">{action.action}</p>
              <p className="mt-0.5 text-sm text-gray-500">{action.reason}</p>
            </div>
          </div>
        ))}
      </div>

      {strategy?.top_performing_item && (
        <div className="mt-4">
          <Badge className="bg-green-100 text-green-700">
            🏆 Top: {strategy.top_performing_item}
          </Badge>
        </div>
      )}
    </Card>
  )
}

function OutputPanel({ report }) {
  if (!report) return null

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={sectionVariants}>
        <OrdersSection operations={report.operations} />
      </motion.div>
      <motion.div variants={sectionVariants}>
        <InventorySection inventory={report.inventory} />
      </motion.div>
      <motion.div variants={sectionVariants}>
        <FinanceSection finance={report.finance} />
      </motion.div>
      <motion.div variants={sectionVariants}>
        <StrategySection strategy={report.strategy} />
      </motion.div>
    </motion.div>
  )
}

export default OutputPanel
