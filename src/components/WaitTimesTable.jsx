function WaitTimesTable({ waitTimes }) {
  return (
    <table className="wait-times-table">
      <thead>
        <tr>
          <th>Update Time</th>
          <th>Status</th>
          <th>Delay (min)</th>
          <th>Lanes Open</th>
        </tr>
      </thead>
      <tbody>
        {waitTimes.map((entry) => (
          <tr key={entry.update_time}>
            <td>{new Date(entry.update_time).toLocaleString()}</td>
            <td>{entry.operational_status}</td>
            <td>{entry.delay_minutes}</td>
            <td>{entry.lanes_open}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default WaitTimesTable
