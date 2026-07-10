import { useEffect, useState } from 'react'
import { fetchJson } from '../api'
import { formatLaneType } from '../utils/formatLaneType'

function BorderSelector({ onSelectionChange }) {
  const [border, setBorder] = useState('')
  const [crossing, setCrossing] = useState('')
  const [laneType, setLaneType] = useState('')
  const [ports, setPorts] = useState([])
  const [laneTypes, setLaneTypes] = useState([])
  const [loadingPorts, setLoadingPorts] = useState(false)
  const [loadingLaneTypes, setLoadingLaneTypes] = useState(false)
  const [portsError, setPortsError] = useState(null)
  const [laneTypesError, setLaneTypesError] = useState(null)

  useEffect(() => {
    if (!border) {
      setPorts([])
      return
    }

    const controller = new AbortController()
    setLoadingPorts(true)
    setPortsError(null)
    fetchJson(`/border-ports/${border}/port-names`, controller.signal)
      .then((data) => {
        setPorts(data)
        setLoadingPorts(false)
      })
      .catch((err) => {
        if (controller.signal.aborted) return
        setPorts([])
        setPortsError(err)
        setLoadingPorts(false)
      })

    return () => controller.abort()
  }, [border])

  useEffect(() => {
    if (!crossing) {
      setLaneTypes([])
      return
    }

    const controller = new AbortController()
    setLoadingLaneTypes(true)
    setLaneTypesError(null)
    fetchJson(`/border-ports/${crossing}/primary-lane-types`, controller.signal)
      .then((data) => {
        setLaneTypes(data)
        setLoadingLaneTypes(false)
      })
      .catch((err) => {
        if (controller.signal.aborted) return
        setLaneTypes([])
        setLaneTypesError(err)
        setLoadingLaneTypes(false)
      })

    return () => controller.abort()
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
        {portsError && <span className="field-error">Couldn't load ports</span>}
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
        {laneTypesError && <span className="field-error">Couldn't load lane types</span>}
      </label>
    </div>
  )
}

export default BorderSelector
