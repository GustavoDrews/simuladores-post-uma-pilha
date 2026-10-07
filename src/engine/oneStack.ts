import { outgoing, stateById } from '../machines/programs'
import type { HaltStatus, MachineGraph, OneStackConfig } from '../machines/types'

function haltOf(graph: MachineGraph, nodeId: string): HaltStatus | null {
  const state = stateById(graph, nodeId)
  if (state.reject) return 'REJEITA'
  if (state.final) return 'ACEITA'
  return null
}

export function initOneStack(graph: MachineGraph, input: string): OneStackConfig {
  const halted = haltOf(graph, graph.initialId)
  return {
    nodeId: graph.initialId,
    input: input === '' ? [] : [...input],
    stack: [],
    status: halted ?? 'RUNNING',
    instruction: halted
      ? halted === 'ACEITA'
        ? 'Computação encerrada: ACEITA'
        : 'Computação encerrada: REJEITA'
      : 'Partida — pilha Y vazia, fila X com a entrada',
    lastFrom: null,
    lastTo: null,
    stepIndex: 0,
    memoryEvent: 'idle',
  }
}

export function stepOneStack(
  graph: MachineGraph,
  config: OneStackConfig,
): OneStackConfig {
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
  const push = edges.find((edge) => edge.operation.kind === 'pushStack')
  const goto = edges.find((edge) => edge.operation.kind === 'goto')
  const hasReadX = edges.some((edge) => edge.operation.kind === 'readInput')
  const hasReadY = edges.some((edge) => edge.operation.kind === 'readStack')

  if (push && push.operation.kind === 'pushStack') {
    const symbol = push.operation.symbol
    const nextStack =
      symbol === 'λ' ? [...config.stack] : [...config.stack, symbol]
    const to = push.to
    const halt = haltOf(graph, to)
    return {
      nodeId: to,
      input: [...config.input],
      stack: nextStack,
      status: halt ?? 'RUNNING',
      instruction: `Empilha Y ← ${symbol}·Y  →  ${stateById(graph, to).name}`,
      lastFrom: config.nodeId,
      lastTo: to,
      stepIndex: config.stepIndex + 1,
      memoryEvent: 'push',
    }
  }

  if (hasReadX) {
    const front = config.input.length === 0 ? 'λ' : config.input[0]
    const edge = edges.find(
      (candidate) =>
        candidate.operation.kind === 'readInput' &&
        candidate.operation.symbol === front,
    )
    if (!edge) {
      return {
        ...config,
        status: 'TRAVADA',
        instruction: `Sem transição para X ← ler X com “${front}”`,
        memoryEvent: 'idle',
      }
    }
    const nextInput = front === 'λ' ? [...config.input] : config.input.slice(1)
    const halt = haltOf(graph, edge.to)
    return {
      nodeId: edge.to,
      input: nextInput,
      stack: [...config.stack],
      status: halt ?? 'RUNNING',
      instruction: `Desvio X ← ler X  (leu “${front}”)  →  ${stateById(graph, edge.to).name}`,
      lastFrom: config.nodeId,
      lastTo: edge.to,
      stepIndex: config.stepIndex + 1,
      memoryEvent: front === 'λ' ? 'idle' : 'readX',
    }
  }

  if (hasReadY) {
    const top = config.stack.length === 0 ? 'λ' : config.stack[config.stack.length - 1]
    const edge = edges.find(
      (candidate) =>
        candidate.operation.kind === 'readStack' &&
        candidate.operation.symbol === top,
    )
    if (!edge) {
      return {
        ...config,
        status: 'TRAVADA',
        instruction: `Sem transição para Y ← ler Y com “${top}”`,
        memoryEvent: 'idle',
      }
    }
    const nextStack =
      top === 'λ' ? [...config.stack] : config.stack.slice(0, -1)
    const halt = haltOf(graph, edge.to)
    return {
      nodeId: edge.to,
      input: [...config.input],
      stack: nextStack,
      status: halt ?? 'RUNNING',
      instruction: `Desvio Y ← ler Y  (leu “${top}”)  →  ${stateById(graph, edge.to).name}`,
      lastFrom: config.nodeId,
      lastTo: edge.to,
      stepIndex: config.stepIndex + 1,
      memoryEvent: top === 'λ' ? 'idle' : 'pop',
    }
  }

  if (goto) {
    const to = goto.to
    const halt = haltOf(graph, to)
    return {
      nodeId: to,
      input: [...config.input],
      stack: [...config.stack],
      status: halt ?? 'RUNNING',
      instruction: `Partida  →  ${stateById(graph, to).name}`,
      lastFrom: config.nodeId,
      lastTo: to,
      stepIndex: config.stepIndex + 1,
      memoryEvent: 'idle',
    }
  }

  return {
    ...config,
    status: 'TRAVADA',
    instruction: 'Nó sem operação reconhecida (travada)',
    memoryEvent: 'idle',
  }
}

export function runOneStackUntilHalt(
  graph: MachineGraph,
  input: string,
  maxSteps = 500,
): OneStackConfig {
  let config = initOneStack(graph, input)
  for (let i = 0; i < maxSteps && config.status === 'RUNNING'; i += 1) {
    config = stepOneStack(graph, config)
  }
  return config
}
