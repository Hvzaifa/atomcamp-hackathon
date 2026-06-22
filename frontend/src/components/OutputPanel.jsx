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

function Card({ icon, title, index, children }) {
  return (
    <section className="glass rounded-3xl p-6 sm:p-7">
      <div className="mb-5 flex items-center gap-3 border-b border-white/60 pb-4">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/70 text-base shadow-glass-sm">
          {icon}
        </span>
        <h2 className="text-[15px] font-bold tracking-tight text-ink-900">
          {title}
        </h2>
        {index != null && (
          <span className="swiss-label ml-auto tabular-nums">{index}</span>
        )}
      </div>
      {children}
    </section>
  )
}

function Badge({ className, children }) {
  return (
    <span
      className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${className}`}
    >
      {children}
    </span>
  )
}

function OrdersSection({ operations }) {
  const orders = operations?.orders ?? []
  return (
    <Card icon="📋" title="Orders" index="01">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/60 text-left text-[11px] uppercase tracking-[0.12em] text-ink-400">
              <th className="py-2 pr-4 font-semibold">Customer</th>
              <th className="py-2 pr-4 font-semibold">Items</th>
              <th className="py-2 pr-4 font-semibold">Total</th>
              <th className="py-2 pr-4 font-semibold">Status</th>
              <th className="py-2 font-semibold">Payment</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, i) => (
              <tr
                key={order.id ?? i}
                className="border-b border-white/50 last:border-0 transition-colors hover:bg-white/40"
              >
                <td className="py-2.5 pr-4 font-semibold text-ink-800">
                  {order.customer}
                </td>
                <td className="py-2.5 pr-4 text-ink-500">
                  {(order.items ?? [])
                    .map((it) => `${it.quantity}× ${it.name}`)
                    .join(', ')}
                </td>
                <td className="py-2.5 pr-4 font-semibold tabular-nums text-ink-800">
                  {fmt(order.total)}
                </td>
                <td className="py-2.5 pr-4">
                  <Badge className={STATUS_BADGE[order.status] ?? 'bg-ink-100 text-ink-500'}>
                    {order.status}
                  </Badge>
                </td>
                <td className="py-2.5">
                  <Badge className={PAYMENT_BADGE[order.payment_status] ?? 'bg-ink-100 text-ink-500'}>
                    {order.payment_status}
                  </Badge>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={5} className="py-4 text-center text-ink-400">
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
    <Card icon="📦" title="Inventory" index="02">
      {alerts.length > 0 && inventory?.can_fulfill_tomorrow === false && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-200/70 bg-red-50/70 px-3.5 py-2.5 text-sm font-medium text-red-700">
          ⚠️ Cannot fulfill tomorrow's demand
        </div>
      )}
      <div className="space-y-2">
        {alerts.map((alert, i) => (
          <div
            key={alert.item ?? i}
            className="flex items-center justify-between gap-3 rounded-xl border border-white/60 bg-white/40 px-3.5 py-2.5 text-sm"
          >
            <span className="font-semibold text-ink-800">{alert.item}</span>
            <span className="tabular-nums text-ink-500">
              Stock: {fmt(alert.current_stock)} · Restock: {fmt(alert.recommended_restock)}
            </span>
            <Badge className={URGENCY_BADGE[alert.urgency] ?? 'bg-ink-100 text-ink-500'}>
              {alert.urgency}
            </Badge>
          </div>
        ))}
        {alerts.length === 0 && (
          <p className="text-sm text-ink-400">Inventory not tracked for this entry.</p>
        )}
      </div>
    </Card>
  )
}

function Stat({ label, value, valueClass = 'text-ink-900' }) {
  return (
    <div className="min-w-[120px] flex-1 rounded-2xl border border-white/60 bg-white/40 px-4 py-4">
      <div className="swiss-label">{label}</div>
      <div
        className={`mt-1.5 text-[26px] font-extrabold tracking-tight tabular-nums ${valueClass}`}
      >
        <AnimatedNumber value={value} />
      </div>
    </div>
  )
}

function FinanceSection({ finance }) {
  const atRisk = finance?.at_risk_customers ?? []
  return (
    <Card icon="💰" title="Finance" index="03">
      <div className="flex flex-wrap gap-3">
        <Stat label="Revenue" value={finance?.total_revenue} />
        <Stat label="Costs" value={finance?.total_costs} />
        <Stat
          label="Net Profit"
          value={finance?.net_profit}
          valueClass="text-emerald-600"
        />
        <Stat
          label="Unpaid"
          value={finance?.unpaid_amount}
          valueClass="text-red-500"
        />
      </div>

      {finance?.summary_urdu && (
        <div className="mt-4 rounded-2xl border border-white/60 bg-brand-50/50 px-4 py-3.5 text-lg leading-relaxed text-brand-900">
          {finance.summary_urdu}
        </div>
      )}

      {atRisk.length > 0 && (
        <div className="mt-4 space-y-2">
          {atRisk.map((c, i) => (
            <div
              key={c.customer ?? i}
              className="flex items-center justify-between rounded-xl border border-red-200/70 bg-red-50/70 px-3.5 py-2.5 text-sm text-red-700"
            >
              <span className="font-semibold">{c.customer}</span>
              <span className="font-medium tabular-nums">Owes {fmt(c.amount_owed)}</span>
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
    <Card icon="🎯" title="Strategy" index="04">
      {strategy?.warning && (
        <div className="mb-4 rounded-xl border border-amber-200/70 bg-amber-50/70 px-3.5 py-2.5 text-sm font-medium text-amber-800">
          ⚠️ {strategy.warning}
        </div>
      )}

      <div className="space-y-3">
        {actions.map((action, i) => (
          <div
            key={i}
            className="flex gap-3 rounded-xl border border-white/60 bg-white/40 p-3.5 transition-colors hover:bg-white/60"
          >
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-ink-900 text-sm font-bold tabular-nums text-white">
              {action.priority ?? i + 1}
            </div>
            <div>
              <p className="font-semibold text-ink-800">{action.action}</p>
              <p className="mt-0.5 text-sm text-ink-500">{action.reason}</p>
            </div>
          </div>
        ))}
      </div>

      {strategy?.top_performing_item && (
        <div className="mt-4">
          <Badge className="bg-emerald-100 text-emerald-700">
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
