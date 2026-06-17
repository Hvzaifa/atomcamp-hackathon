import { useState, useCallback } from 'react'
import { orchestrate } from '../api/client'
import { MOCK_RESPONSE } from '../api/mock'

const USE_MOCK = false

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export function useOrchestrate() {
  const [status, setStatus] = useState('idle')
  const [trace, setTrace] = useState([])
  const [report, setReport] = useState(null)
  const [error, setError] = useState(null)

  const run = useCallback(async (payload) => {
    setStatus('loading')
    setError(null)
    setTrace([])

    try {
      let result
      if (USE_MOCK) {
        await delay(1500)
        result = MOCK_RESPONSE
      } else {
        result = await orchestrate(payload)
      }

      // Data already arrived together — show report immediately, but reveal
      // the trace cards one at a time so the pipeline lights up sequentially.
      setReport(result.report || null)
      setStatus('success')

      const items = result.trace || []
      for (let i = 0; i < items.length; i++) {
        await delay(600)
        setTrace((prev) => [...prev, items[i]])
      }

      return result
    } catch (err) {
      setError(err?.message || 'Something went wrong')
      setStatus('error')
    }
  }, [])

  return { status, trace, report, error, run }
}
