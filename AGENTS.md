# Manual de Diretrizes para IAs — Projeto Maia Class

Este documento orienta qualquer agente de IA trabalhando no repositório **Maia Class**. Siga estas regras rigorosamente.

---

## 1. Organização do Repositório
- `.agent/` e `docs/`: Apenas documentação, decisões de design, manuais e regras.
  - Consulte obrigatoriamente [docs/plano-completo.md](docs/plano-completo.md) para a lista de funcionalidades, roadmap e decisões consolidadas.
  - Consulte [docs/design-system.md](docs/design-system.md) para tokens visuais, paletas e UI.
- `app/`: Código-fonte exclusivo da aplicação. Nenhuma dependência de documentação ou histórico de chat deve entrar aqui.

---

## 2. Arquitetura do Software (Princípios Não Negociáveis)
1. **Desacoplamento Motor x Interface:**
   - O núcleo do quadro (`app/src/motor/`) **NÃO** deve importar nem depender de React.
   - O motor deve ser escrito em TypeScript puro com foco em máxima performance gráfica (60–120 FPS, sem alocações pesadas dentro do loop de desenho).
   - O React (`app/src/interface/`) cuida estritamente de menus, botões flutuantes, diálogos e configurações.
2. **Modularidade por Ferramentas (Plugins):**
   - Cada ferramenta (caneta, marca-texto, borracha, laço de seleção, formas inteligentes) deve ser um módulo isolado dentro de `app/src/modulos/`.
   - Uma ferramenta nunca deve acessar diretamente dados internos de outra ferramenta. A comunicação ocorre através da API pública do motor (`motor/documento.ts`).
3. **Qualidade do Traço & Zoom Infinito:**
   - Traços nunca são gravados como imagens de pixels fixos. Traços são gravados vetorialmente (pontos brutos com pressão, tempo e coordenadas normalizadas).
   - O redesenho adapta a densidade de pontos conforme o nível de zoom para preservar a nitidez e o desempenho.
4. **Licenças e Custo Zero:**
   - Todas as dependências externas devem possuir licença MIT, Apache-2.0 ou BSD.
   - Proibido o uso de bibliotecas comerciais com royalties, watermarks ou restrições de uso comercial (ex: SDK fechado do tldraw).
5. **Offline-First:**
   - O aplicativo deve funcionar 100% desconectado da internet.
   - O estado local é persistido no próprio navegador/dispositivo (IndexedDB / Yjs).

---

## 3. Padrões de Código e Vibe Coding
- Escreva código limpo, autodocumentado e fortemente tipado com TypeScript.
- Sempre preserve comentários e docstrings existentes.
- Crie testes unitários para operações matemáticas e de geometria (reconhecimento de formas, detecção de ângulos, corte de borracha).
