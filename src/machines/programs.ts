import type { MachineGraph } from './types'

const postStates = [
  ['0', 'Partida', 80, 220, true],
  ['1', 'LerA', 280, 220],
  ['2', 'GravaB', 280, 80],
  ['3', 'LerB', 520, 220],
  ['4', 'GravaA_B', 520, 80],
  ['5', 'Copia', 760, 220],
  ['6', 'GravaA_C', 760, 80],
  ['7', 'GravaB_C', 920, 220],
  ['8', 'GravaHashB2', 520, 400],
  ['9', 'LerB2', 280, 520],
  ['10', 'GravaA_B2', 80, 520],
  ['11', 'GravaHashC', 760, 400],
  ['12', 'Verifica', 280, 400],
].map(([id, name, x, y, initial]) => ({
  id: String(id),
  name: String(name),
  x: Number(x),
  y: Number(y),
  initial: Boolean(initial),
}))

const postProgram: MachineGraph = {
  initialId: '0',
  states: [
    ...postStates,
    { id: '13', name: 'Aceita', x: 80, y: 400, final: true },
    { id: '14', name: 'Rejeita', x: 980, y: 400, reject: true },
  ],
  transitions: [
    ['0', '1', 'X ← X·#', 'postWrite', '#'],
    ['1', '3', 'a', 'postRead', 'a'],
    ['1', '2', 'b', 'postRead', 'b'],
    ['1', '12', '#', 'postRead', '#'],
    ['1', '13', 'λ', 'postRead', 'λ'],
    ['2', '1', 'X ← X·b', 'postWrite', 'b'],
    ['3', '4', 'a', 'postRead', 'a'],
    ['3', '5', 'b', 'postRead', 'b'],
    ['3', '8', '#', 'postRead', '#'],
    ['3', '14', 'λ', 'postRead', 'λ'],
    ['4', '3', 'X ← X·a', 'postWrite', 'a'],
    ['5', '6', 'a', 'postRead', 'a'],
    ['5', '7', 'b', 'postRead', 'b'],
    ['5', '11', '#', 'postRead', '#'],
    ['5', '13', 'λ', 'postRead', 'λ'],
    ['6', '5', 'X ← X·a', 'postWrite', 'a'],
    ['7', '5', 'X ← X·b', 'postWrite', 'b'],
    ['8', '9', 'X ← X·#', 'postWrite', '#'],
    ['9', '10', 'a', 'postRead', 'a'],
    ['9', '5', 'b', 'postRead', 'b'],
    ['9', '14', '#', 'postRead', '#'],
    ['9', '14', 'λ', 'postRead', 'λ'],
    ['10', '9', 'X ← X·a', 'postWrite', 'a'],
    ['11', '1', 'X ← X·#', 'postWrite', '#'],
    ['12', '13', 'λ', 'postRead', 'λ'],
    ['12', '14', 'a', 'postRead', 'a'],
    ['12', '14', 'b', 'postRead', 'b'],
    ['12', '14', '#', 'postRead', '#'],
  ].map(([from, to, label, kind, symbol]) => ({
    from,
    to,
    label,
    operation: { kind: kind as 'postRead' | 'postWrite', symbol },
  })),
}

const oneStackProgram: MachineGraph = {
  initialId: '0',
  states: [
    { id: '0', name: 'Partida', x: 80, y: 200, initial: true },
    { id: '1', name: 'LerX', x: 280, y: 200 },
    { id: '2', name: 'EmpilhaA', x: 280, y: 70 },
    { id: '3', name: 'LerY', x: 520, y: 200 },
    { id: '4', name: 'LerB', x: 760, y: 200 },
    { id: '5', name: 'VerificaY', x: 280, y: 400 },
    { id: '6', name: 'Aceita', x: 80, y: 400, final: true },
    { id: '7', name: 'Rejeita', x: 520, y: 400, reject: true },
  ],
  transitions: [
    ['0', '1', 'ir', 'goto'],
    ['1', '2', 'X:a', 'readInput', 'a'],
    ['1', '3', 'X:b', 'readInput', 'b'],
    ['1', '5', 'X:λ', 'readInput', 'λ'],
    ['2', '1', 'Y ← a·Y', 'pushStack', 'a'],
    ['3', '4', 'Y:a', 'readStack', 'a'],
    ['3', '7', 'Y:λ', 'readStack', 'λ'],
    ['3', '7', 'Y:b', 'readStack', 'b'],
    ['4', '3', 'X:b', 'readInput', 'b'],
    ['4', '7', 'X:a', 'readInput', 'a'],
    ['4', '5', 'X:λ', 'readInput', 'λ'],
    ['5', '6', 'Y:λ', 'readStack', 'λ'],
    ['5', '7', 'Y:a', 'readStack', 'a'],
    ['5', '7', 'Y:b', 'readStack', 'b'],
  ].map(([from, to, label, kind, symbol]) => ({
    from,
    to,
    label,
    operation:
      kind === 'goto'
        ? { kind: 'goto' as const }
        : {
            kind: kind as 'readInput' | 'readStack' | 'pushStack',
            symbol,
          },
  })),
}

export const PROGRAMS = {
  post: {
    title: 'Mesma quantidade de a e de b',
    language: '{ w ∈ {a,b}* | #a(w) = #b(w) }',
    sampleInput: 'abab',
    graph: postProgram,
  },
  oneStack: {
    title: 'aⁿbⁿ',
    language: '{ aⁿbⁿ | n ≥ 0 }',
    sampleInput: 'aabb',
    graph: oneStackProgram,
  },
} as const

export function stateById(graph: MachineGraph, id: string) {
  const state = graph.states.find((candidate) => candidate.id === id)
  if (!state) throw new Error(`Estado ${id} não encontrado.`)
  return state
}

export function outgoing(graph: MachineGraph, id: string) {
  return graph.transitions.filter((transition) => transition.from === id)
}
