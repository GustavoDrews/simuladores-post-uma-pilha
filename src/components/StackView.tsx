type Props = {
  symbols: string[]
  event: 'push' | 'pop' | 'idle' | string
}

export function StackView({ symbols, event }: Props) {
  const topFirst = [...symbols].reverse()
  return (
    <div className="memory-block">
      <div className="memory-head">
        <strong>Pilha Y</strong>
        <span>somente o topo é acessível</span>
      </div>
      <div className="stack" data-event={event}>
        <span className="stack-tag">topo</span>
        {topFirst.length === 0 ? (
          <div className="cell empty">λ</div>
        ) : (
          topFirst.map((sym, i) => (
            <div
              key={`${i}-${sym}-${symbols.length}`}
              className={`cell ${i === 0 && event === 'push' ? 'entering' : ''} ${i === 0 && event === 'pop' ? 'leaving' : ''}`}
            >
              {sym}
            </div>
          ))
        )}
        <span className="stack-tag">base</span>
      </div>
    </div>
  )
}
