import { useEffect, useState } from 'react'
import { fetchJson } from '../api'

export function useWaitTimes(portId, primaryLaneType, secondaryLaneType) {
  const [waitTimes, setWaitTimes] = useState([])
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!portId || !primaryLaneType || !secondaryLaneType) {
      setWaitTimes([])
      setSummary(null)
      return
    }

    const controller = new AbortController()
    setLoading(true)
    setError(null)
    fetchJson(
      `/border-ports/${portId}/primary-lane-types/${primaryLaneType}/secondary-lane-types/${secondaryLaneType}/wait-times`,
      controller.signal,
    )
      .then((data) => {
        setWaitTimes((data.wait_times ?? []).slice(0, 24))
        setSummary({
          operationalStatus: data.operational_status,
          currentWait: data.current_wait,
          lanesOpen: data.lanes_open,
        })
        setLoading(false)
      })
      .catch((err) => {
        if (controller.signal.aborted) return
        setWaitTimes([])
        setSummary(null)
        setError(err)
        setLoading(false)
      })

    return () => controller.abort()
  }, [portId, primaryLaneType, secondaryLaneType])

  return { waitTimes, summary, loading, error }
}
