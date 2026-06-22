import { useState } from 'react'
import { motion } from 'framer-motion'

const PLACEHOLDER =
  'e.g. Ahmed ne 2 biryani order ki 500 wali, paisa de diya. ' +
  'Sara ne 1 karahi mangai 800 ki, abhi paisa nahi diya. Expenses: 300 PKR gas.'

const CURRENCIES = ['PKR', 'INR', 'USD']

const emptyRow = () => ({ item: '', quantity: '', unit_cost: '' })

function InputPanel({ onSubmit, loading }) {
  const [rawInput, setRawInput] = useState('')
  const [currency, setCurrency] = useState('PKR')
  const [showInventory, setShowInventory] = useState(false)
  const [items, setItems] = useState([])

  const addRow = () => setItems((prev) => [...prev, emptyRow()])

  const removeRow = (index) =>
    setItems((prev) => prev.filter((_, i) => i !== index))

  const updateRow = (index, field, value) =>
    setItems((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)),
    )

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmed = rawInput.trim()
    if (!trimmed || loading) return

    const inventory = items
      .filter((row) => row.item.trim())
      .map((row) => ({
        item: row.item.trim(),
        quantity: Number(row.quantity) || 0,
        unit_cost: Number(row.unit_cost) || 0,
      }))

    onSubmit({
      raw_input: trimmed,
      business_type: '',
      currency,
      inventory,
    })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="glass rounded-3xl p-6 sm:p-7"
    >
      <label htmlFor="raw_input" className="swiss-label mb-2.5 block">
        Today's activity
      </label>
      <textarea
        id="raw_input"
        value={rawInput}
        onChange={(e) => setRawInput(e.target.value)}
        placeholder={PLACEHOLDER}
        rows={5}
        disabled={loading}
        className="w-full resize-y rounded-2xl border border-white/70 bg-white/60 p-4 text-[15px] leading-relaxed text-ink-800 placeholder:text-ink-400 transition focus:border-brand-300 focus:bg-white/90 focus:outline-none focus:ring-4 focus:ring-brand-100/70 disabled:opacity-60"
      />

      <div className="mt-4 flex items-center gap-2.5">
        <label htmlFor="currency" className="swiss-label">
          Currency
        </label>
        <select
          id="currency"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          disabled={loading}
          className="rounded-lg border border-white/70 bg-white/70 px-2.5 py-1.5 text-sm font-semibold text-ink-700 transition focus:border-brand-300 focus:outline-none focus:ring-4 focus:ring-brand-100/70 disabled:opacity-60"
        >
          {CURRENCIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-5 border-t border-white/60 pt-4">
        <button
          type="button"
          onClick={() => setShowInventory((v) => !v)}
          className="flex items-center gap-1.5 text-sm font-semibold text-ink-700 transition hover:text-brand-600"
        >
          <span className="text-xs text-ink-400">
            {showInventory ? '▼' : '▶'}
          </span>
          Add Inventory <span className="font-normal text-ink-400">(optional)</span>
        </button>

        {showInventory && (
          <div className="mt-3 space-y-2">
            {items.map((row, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="text"
                  value={row.item}
                  onChange={(e) => updateRow(i, 'item', e.target.value)}
                  placeholder="Item name"
                  disabled={loading}
                  className="flex-1 rounded-lg border border-white/70 bg-white/60 px-2.5 py-1.5 text-sm transition focus:border-brand-300 focus:outline-none focus:ring-4 focus:ring-brand-100/70 disabled:opacity-60"
                />
                <input
                  type="number"
                  value={row.quantity}
                  onChange={(e) => updateRow(i, 'quantity', e.target.value)}
                  placeholder="Qty"
                  min="0"
                  step="any"
                  disabled={loading}
                  className="w-24 rounded-lg border border-white/70 bg-white/60 px-2.5 py-1.5 text-sm transition focus:border-brand-300 focus:outline-none focus:ring-4 focus:ring-brand-100/70 disabled:opacity-60"
                />
                <input
                  type="number"
                  value={row.unit_cost}
                  onChange={(e) => updateRow(i, 'unit_cost', e.target.value)}
                  placeholder="Unit cost"
                  min="0"
                  step="any"
                  disabled={loading}
                  className="w-28 rounded-lg border border-white/70 bg-white/60 px-2.5 py-1.5 text-sm transition focus:border-brand-300 focus:outline-none focus:ring-4 focus:ring-brand-100/70 disabled:opacity-60"
                />
                <button
                  type="button"
                  onClick={() => removeRow(i)}
                  disabled={loading}
                  className="rounded-lg px-2 py-1.5 text-sm text-red-500 transition hover:bg-red-50 disabled:opacity-50"
                  aria-label="Remove item"
                >
                  ✕
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={addRow}
              disabled={loading}
              className="text-sm font-semibold text-brand-600 transition hover:text-brand-700 disabled:opacity-50"
            >
              + Add item
            </button>
          </div>
        )}
      </div>

      <motion.button
        type="submit"
        disabled={loading || !rawInput.trim()}
        whileHover={{ scale: 1.015 }}
        whileTap={{ scale: 0.985 }}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-ink-900 px-6 py-3.5 text-sm font-semibold tracking-tight text-white shadow-glass transition hover:bg-ink-800 disabled:cursor-not-allowed disabled:bg-ink-300 disabled:shadow-none sm:w-auto"
      >
        {loading ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            Analyzing…
          </>
        ) : (
          <>Run analysis →</>
        )}
      </motion.button>
    </form>
  )
}

export default InputPanel
