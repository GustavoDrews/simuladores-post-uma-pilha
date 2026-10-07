export type HaltStatus = 'RUNNING' | 'ACEITA' | 'REJEITA' | 'TRAVADA' | 'LOOP'

export type MachineState = {
  id: string
  name: string
  x: number
  y: number
  initial?: boolean
  final?: boolean
  reject?: boolean
}

export type MachineOperation =
  | { kind: 'goto' }
  | { kind: 'postRead'; symbol: string }
  | { kind: 'postWrite'; symbol: string }
  | { kind: 'readInput'; symbol: string }
  | { kind: 'readStack'; symbol: string }
  | { kind: 'pushStack'; symbol: string }

export type MachineTransition = {
  from: string
  to: string
  label: string
  operation: MachineOperation
}

export type MachineGraph = {
  states: MachineState[]
  transitions: MachineTransition[]
  initialId: string
}

export type PostConfig = {
  nodeId: string
  queue: string[]
  status: HaltStatus
  instruction: string
  lastFrom: string | null
  lastTo: string | null
  stepIndex: number
  memoryEvent: 'enqueue' | 'dequeue' | 'idle'
}

export type OneStackConfig = {
  nodeId: string
  input: string[]
  stack: string[]
  status: HaltStatus
  instruction: string
  lastFrom: string | null
  lastTo: string | null
  stepIndex: number
  memoryEvent: 'push' | 'pop' | 'readX' | 'idle'
}
