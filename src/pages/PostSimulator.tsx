import { useEffect, useState } from 'react'
import { Controls } from '../components/Controls'
import { Flowchart } from '../components/Flowchart'
import { HaltBanner } from '../components/HaltBanner'
import { History, type HistoryEntry } from '../components/History'
import { QueueView } from '../components/QueueView'
import { initPost, stepPost } from '../engine/post'
import { PROGRAMS, stateById } from '../machines/programs'
import type { MachineGraph, PostConfig } from '../machines/types'

const AUTO_MS = 400
const MAX_STEPS = 500

function formatQueue(queue: string[]) {
  return queue.length === 0 ? 'λ' : queue.join(' ')
}

function snapshot(graph: MachineGraph, config: PostConfig): HistoryEntry {
  return {
    step: config.stepIndex,
    node: stateById(graph, config.nodeId).name,
    memory: `X = ${formatQueue(config.queue)}`,
    instruction: config.instruction,
    status: config.status,
  }
}

export function PostSimulator() {
  const program = PROGRAMS.post
  const graph = program.graph
  const [input, setInput] = useState<string>(program.sampleInput)
  const [auto, setAuto] = useState(false)

  const [config, setConfig] = useState<PostConfig>(() => initPost(graph, input))
  const [history, setHistory] = useState<HistoryEntry[]>(() => [
    snapshot(graph, initPost(graph, input)),
  ])

  function restart(nextGraph = graph, nextInput = input) {
    const next = initPost(nextGraph, nextInput)
    setConfig(next)
    setHistory([snapshot(nextGraph, next)])
    setAuto(false)
  }

  useEffect(() => {
    const next = initPost(graph, input)
    setConfig(next)
    setHistory([snapshot(graph, next)])
    setAuto(false)
  }, [graph, input])

  function doStep() {
    if (config.status !== 'RUNNING') {
      setAuto(false)
      return
    }
    if (config.stepIndex >= MAX_STEPS) {
      const next = {
        ...config,
        status: 'LOOP' as const,
        instruction: `Limite de ${MAX_STEPS} passos atingido sem parada`,
        memoryEvent: 'idle' as const,
      }
      setConfig(next)
      setHistory((h) => [...h, snapshot(graph, next)])
      setAuto(false)
      return
    }
    const next = stepPost(graph, config)
    setConfig(next)
    setHistory((h) => [...h, snapshot(graph, next)])
    if (next.status !== 'RUNNING') setAuto(false)
  }

  useEffect(() => {
    if (!auto) return
    const id = window.setInterval(() => {
      setConfig((current) => {
        if (current.status !== 'RUNNING') {
          setAuto(false)
          return current
        }
        if (current.stepIndex >= MAX_STEPS) {
          const next = {
            ...current,
            status: 'LOOP' as const,
            instruction: `Limite de ${MAX_STEPS} passos atingido sem parada`,
            memoryEvent: 'idle' as const,
          }
          setHistory((h) => [...h, snapshot(graph, next)])
          setAuto(false)
          return next
        }
        const next = stepPost(graph, current)
        setHistory((h) => [...h, snapshot(graph, next)])
        if (next.status !== 'RUNNING') setAuto(false)
        return next
      })
    }, AUTO_MS)
    return () => window.clearInterval(id)
  }, [auto, graph])

  const nodeName = stateById(graph, config.nodeId).name

  return (
    <div className="simulator">
      <header className="sim-header">
        <div>
          <h2>Máquina de Post</h2>
          <p>
            Memória: uma fila X (entrada, trabalho e saída). Leitura na frente,
            gravação no fim. Símbolo auxiliar #.
          </p>
          <p className="alphabet">
            Alfabeto de entrada: <strong>{'{ a, b }'}</strong>. Deixe o campo
            vazio para usar a palavra vazia (λ).
          </p>
        </div>
        <HaltBanner status={config.status} />
      </header>

      <Controls
        input={input}
        onInput={setInput}
        onStep={doStep}
        onAuto={() => setAuto((v) => !v)}
        onReset={() => restart()}
        auto={auto}
        disabledStep={config.status !== 'RUNNING'}
      />

      <p className="hint">
        Altere a entrada e clique em <strong>Reiniciar</strong> para carregar a
        palavra na fila. Programa definido no código: <strong>{program.title}</strong>
        . Linguagem: {program.language}
      </p>

      <div className="sim-grid">
        <section>
          <h3>Fluxograma do programa</h3>
          <Flowchart
            graph={graph}
            currentId={config.nodeId}
            lastFrom={config.lastFrom}
            lastTo={config.lastTo}
          />
          <History entries={history} />
        </section>
        <section>
          <div className="status-card">
            <h3>Configuração atual</h3>
            <p>
              Nó: <strong>{nodeName}</strong>
            </p>
            <p>
              Passo: <strong>{config.stepIndex}</strong>
            </p>
            <p className="instruction">
              Instrução atual: <strong>{config.instruction}</strong>
            </p>
          </div>
          <QueueView symbols={config.queue} event={config.memoryEvent} />
        </section>
      </div>
    </div>
  )
}
