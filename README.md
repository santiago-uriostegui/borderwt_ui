# borderwt_ui

Frontend for Border wait times. A single-page React + Vite app that lets a
user drill into a border crossing's wait times: pick a border, a port of
entry, a primary lane type, then a secondary lane type, and view the results
as a table or a graph.

## Requirements

- Node.js
- The [BorderWT API](../BorderWT/borderwt) running locally at
  `http://127.0.0.1:8000` (FastAPI/uvicorn backend, separate repo). The UI
  fetches directly from this address, so it must be running and reachable
  with CORS enabled for `http://localhost:5183`.

## Development

```
npm install
npm run dev -- --port 5183
```

Open http://localhost:5183.

## Build

```
npm run build
```

## Structure

- `src/components/BorderSelector.jsx` — Border and Port of Entry dropdowns;
  Port options are fetched once a border is chosen.
- `src/components/SecondaryLaneTypes.jsx` — Primary/secondary lane type
  selection; the first primary lane type dropdown feeds a row of secondary
  lane type buttons.
- `src/components/WaitTimesSection.jsx` — status summary plus a Table/Graph
  toggle for the selected crossing and lane types.
- `src/components/WaitTimesTable.jsx` — history table of wait-time entries.
- `src/components/WaitTimesChart.jsx` — line graph of wait time (min) and
  open lanes over time.
- `src/hooks/useWaitTimes.js` — fetches wait-time history for a given
  border port / primary lane type / secondary lane type (capped at the first
  24 entries returned).

## API endpoints used

All requests go to `http://127.0.0.1:8000`:

- `GET /border-ports/{border}/port-names`
- `GET /border-ports/{border_port_id}/primary-lane-types`
- `GET /border-ports/{border_port_id}/primary-lane-types/{primary_lane_type}/secondary-lane-types`
- `GET /border-ports/{border_port_id}/primary-lane-types/{primary_lane_type}/secondary-lane-types/{secondary_lane_type}/wait-times`
