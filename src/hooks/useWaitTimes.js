import { useEffect, useState } from 'react'

export function useWaitTimes(portId, primaryLaneType, secondaryLaneType) {
  const [waitTimes, setWaitTimes] = useState([])
  const [summary, setSummary] = useState(null)

  useEffect(() => {
    if (!portId || !primaryLaneType || !secondaryLaneType) {
      setWaitTimes([])
      setSummary(null)
      return
    }

    fetch(
      `http://127.0.0.1:8000/border-ports/${portId}/primary-lane-types/${primaryLaneType}/secondary-lane-types/${secondaryLaneType}/wait-times`,
    )
      .then((res) => res.json())
      .then((data) => {
        setWaitTimes((data.wait_times ?? []).slice(0, 24))
        setSummary({
          operationalStatus: data.operational_status,
          currentWait: data.current_wait,
          lanesOpen: data.lanes_open,
        })
      })
      .catch(() => {
        setWaitTimes([])
        setSummary(null)
      })
  }, [portId, primaryLaneType, secondaryLaneType])

  return { waitTimes, summary }
}
