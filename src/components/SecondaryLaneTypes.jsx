import { useEffect, useState } from 'react'
import { fetchJson } from '../api'
import { formatLaneType } from '../utils/formatLaneType'

function SecondaryLaneTypes({ portId, primaryLaneType, selected, onSelect }) {
  const [laneTypes, setLaneTypes] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    onSelect('')

    if (!portId || !primaryLaneType) {
      setLaneTypes([])
      return
    }

    const controller = new AbortController()
    setLoading(true)
    setError(null)
    fetchJson(
      `/border-ports/${portId}/primary-lane-types/${primaryLaneType}/secondary-lane-types`,
      controller.signal,
    )
      .then((data) => {
        setLaneTypes(data)
        onSelect(data[0]?.secondary_lane_type ?? '')
        setLoading(false)
      })
      .catch((err) => {
        if (controller.signal.aborted) return
        setLaneTypes([])
        setError(err)
        setLoading(false)
      })

    return () => controller.abort()
  }, [portId, primaryLaneType, onSelect])

  if (!portId || !primaryLaneType) {
    return null
  }

  return (
    <div className="secondary-lane-types">
      {loading && <span>Loading lane types&hellip;</span>}
      {error && <span className="field-error">Couldn't load lane types</span>}
      {laneTypes.map((lane) => (
        <button
          key={lane.secondary_lane_type}
          type="button"
          aria-pressed={selected === lane.secondary_lane_type}
          className={selected === lane.secondary_lane_type ? 'selected' : ''}
          onClick={() => onSelect(lane.secondary_lane_type)}
        >
          {formatLaneType(lane.secondary_lane_type)}
        </button>
      ))}
    </div>
  )
}

export default SecondaryLaneTypes
