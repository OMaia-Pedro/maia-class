# Manual de Diretrizes para IAs — Projeto Maia Class

Este documento orienta **qualquer agente de IA** (Claude, Gemini/Antigravity e outros) que trabalhe no repositório **Maia Class**. Siga estas regras rigorosamente. Em caso de conflito entre este arquivo e outro documento, pergunte ao autor.

O autor **não programa**: o projeto é construído por *vibe coding*. Explique o que fez em linguagem simples, sem jargão.

---

## 0. Antes de qualquer tarefa, leia
| Documento | Responde |
|---|---|
| [docs/requisitos.md](docs/requisitos.md) | **O quê?** Pedido original do autor, palavra por palavra. Prevalece sobre resumos. |
| [docs/plano-completo.md](docs/plano-completo.md) | **Quando?** Fases e prioridades. |
| [docs/arquitetura.md](docs/arquitetura.md) | **Como?** Camadas, contratos, modelo de dados. |
| [docs/decisoes.md](docs/decisoes.md) | **Por quê?** Decisões tomadas. **Não as rediscuta.** |
| [docs/dependencias.md](docs/dependencias.md) | **Com quais peças?** Bibliotecas aprovadas e licenças. |
| [docs/design-system.md](docs/design-system.md) | **Com que cara?** (rascunho provisório) |

---

## 1. Regras de trabalho
1. **Só escreva código quando o autor pedir explicitamente.** Planejar, revisar ou documentar não autoriza a programar.
2. **Uma tarefa pequena por vez, dentro de um único módulo** sempre que possível. Não "aproveite" para mexer em outras partes.
3. **Siga a fase atual** do [plano](docs/plano-completo.md). Não adiante funcionalidades de fases futuras.
4. **Antes de dizer que terminou**, rode a verificação completa (`npm run verificar`, dentro de `app/`) e só conclua se ela passar.
5. **Nenhuma dependência nova** sem: (a) checar a licença, (b) registrar em `docs/dependencias.md`, (c) avisar o autor.
6. **Decisão nova ou mudança de decisão** → proponha ao autor; se aprovada, registre em `docs/decisoes.md`.
7. **Commits pequenos**, com mensagem em português, a cada etapa que funciona.
8. Sempre preserve comentários e docstrings existentes.

---

## 2. Organização do repositório
- `docs/`: apenas documentação. Nada daqui é importado pelo app.
- `app/`: apenas o produto. Nenhum histórico de chat, plano ou anotação entra aqui.
- `AGENTS.md` (este arquivo) e `CLAUDE.md` (aponta para este) ficam na raiz.

---

## 3. Arquitetura (princípios não negociáveis)

### 3.1 Quatro camadas — cada uma só enxerga as de baixo
```
interface/  →  modulos/  →  objetos/  →  motor/
```
- `app/src/motor/`: núcleo em TypeScript puro. **Não importa React** nem nenhuma outra camada. `motor/api.ts` é a **única porta de entrada**.
- `app/src/objetos/`: tipos de conteúdo (traço, forma, texto, imagem, página de PDF, preenchimento). Usam só `motor/api`. Um objeto não importa outro.
- `app/src/modulos/`: uma pasta por funcionalidade (caneta, borracha, seleção, formas...). **Um módulo nunca importa outro módulo.** Comunicação só através do motor (registro e eventos).
- `app/src/interface/`: casca React (menu, janelas, configurações gerais).
- Arquivos `.tsx` só em `interface/` e em `modulos/*/painel.tsx`.
- Essas regras são verificadas automaticamente pelo **dependency-cruiser**. Nunca desative ou afrouxe uma regra para "fazer passar".

### 3.2 Traço vetorial e zoom infinito
- Traços nunca são gravados como imagem. Grave os pontos brutos (posição relativa à origem do objeto, pressão, inclinação, tempo), o andar de escala e a espessura **em unidades do quadro**.
- O redesenho adapta a densidade de pontos ao zoom.
- Cores da paleta são gravadas como referência (`paleta:preto`), não como código fixo (D-18).

### 3.3 Desempenho
- Meta: rodar liso no **Galaxy Tab S6 Lite** (aparelho de referência).
- Nada de criar objetos novos dentro do laço de desenho. A camada de "tinta molhada" desenha só o traço em andamento.

### 3.4 Offline e dados
- O app funciona **100% sem internet**. Nenhuma chamada de rede em funcionalidades principais.
- Dados persistidos no aparelho (Yjs + IndexedDB).

### 3.5 Licenças
- Permitidas: **MIT, Apache-2.0, BSD, ISC** (código) e **SIL OFL** (fontes).
- Proibidas: royalties, marca d'água, restrição comercial, GPL/AGPL. Ex.: tldraw SDK, Liveblocks, MyScript.
- Única exceção: Google ML Kit, **somente no app Android** (D-12).

---

## 4. Padrões de código
- TypeScript em modo estrito; evite `any`.
- **Nomes em português** (pastas, arquivos, funções, variáveis, comentários, commits), por exemplo `camera.aplicarZoom()`. Termos de bibliotecas permanecem como são.
- Textos da interface em português do Brasil.
- Testes (Vitest) ao lado do arquivo testado, **obrigatórios** para geometria e matemática: reconhecimento de formas, ângulos, focos, corte da borracha, conversões de câmera e espessura.
