import { useEffect, useState } from 'react'
import { formatLaneType } from '../utils/formatLaneType'

function BorderSelector({ onSelectionChange }) {
  const [border, setBorder] = useState('')
  const [crossing, setCrossing] = useState('')
  const [laneType, setLaneType] = useState('')
  const [ports, setPorts] = useState([])
  const [laneTypes, setLaneTypes] = useState([])
  const [loadingPorts, setLoadingPorts] = useState(false)
  const [loadingLaneTypes, setLoadingLaneTypes] = useState(false)

  useEffect(() => {
    if (!border) {
      setPorts([])
      return
    }

    setLoadingPorts(true)
    fetch(`http://127.0.0.1:8000/border-ports/${border}/port-names`)
      .then((res) => res.json())
      .then((data) => setPorts(data))
      .catch(() => setPorts([]))
      .finally(() => setLoadingPorts(false))
  }, [border])

  useEffect(() => {
    if (!crossing) {
      setLaneTypes([])
      return
    }

    setLoadingLaneTypes(true)
    fetch(`http://127.0.0.1:8000/border-ports/${crossing}/primary-lane-types`)
      .then((res) => res.json())
      .then((data) => setLaneTypes(data))
      .catch(() => setLaneTypes([]))
      .finally(() => setLoadingLaneTypes(false))
  }, [crossing])

  useEffect(() => {
    onSelectionChange?.({ portId: crossing, primaryLaneType: laneType })
  }, [crossing, laneType, onSelectionChange])

  const handleBorderChange = (e) => {
    setBorder(e.target.value)
    setCrossing('')
    setLaneType('')
  }

  const handleCrossingChange = (e) => {
    setCrossing(e.target.value)
    setLaneType('')
  }

  return (
    <div className="border-filters">
      <label>
        Border:
        <select value={border} onChange={handleBorderChange}>
          <option value="" disabled hidden>Select a border</option>
          <option value="Canadian Border">Canadian Border</option>
          <option value="Mexican Border">Mexican Border</option>
        </select>
      </label>

      <label>
        Port:
        <select
          value={crossing}
          onChange={handleCrossingChange}
          disabled={!border || loadingPorts}
        >
          <option value="" disabled hidden>Select a port</option>
          {ports.map((port) => (
            <option key={port.id} value={port.id}>
              {port.port_name}
            </option>
          ))}
        </select>
      </label>

      <label>
        Lane type:
        <select
          value={laneType}
          onChange={(e) => setLaneType(e.target.value)}
          disabled={!crossing || loadingLaneTypes}
        >
          <option value="" disabled hidden>Select a lane type</option>
          {laneTypes.map((lane) => (
            <option key={lane.primary_lane_type} value={lane.primary_lane_type}>
              {formatLaneType(lane.primary_lane_type)}
            </option>
          ))}
        </select>
      </label>
    </div>
  )
}

export default BorderSelector
