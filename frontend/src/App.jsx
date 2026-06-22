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

// Minimal Swiss relay glyph: two forwarding chevrons.
function RelayMark() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M2.5 4l3.5 4-3.5 4M8 4l3.5 4L8 12"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function App() {
  const { status, trace, report, error, run } = useOrchestrate()

  return (
    <div className="relative min-h-screen">
      {/* Drifting aurora — the colour the glass refracts. */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-20 overflow-hidden [contain:strict]"
      >
        <div className="absolute -right-28 -top-40 h-[40rem] w-[40rem] rounded-full bg-brand-400/30 blur-3xl animate-drift transform-gpu will-change-transform" />
        <div className="absolute left-1/2 top-1/4 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-violet-400/20 blur-3xl animate-drift-slow transform-gpu will-change-transform" />
        <div className="absolute -left-32 bottom-0 h-[32rem] w-[32rem] rounded-full bg-cyan-300/25 blur-3xl animate-drift transform-gpu will-change-transform" />
      </div>
      {/* Swiss precision grid, barely-there. */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 bg-[linear-gradient(to_right,rgba(12,14,18,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(12,14,18,0.035)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_85%)]"
      />

      <header className="sticky top-0 z-20 glass-soft border-x-0 border-t-0">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3.5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-[11px] bg-ink-900 text-white shadow-glass-sm">
              <RelayMark />
            </div>
            <span className="text-[17px] font-bold tracking-tight text-ink-900">
              relay<span className="text-brand-600">.ai</span>
            </span>
          </div>
          <span className="swiss-label hidden sm:block">
            Business intelligence, in plain words
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 pb-20 pt-14">
        <section className="mb-12 text-center">
          <span className="swiss-label inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
            Four agents · one report
          </span>
          <h1 className="mx-auto mt-5 max-w-3xl text-balance text-4xl font-extrabold leading-[1.05] tracking-tight text-ink-900 sm:text-5xl">
            Describe your day.
            <br className="hidden sm:block" />
            <span className="text-ink-400"> Get a full business report.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-ink-500">
            Type your day in plain words. Four AI agents turn it into orders,
            inventory alerts, profit, and tomorrow's plan.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {INTRO_AGENTS.map((agent, index) => (
              <div key={agent.name} className="flex items-center gap-2">
                <div className="glass flex items-center gap-2 rounded-full px-3.5 py-1.5 shadow-glass-sm">
                  <span className="text-sm">{agent.icon}</span>
                  <span className="text-[13px] font-semibold tracking-tight text-ink-700">
                    {agent.name}
                  </span>
                </div>
                {index < INTRO_AGENTS.length - 1 && (
                  <span className="text-ink-300" aria-hidden="true">
                    /
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>

        <InputPanel onSubmit={run} loading={status === 'loading'} />

        {(status === 'loading' || status === 'success') && (
          <div className="mt-8">
            <AgentTrace trace={trace} loading={status === 'loading'} />
          </div>
        )}

        {error && (
          <div className="glass mt-6 rounded-2xl border-red-200/70 bg-red-50/60 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        <div className="mt-8">
          <OutputPanel report={report} />
        </div>
      </main>
    </div>
  )
}

export default App
