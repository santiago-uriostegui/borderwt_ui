import { useState } from 'react'
import './App.css'
import BorderSelector from './components/BorderSelector'
import SecondaryLaneTypes from './components/SecondaryLaneTypes'
import WaitTimesSection from './components/WaitTimesSection'

function App() {
  const [selection, setSelection] = useState({ portId: '', primaryLaneType: '' })
  const [secondaryLaneType, setSecondaryLaneType] = useState('')

  return (
    <div className="page">
      <h1>Border Wait Times</h1>
      <BorderSelector onSelectionChange={setSelection} />
      <SecondaryLaneTypes
        portId={selection.portId}
        primaryLaneType={selection.primaryLaneType}
        selected={secondaryLaneType}
        onSelect={setSecondaryLaneType}
      />
      <WaitTimesSection
        portId={selection.portId}
        primaryLaneType={selection.primaryLaneType}
        secondaryLaneType={secondaryLaneType}
      />
    </div>
  )
}

export default App
