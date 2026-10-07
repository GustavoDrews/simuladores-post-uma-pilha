import type { HaltStatus } from '../machines/types'

export type HistoryEntry = {
  step: number
  node: string
  memory: string
  instruction: string
  status: HaltStatus
}

type Props = { entries: HistoryEntry[] }

export function History({ entries }: Props) {
  return (
    <div className="history">
      <h3>Histórico das configurações</h3>
      <ol>
        {entries.map((e) => (
          <li key={`${e.step}-${e.node}-${e.memory}`}>
            <span className="hist-step">#{e.step}</span>
            <span className="hist-node">{e.node}</span>
            <code>{e.memory}</code>
            <small>{e.instruction}</small>
          </li>
        ))}
      </ol>
    </div>
  )
}
