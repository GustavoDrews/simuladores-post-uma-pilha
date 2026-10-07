import type { MachineGraph } from '../machines/types'

const R = 28

type Props = {
  graph: MachineGraph
  currentId: string
  lastFrom: string | null
  lastTo: string | null
}

function circlePoint(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  radius: number,
) {
  const dx = x2 - x1
  const dy = y2 - y1
  const len = Math.hypot(dx, dy) || 1
  return { x: x1 + (dx / len) * radius, y: y1 + (dy / len) * radius }
}

export function Flowchart({ graph, currentId, lastFrom, lastTo }: Props) {
  const xs = graph.states.map((state) => state.x)
  const ys = graph.states.map((state) => state.y)
  const minX = Math.min(...xs) - 70
  const minY = Math.min(...ys) - 80
  const maxX = Math.max(...xs) + 70
  const maxY = Math.max(...ys) + 70
  const width = maxX - minX
  const height = maxY - minY

  const pairCount = new Map<string, number>()
  for (const transition of graph.transitions) {
    const key = `${transition.from}->${transition.to}`
    pairCount.set(key, (pairCount.get(key) ?? 0) + 1)
  }
  const used = new Map<string, number>()

  return (
    <div className="flowchart-wrap">
      <svg
        className="flowchart"
        viewBox={`${minX} ${minY} ${width} ${height}`}
        role="img"
        aria-label="Fluxograma da máquina"
      >
        <defs>
          <marker
            id="arrow"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="8"
            markerHeight="8"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
          </marker>
          <marker
            id="arrow-hot"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="8"
            markerHeight="8"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#b45309" />
          </marker>
        </defs>

        {graph.transitions.map((transition) => {
          const from = graph.states.find(
            (state) => state.id === transition.from,
          )
          const to = graph.states.find((state) => state.id === transition.to)
          if (!from || !to) return null

          const key = `${transition.from}->${transition.to}`
          const index = used.get(key) ?? 0
          used.set(key, index + 1)
          const count = pairCount.get(key) ?? 1
          const active =
            lastFrom === transition.from && lastTo === transition.to

          const start = circlePoint(from.x, from.y, to.x, to.y, R)
          const end = circlePoint(to.x, to.y, from.x, from.y, R + 2)
          const dx = end.x - start.x
          const dy = end.y - start.y
          const length = Math.hypot(dx, dy) || 1
          const offset = (index - (count - 1) / 2) * 36
          const midX = (start.x + end.x) / 2 - (dy / length) * offset
          const midY = (start.y + end.y) / 2 + (dx / length) * offset
          const path = `M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`
          const labelX = (start.x + 2 * midX + end.x) / 4
          const labelY = (start.y + 2 * midY + end.y) / 4

          return (
            <g
              key={`${key}-${index}-${transition.label}`}
              className={active ? 'edge hot' : 'edge'}
            >
              <path
                d={path}
                fill="none"
                markerEnd={active ? 'url(#arrow-hot)' : 'url(#arrow)'}
              />
              <text x={labelX} y={labelY - 6} textAnchor="middle">
                {transition.label || 'λ'}
              </text>
            </g>
          )
        })}

        {graph.states.map((state) => {
          const className = [
            'node',
            state.id === currentId ? 'current' : '',
            state.final ? 'accept' : '',
            state.reject ? 'reject' : '',
          ]
            .filter(Boolean)
            .join(' ')
          return (
            <g key={state.id} className={className}>
              {state.initial ? (
                <line
                  className="initial-arrow"
                  x1={state.x - R - 24}
                  y1={state.y}
                  x2={state.x - R}
                  y2={state.y}
                  markerEnd="url(#arrow)"
                />
              ) : null}
              <circle cx={state.x} cy={state.y} r={R} />
              {state.final ? (
                <circle cx={state.x} cy={state.y} r={R - 5} />
              ) : null}
              <text x={state.x} y={state.y + 4} textAnchor="middle">
                {state.name}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
