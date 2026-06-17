import { useOrchestrate } from './hooks/useOrchestrate'
import InputPanel from './components/InputPanel'
import AgentTrace from './components/AgentTrace'
import OutputPanel from './components/OutputPanel'

// Mirrors the agents in AgentTrace; shown as a preview before the user runs.
const INTRO_AGENTS = [
  { name: 'Operations', icon: '📋' },
  { name: 'Inventory', icon: '📦' },
  { name: 'Finance', icon: '💰' },
  { name: 'Strategy', icon: '🎯' },
]

function App() {
  const { status, trace, report, error, run } = useOrchestrate()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-blue-600">BizOps AI</h1>
          <p className="text-sm text-gray-500">
            Your business's COO and CFO, automatically
          </p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <section className="mb-8 text-center">
          <p className="text-gray-600">
            Type your day in plain words. Four AI agents turn it into orders,
            inventory alerts, profit, and tomorrow's plan.
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            {INTRO_AGENTS.map((agent, index) => (
              <div key={agent.name} className="flex items-center gap-2">
                <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5">
                  <span className="text-xl">{agent.icon}</span>
                  <span className="text-sm font-medium text-gray-700">
                    {agent.name}
                  </span>
                </div>
                {index < INTRO_AGENTS.length - 1 && (
                  <span className="text-gray-300" aria-hidden="true">
                    →
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>

        <InputPanel onSubmit={run} loading={status === 'loading'} />

        {(status === 'loading' || status === 'success') && (
          <div className="mt-6">
            <AgentTrace trace={trace} loading={status === 'loading'} />
          </div>
        )}

        {error && (
          <p className="mt-4 text-sm text-red-600">{error}</p>
        )}

        <div className="mt-6">
          <OutputPanel report={report} />
        </div>
      </main>
    </div>
  )
}

export default App
