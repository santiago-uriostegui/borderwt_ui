import { useState } from 'react'
import { useWaitTimes } from '../hooks/useWaitTimes'
import WaitTimesTable from './WaitTimesTable'
import WaitTimesChart from './WaitTimesChart'

function WaitTimesSection({ portId, primaryLaneType, secondaryLaneType }) {
  const [view, setView] = useState('table')
  const { waitTimes, summary, loading, error } = useWaitTimes(
    portId,
    primaryLaneType,
    secondaryLaneType,
  )

  if (!secondaryLaneType) {
    return null
  }

  if (loading) {
    return <p>Loading wait times&hellip;</p>
  }

  if (error) {
    return <p className="field-error">Couldn't load wait times</p>
  }

  if (!summary) {
    return null
  }

  return (
    <div className="wait-times">
      <h2 className="wait-times-summary">Port Lane Status: {summary.operationalStatus}</h2>
      <h3 className="wait-times-detail">
        Current wait: {summary.currentWait} min &middot; Open lanes: {summary.lanesOpen}
      </h3>

      <div className="view-toggle">
        <button
          type="button"
          aria-pressed={view === 'table'}
          className={view === 'table' ? 'selected' : ''}
          onClick={() => setView('table')}
        >
          Table
        </button>
        <button
          type="button"
          aria-pressed={view === 'graph'}
          className={view === 'graph' ? 'selected' : ''}
          onClick={() => setView('graph')}
        >
          Graph
        </button>
      </div>

      {view === 'table' ? (
        <WaitTimesTable waitTimes={waitTimes} />
      ) : (
        <WaitTimesChart waitTimes={waitTimes} />
      )}
    </div>
  )
}

export default WaitTimesSection
