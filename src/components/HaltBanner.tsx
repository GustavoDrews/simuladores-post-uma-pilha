import type { HaltStatus } from '../machines/types'

export function HaltBanner({ status }: { status: HaltStatus }) {
  if (status === 'RUNNING') {
    return (
      <div className="halt running">
        Computação em andamento — a máquina ainda não parou.
      </div>
    )
  }
  if (status === 'ACEITA') {
    return (
      <div className="halt accept">
        Computação terminou: <strong>ACEITA</strong> a palavra de entrada.
      </div>
    )
  }
  if (status === 'REJEITA') {
    return (
      <div className="halt reject">
        Computação terminou: <strong>REJEITA</strong> a palavra de entrada.
      </div>
    )
  }
  if (status === 'LOOP') {
    return (
      <div className="halt stuck">
        Computação interrompida: <strong>LOOP</strong> (atingiu o limite de
        passos sem parar).
      </div>
    )
  }
  return (
    <div className="halt stuck">
      Computação terminou: <strong>TRAVADA</strong> (não há transição para esta
      configuração).
    </div>
  )
}
