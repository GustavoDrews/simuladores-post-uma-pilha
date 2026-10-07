type Props = {
  input: string
  onInput: (value: string) => void
  onStep: () => void
  onAuto: () => void
  onReset: () => void
  auto: boolean
  disabledStep: boolean
}

export function Controls({
  input,
  onInput,
  onStep,
  onAuto,
  onReset,
  auto,
  disabledStep,
}: Props) {
  return (
    <div className="controls">
      <label className="field">
        <span>Entrada</span>
        <input
          value={input}
          onChange={(e) => onInput(e.target.value)}
          placeholder="ex.: abab"
          spellCheck={false}
        />
      </label>
      <div className="btn-row">
        <button type="button" onClick={onStep} disabled={disabledStep}>
          Executar próximo passo
        </button>
        <button type="button" className={auto ? 'danger' : ''} onClick={onAuto}>
          {auto ? 'Pausar' : 'Executar automaticamente'}
        </button>
        <button type="button" onClick={onReset}>
          Reiniciar
        </button>
      </div>
    </div>
  )
}
