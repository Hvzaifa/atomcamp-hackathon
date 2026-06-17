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
      className="bg-white border border-gray-200 rounded-lg p-4"
    >
      <label
        htmlFor="raw_input"
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        Describe today's business activity
      </label>
      <textarea
        id="raw_input"
        value={rawInput}
        onChange={(e) => setRawInput(e.target.value)}
        placeholder={PLACEHOLDER}
        rows={5}
        disabled={loading}
        className="w-full rounded-md border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
      />

      <div className="mt-3 flex items-center gap-2">
        <label htmlFor="currency" className="text-sm font-medium text-gray-700">
          Currency
        </label>
        <select
          id="currency"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          disabled={loading}
          className="rounded-md border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
        >
          {CURRENCIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4 border-t border-gray-100 pt-3">
        <button
          type="button"
          onClick={() => setShowInventory((v) => !v)}
          className="flex items-center gap-1 text-sm font-medium text-gray-700"
        >
          <span className="text-gray-400">{showInventory ? '▼' : '▶'}</span>
          Add Inventory (optional)
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
                  className="flex-1 rounded-md border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />
                <input
                  type="number"
                  value={row.quantity}
                  onChange={(e) => updateRow(i, 'quantity', e.target.value)}
                  placeholder="Qty"
                  min="0"
                  step="any"
                  disabled={loading}
                  className="w-24 rounded-md border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />
                <input
                  type="number"
                  value={row.unit_cost}
                  onChange={(e) => updateRow(i, 'unit_cost', e.target.value)}
                  placeholder="Unit cost"
                  min="0"
                  step="any"
                  disabled={loading}
                  className="w-28 rounded-md border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />
                <button
                  type="button"
                  onClick={() => removeRow(i)}
                  disabled={loading}
                  className="rounded-md px-2 py-1 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
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
              className="text-sm font-medium text-blue-600 hover:text-blue-700 disabled:opacity-50"
            >
              + Add item
            </button>
          </div>
        )}
      </div>

      <motion.button
        type="submit"
        disabled={loading || !rawInput.trim()}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="mt-4 inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? 'Analyzing…' : 'Run Analysis'}
      </motion.button>
    </form>
  )
}

export default InputPanel
