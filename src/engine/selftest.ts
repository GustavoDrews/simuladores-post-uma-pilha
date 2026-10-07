import { PROGRAMS } from '../machines/programs'
import { runPostUntilHalt } from './post'
import { runOneStackUntilHalt } from './oneStack'

function expectHalt(
  label: string,
  status: string,
  expected: string,
) {
  if (status !== expected) {
    throw new Error(`${label}: esperado ${expected}, obtido ${status}`)
  }
}

export function runSelfTests(): string[] {
  const logs: string[] = []
  const post = PROGRAMS.post.graph

  const postAccept = ['', 'ab', 'ba', 'abab', 'aabb', 'baba']
  const postReject = ['a', 'b', 'aab', 'abb', 'aa', 'bb']
  for (const w of postAccept) {
    const r = runPostUntilHalt(post, w)
    expectHalt(`Post ACEITA "${w}"`, r.status, 'ACEITA')
    logs.push(`Post "${w || 'ε'}" → ACEITA`)
  }
  for (const w of postReject) {
    const r = runPostUntilHalt(post, w)
    expectHalt(`Post REJEITA "${w}"`, r.status, 'REJEITA')
    logs.push(`Post "${w}" → REJEITA`)
  }

  const pilha = PROGRAMS.oneStack.graph
  const stackAccept = ['', 'ab', 'aabb', 'aaabbb']
  const stackReject = ['ba', 'aab', 'abb', 'a', 'b', 'abab']
  for (const w of stackAccept) {
    const r = runOneStackUntilHalt(pilha, w)
    expectHalt(`Pilha ACEITA "${w}"`, r.status, 'ACEITA')
    logs.push(`Pilha "${w || 'ε'}" → ACEITA`)
  }
  for (const w of stackReject) {
    const r = runOneStackUntilHalt(pilha, w)
    expectHalt(`Pilha REJEITA "${w}"`, r.status, 'REJEITA')
    logs.push(`Pilha "${w}" → REJEITA`)
  }

  return logs
}
