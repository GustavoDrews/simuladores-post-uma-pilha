import { outgoing, stateById } from '../machines/programs'
import type { HaltStatus, MachineGraph, PostConfig } from '../machines/types'

function haltOf(graph: MachineGraph, nodeId: string): HaltStatus | null {
  const state = stateById(graph, nodeId)
  if (state.reject) return 'REJEITA'
  if (state.final) return 'ACEITA'
  return null
}

export function initPost(graph: MachineGraph, input: string): PostConfig {
  const halted = haltOf(graph, graph.initialId)
  return {
    nodeId: graph.initialId,
    queue: input === '' ? [] : [...input],
    status: halted ?? 'RUNNING',
    instruction: halted
      ? halted === 'ACEITA'
        ? 'Computação encerrada: ACEITA'
        : 'Computação encerrada: REJEITA'
      : 'Partida — pronta para o primeiro passo',
    lastFrom: null,
    lastTo: null,
    stepIndex: 0,
    memoryEvent: 'idle',
  }
}

export function stepPost(graph: MachineGraph, config: PostConfig): PostConfig {
  if (config.status !== 'RUNNING') return config

  const haltedNow = haltOf(graph, config.nodeId)
  if (haltedNow) {
    return {
      ...config,
      status: haltedNow,
      instruction:
        haltedNow === 'ACEITA'
          ? 'Nó de parada ACEITA'
          : 'Nó de parada REJEITA',
      memoryEvent: 'idle',
    }
  }

  const edges = outgoing(graph, config.nodeId)
  const write = edges.find((edge) => edge.operation.kind === 'postWrite')

  if (write && write.operation.kind === 'postWrite') {
    const symbol = write.operation.symbol === 'λ' ? '' : write.operation.symbol
    const nextQueue = symbol === '' ? [...config.queue] : [...config.queue, symbol]
    const to = write.to
    const halt = haltOf(graph, to)
    return {
      nodeId: to,
      queue: nextQueue,
      status: halt ?? 'RUNNING',
      instruction: `Atribuição X ← X·${write.operation.symbol}  →  ${stateById(graph, to).name}`,
      lastFrom: config.nodeId,
      lastTo: to,
      stepIndex: config.stepIndex + 1,
      memoryEvent: 'enqueue',
    }
  }

  if (edges.some((edge) => edge.operation.kind === 'postRead')) {
    const front = config.queue.length === 0 ? 'λ' : config.queue[0]
    const edge = edges.find(
      (candidate) =>
        candidate.operation.kind === 'postRead' &&
        candidate.operation.symbol === front,
    )
    if (!edge) {
      return {
        ...config,
        status: 'TRAVADA',
        instruction: `Sem transição para o símbolo lido “${front}”`,
        memoryEvent: 'idle',
      }
    }
    const nextQueue =
      front === 'λ' ? [...config.queue] : config.queue.slice(1)
    const halt = haltOf(graph, edge.to)
    return {
      nodeId: edge.to,
      queue: nextQueue,
      status: halt ?? 'RUNNING',
      instruction: `Desvio X ← ler X  (leu “${front}”)  →  ${stateById(graph, edge.to).name}`,
      lastFrom: config.nodeId,
      lastTo: edge.to,
      stepIndex: config.stepIndex + 1,
      memoryEvent: front === 'λ' ? 'idle' : 'dequeue',
    }
  }

  return {
    ...config,
    status: 'TRAVADA',
    instruction: 'Nó sem operação reconhecida (travada)',
    memoryEvent: 'idle',
  }
}

export function runPostUntilHalt(
  graph: MachineGraph,
  input: string,
  maxSteps = 500,
): PostConfig {
  let config = initPost(graph, input)
  for (let i = 0; i < maxSteps && config.status === 'RUNNING'; i += 1) {
    config = stepPost(graph, config)
  }
  return config
}
