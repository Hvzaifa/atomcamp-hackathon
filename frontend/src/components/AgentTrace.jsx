import { motion } from 'framer-motion'

const AGENTS = [
  { key: 'operations', name: 'Operations', icon: '📋' },
  { key: 'inventory', name: 'Inventory', icon: '📦' },
  { key: 'finance', name: 'Finance', icon: '💰' },
  { key: 'strategy', name: 'Strategy', icon: '🎯' },
]

const BADGE = {
  waiting: { label: 'idle', className: 'bg-ink-100 text-ink-400' },
  running: { label: 'running', className: 'bg-brand-100 text-brand-700 animate-pulse' },
  complete: { label: 'done', className: 'bg-emerald-100 text-emerald-700' },
  error: { label: 'error', className: 'bg-red-100 text-red-700' },
}

const CARD_STATE = {
  waiting: 'opacity-60',
  running: 'ring-2 ring-brand-300/70',
  complete: '',
  error: 'ring-2 ring-red-300/70',
}

function resolveState(traceItem, loading) {
  if (traceItem) return traceItem.status === 'error' ? 'error' : 'complete'
  return loading ? 'running' : 'waiting'
}

// Variants keyed by state label. Driving `animate` with a label (a string)
// instead of a fresh object each render means framer-motion only animates on a
// real state change — re-renders while the trace fills in no longer restart the
// animation (which previously made the cards flicker in and out).
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  waiting: { opacity: 1, y: 0, scale: 1 },
  running: { opacity: 1, y: 0, scale: 1 },
  // One-off bounce when a card lands as complete; plays once, not every render.
  complete: { opacity: 1, y: 0, scale: [1, 1.06, 1] },
  error: { opacity: 1, y: 0, scale: 1 },
}

function AgentTrace({ trace = [], loading = false }) {
  return (
    <div className="flex items-stretch gap-2">
      {AGENTS.map((agent, index) => {
        const traceItem = trace.find((t) => t.agent === agent.key)
        const state = resolveState(traceItem, loading)
        const badge = BADGE[state]

        return (
          <div key={agent.key} className="flex flex-1 items-center">
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate={state}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className={`glass flex-1 rounded-2xl p-4 text-center transition-[box-shadow,opacity] ${CARD_STATE[state]}`}
            >
              <div className="text-2xl">{agent.icon}</div>
              <div className="mt-2 text-sm font-semibold tracking-tight text-ink-800">
                {agent.name}
              </div>
              <span
                className={`mt-2 inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${badge.className}`}
              >
                {badge.label}
              </span>
              {traceItem?.summary && (
                <p className="mt-2 text-xs leading-snug text-ink-500">
                  {traceItem.summary}
                </p>
              )}
            </motion.div>
            {index < AGENTS.length - 1 && (
              <div className="px-1 text-ink-300" aria-hidden="true">
                →
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default AgentTrace
