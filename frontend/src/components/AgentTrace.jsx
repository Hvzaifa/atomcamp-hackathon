import { motion } from 'framer-motion'

const AGENTS = [
  { key: 'operations', name: 'Operations', icon: '📋' },
  { key: 'inventory', name: 'Inventory', icon: '📦' },
  { key: 'finance', name: 'Finance', icon: '💰' },
  { key: 'strategy', name: 'Strategy', icon: '🎯' },
]

const BADGE = {
  waiting: { label: 'waiting', className: 'bg-gray-100 text-gray-500' },
  running: { label: 'running', className: 'bg-blue-100 text-blue-700 animate-pulse' },
  complete: { label: '✓ complete', className: 'bg-green-100 text-green-700' },
  error: { label: 'error', className: 'bg-red-100 text-red-700' },
}

function resolveState(traceItem, loading) {
  if (traceItem) return traceItem.status === 'error' ? 'error' : 'complete'
  return loading ? 'running' : 'waiting'
}

// Per-state animation applied to the card while it holds that state.
function stateAnimation(state) {
  switch (state) {
    case 'running':
      // Subtle continuous pulse.
      return {
        scale: [1, 1.03, 1],
        transition: { duration: 1.2, repeat: Infinity, ease: 'easeInOut' },
      }
    case 'complete':
      // Quick one-off bounce when the card lands.
      return {
        scale: [1, 1.08, 1],
        transition: { duration: 0.35, ease: 'easeOut' },
      }
    default:
      return { scale: 1 }
  }
}

function AgentTrace({ trace = [], loading = false }) {
  return (
    <div className="flex items-stretch gap-2">
      {AGENTS.map((agent, index) => {
        const traceItem = trace.find((t) => t.agent === agent.key)
        const state = resolveState(traceItem, loading)
        const badge = BADGE[state]

        return (
          <div key={agent.key} className="flex items-center flex-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0, ...stateAnimation(state) }}
              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
              className="flex-1 bg-white border border-gray-200 rounded-lg p-4 text-center"
            >
              <div className="text-3xl">{agent.icon}</div>
              <div className="mt-1 font-medium text-gray-800">{agent.name}</div>
              <span
                className={`mt-2 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${badge.className}`}
              >
                {badge.label}
              </span>
              {traceItem?.summary && (
                <p className="mt-2 text-xs text-gray-500">{traceItem.summary}</p>
              )}
            </motion.div>
            {index < AGENTS.length - 1 && (
              <div className="px-1 text-gray-300 text-xl" aria-hidden="true">
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
