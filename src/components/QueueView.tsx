type Props = {
  symbols: string[]
  event: 'enqueue' | 'dequeue' | 'idle' | string
  label?: string
}

export function QueueView({ symbols, event, label = 'Fila X' }: Props) {
  return (
    <div className="memory-block">
      <div className="memory-head">
        <strong>{label}</strong>
        <span>frente → fim (FIFO)</span>
      </div>
      <div className="queue" data-event={event}>
        <span className="queue-tag">frente</span>
        {symbols.length === 0 ? (
          <div className="cell empty">λ</div>
        ) : (
          symbols.map((sym, i) => (
            <div
              key={`${i}-${sym}-${symbols.length}`}
              className={`cell ${sym === '#' ? 'hash' : ''} ${i === 0 && event === 'dequeue' ? 'leaving' : ''} ${i === symbols.length - 1 && event === 'enqueue' ? 'entering' : ''}`}
            >
              {sym}
            </div>
          ))
        )}
        <span className="queue-tag">fim</span>
      </div>
    </div>
  )
}
