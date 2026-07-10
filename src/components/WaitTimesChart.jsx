import { useMemo, useState } from 'react'

const WIDTH = 640
const HEIGHT = 280
const PADDING = { top: 16, right: 16, bottom: 64, left: 44 }

const SERIES = [
  { key: 'delay_minutes', label: 'Wait time', unit: 'min', className: 'chart-line-wait' },
  { key: 'lanes_open', label: 'Open lanes', unit: 'lanes', className: 'chart-line-lanes' },
]

function niceMax(value) {
  if (value <= 0) return 10
  const magnitude = 10 ** Math.floor(Math.log10(value))
  return Math.ceil(value / magnitude) * magnitude
}

function WaitTimesChart({ waitTimes }) {
  const [hoverIndex, setHoverIndex] = useState(null)

  const points = useMemo(() => [...waitTimes].reverse(), [waitTimes])

  const plotWidth = WIDTH - PADDING.left - PADDING.right
  const plotHeight = HEIGHT - PADDING.top - PADDING.bottom
  const maxValue = niceMax(
    Math.max(...points.flatMap((p) => SERIES.map((s) => p[s.key] ?? 0)), 0),
  )

  const xFor = (i) =>
    points.length > 1 ? (i / (points.length - 1)) * plotWidth : plotWidth / 2
  const yFor = (value) => plotHeight - (value / maxValue) * plotHeight

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((t) => Math.round(maxValue * t))

  const handleMove = (e) => {
    if (points.length === 0) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * plotWidth
    const i = Math.round((x / plotWidth) * (points.length - 1))
    setHoverIndex(Math.min(Math.max(i, 0), points.length - 1))
  }

  if (points.length === 0) {
    return null
  }

  const hovered = hoverIndex !== null ? points[hoverIndex] : null
  const last = points[points.length - 1]

  return (
    <div className="wait-times-chart">
      <div className="chart-legend">
        {SERIES.map((s) => (
          <span key={s.key} className="chart-legend-item">
            <svg width="16" height="8" className={s.className}>
              <line x1="0" y1="4" x2="16" y2="4" />
            </svg>
            {s.label}
          </span>
        ))}
      </div>

      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        onMouseMove={handleMove}
        onMouseLeave={() => setHoverIndex(null)}
      >
        <g transform={`translate(${PADDING.left}, ${PADDING.top})`}>
          {yTicks.map((tick) => (
            <g key={tick} transform={`translate(0, ${yFor(tick)})`}>
              <line x1={0} x2={plotWidth} className="chart-gridline" />
              <text x={-8} y={4} className="chart-axis-label" textAnchor="end">
                {tick}
              </text>
            </g>
          ))}

          {SERIES.map((s) => (
            <path
              key={s.key}
              d={points
                .map(
                  (p, i) => `${i === 0 ? 'M' : 'L'} ${xFor(i)} ${yFor(p[s.key] ?? 0)}`,
                )
                .join(' ')}
              className={s.className}
              fill="none"
            />
          ))}

          {points.map((p, i) => (
            <rect
              key={p.update_time}
              x={xFor(i) - 12}
              y={0}
              width={24}
              height={plotHeight}
              fill="transparent"
              onMouseEnter={() => setHoverIndex(i)}
            />
          ))}

          {hovered && (
            <>
              <line
                x1={xFor(hoverIndex)}
                x2={xFor(hoverIndex)}
                y1={0}
                y2={plotHeight}
                className="chart-crosshair"
              />
              {SERIES.map((s) => (
                <circle
                  key={s.key}
                  cx={xFor(hoverIndex)}
                  cy={yFor(hovered[s.key] ?? 0)}
                  r={5}
                  className={`chart-dot ${s.className}`}
                />
              ))}
            </>
          )}

          {SERIES.map((s) => (
            <text
              key={s.key}
              x={xFor(points.length - 1)}
              y={yFor(last[s.key] ?? 0) - 10}
              className={`chart-end-label ${s.className}`}
              textAnchor="end"
            >
              {last[s.key]} {s.unit}
            </text>
          ))}

          {points.map((p, i) => (
            <text
              key={p.update_time}
              x={xFor(i)}
              y={plotHeight + 14}
              className="chart-axis-label"
              textAnchor="end"
              transform={`rotate(-45, ${xFor(i)}, ${plotHeight + 14})`}
            >
              {new Date(p.update_time).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </text>
          ))}
        </g>

        <text
          x={12}
          y={HEIGHT / 2}
          transform={`rotate(-90, 12, ${HEIGHT / 2})`}
          className="chart-axis-title"
          textAnchor="middle"
        >
          Value
        </text>

        <text
          x={PADDING.left + plotWidth / 2}
          y={HEIGHT - 6}
          className="chart-axis-title"
          textAnchor="middle"
        >
          Time of day
        </text>
      </svg>

      {hovered && (
        <div className="chart-tooltip">
          {SERIES.map((s) => (
            <div key={s.key} className="chart-tooltip-row">
              <svg width="12" height="8" className={s.className}>
                <line x1="0" y1="4" x2="12" y2="4" />
              </svg>
              <strong>
                {hovered[s.key]} {s.unit}
              </strong>
            </div>
          ))}
          <span>{new Date(hovered.update_time).toLocaleString()}</span>
        </div>
      )}
    </div>
  )
}

export default WaitTimesChart
