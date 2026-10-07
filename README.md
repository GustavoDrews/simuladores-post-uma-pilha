# Simuladores — Máquina de Post e Máquina de Uma Pilha

Disciplina: Teoria da Computação e Complexidade (2026/2)
Professor: Adão E. de Souza Filho
Grupo: Maiara Martins Zucco, Matheus Gabriel Girardi, Theodoro Gaspar Ferreira e Gustavo Straliotto Drews

Modelos: **Máquina de Post** (apresentação) e **Máquina de Uma Pilha**.

**Demo online:** https://gustavodrews.github.io/simuladores-post-uma-pilha/

## Requisitos

- [Node.js](https://nodejs.org/) 20 ou superior (inclui o `npm`).
- Um navegador moderno.

Verifique a instalação:

```bash
node --version
npm --version
```

## Executar em desenvolvimento

1. Abra um terminal na pasta do projeto:

   ```bash
   cd /caminho/para/atividade-8
   ```

2. Instale as dependências uma única vez:

   ```bash
   npm install
   ```

3. Inicie o servidor de desenvolvimento:

   ```bash
   npm run dev
   ```

4. Abra a URL exibida no terminal. Em geral, ela é:

   ```text
   http://localhost:5173
   ```

O Vite atualiza a página automaticamente após alterações nos arquivos em `src/`. Para encerrar o servidor, use `Ctrl+C` no terminal.

## Usar o simulador

Há duas abas: **Máquina de Post** e **Máquina de Uma Pilha**.

- Informe uma palavra composta somente por `a` e `b`, ou deixe o campo vazio para representar a palavra vazia (`λ`).
- **Executar próximo passo** aplica uma transição e atualiza a memória e o histórico.
- **Executar automaticamente** executa passos a cada 400 ms; o mesmo botão pausa a execução.
- **Reiniciar** restaura a configuração inicial com a entrada informada.
- O fluxograma mostra os estados e as transições da máquina. O estado atual fica amarelo e a última transição executada fica laranja.

Cada execução é finalizada como `ACEITA`, `REJEITA`, `TRAVADA` ou `LOOP`. O status `LOOP` é mostrado quando 500 passos são alcançados sem uma parada.

## Programas do simulador

Os programas estão definidos e tipados em `src/machines/programs.ts`. Esse arquivo contém os estados, as transições e as operações de cada modelo; não há leitura ou exportação de arquivos externos.

| Modelo | Alfabeto de entrada | Programa demonstrado |
| --- | --- | --- |
| Máquina de Post | `{ a, b }` | palavras com a mesma quantidade de `a` e `b` |
| Máquina de Uma Pilha | `{ a, b }` | linguagem `aⁿbⁿ`, com `n ≥ 0` |

Convenção das operações:

- Estado inicial = Partida; estado final = Aceita; nome `Rejeita` = rejeição
- Post: desvio `a`, `b`, `#`, `λ`; atribuição `X←X·s`
- Uma pilha: `X:a` / `X:λ` (ler fila), `Y:a` / `Y:λ` (ler pilha), `Y←s·Y` (empilhar), `ir` (partida)

Na interface, informe a palavra de entrada e use os botões para executar um passo, executar automaticamente ou reiniciar. A execução automática marca `LOOP` se alcançar 500 passos sem atingir um estado de aceitação ou rejeição.

## Casos de teste

Post (mesma quantidade de `a` e `b`):

- Aceita: `ε`, `ab`, `ba`, `abab`
- Rejeita: `a`, `b`, `aab`

Uma pilha (`aⁿbⁿ`):

- Aceita: `ε`, `ab`, `aabb`
- Rejeita: `ba`, `aab`, `abb`

## Verificação e versão de produção

Execute a verificação de tipos e gere a versão estática:

```bash
npm run build
```

Para servir essa versão localmente:

```bash
npm run preview
```

Abra a URL indicada pelo comando, normalmente `http://localhost:4173`.

Para verificar o estilo do código:

```bash
npm run lint
```

## Estrutura do projeto

```text
src/
├── components/       # controles, memória, histórico e fluxograma
├── engine/           # regras de execução de cada máquina
├── machines/         # definições tipadas dos programas
└── pages/            # telas dos dois simuladores
```
