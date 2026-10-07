import { useState } from 'react'
import { OneStackSimulator } from './pages/OneStackSimulator'
import { PostSimulator } from './pages/PostSimulator'

type Tab = 'post' | 'pilha'

export default function App() {
  const [tab, setTab] = useState<Tab>('post')

  return (
    <div className="app">
      <header className="top">
        <div>
          <p className="kicker">
            Teoria da Computação e Complexidade · 2026/2 · Prof. Adão E. de
            Souza Filho
          </p>
          <h1>Simuladores de modelos de computação</h1>
          <p className="sub">
            Máquina de Post e Máquina de Uma Pilha · programas definidos no código
          </p>
        </div>
        <nav className="tabs">
          <button
            type="button"
            className={tab === 'post' ? 'active' : ''}
            onClick={() => setTab('post')}
          >
            Máquina de Post
          </button>
          <button
            type="button"
            className={tab === 'pilha' ? 'active' : ''}
            onClick={() => setTab('pilha')}
          >
            Uma Pilha
          </button>
        </nav>
      </header>

      {tab === 'post' ? <PostSimulator /> : null}
      {tab === 'pilha' ? <OneStackSimulator /> : null}
    </div>
  )
}
