import { useEffect, useState } from 'react'
import { formatLaneType } from '../utils/formatLaneType'

function SecondaryLaneTypes({ portId, primaryLaneType, selected, onSelect }) {
  const [laneTypes, setLaneTypes] = useState([])

  useEffect(() => {
    onSelect('')

    if (!portId || !primaryLaneType) {
      setLaneTypes([])
      return
    }

    fetch(
      `http://127.0.0.1:8000/border-ports/${portId}/primary-lane-types/${primaryLaneType}/secondary-lane-types`,
    )
      .then((res) => res.json())
      .then((data) => {
        setLaneTypes(data)
        onSelect(data[0]?.secondary_lane_type ?? '')
      })
      .catch(() => setLaneTypes([]))
  }, [portId, primaryLaneType, onSelect])

  if (!portId || !primaryLaneType) {
    return null
  }

  return (
    <div className="secondary-lane-types">
      {laneTypes.map((lane) => (
        <button
          key={lane.secondary_lane_type}
          type="button"
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
