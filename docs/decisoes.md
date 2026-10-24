# Registro de Decisões — Maia Class

Cada decisão tem data, o que foi decidido e por quê. **IAs: não rediscutam decisões registradas aqui.** Se uma decisão precisar mudar, proponha ao autor e registre uma nova entrada que substitua a anterior (marcando a antiga como "Substituída por D-XX").

Status possíveis: **Ativa** · **Substituída** · **Em espera** (adiada de propósito).

---

## Produto

### D-01 · Produto comercial — Ativa (24/10/2026)
O Maia Class será vendido. Consequência: nenhuma dependência pode ter royalties, marca d'água obrigatória ou restrição de uso comercial. Ver D-12.

### D-02 · Interface somente em português do Brasil — Ativa (24/10/2026)
Não haverá sistema de tradução. Textos da interface podem ser escritos diretamente em português.

### D-03 · 100% offline — Ativa (24/10/2026)
O app deve funcionar sem internet, do primeiro ao último uso. Nenhuma funcionalidade principal pode depender de servidor. Consequências: fontes vêm dentro do app (D-17), dados ficam no aparelho (D-08), app instalável com cache local (PWA).

### D-04 · Aparelhos de referência — Ativa (24/10/2026)
- **Samsung Galaxy Tab S6 Lite** (S Pen, Android, tela 60 Hz, processador intermediário). **É a régua de desempenho: se roda liso nele, está aprovado.**
- **Mesa Wacom** no Fedora Linux (Wayland), navegador Chrome.
Apple Pencil/iPad: compatibilidade desejável, mas não é alvo de testes agora.

### D-05 · Arquitetura estritamente modular — Ativa (24/10/2026)
Cada funcionalidade é um módulo isolado. Um módulo **nunca** importa outro módulo. Essa regra é verificada automaticamente (D-15). Motivo: o autor pediu que um sistema não possa quebrar o outro.

---

## Tecnologia

### D-06 · Motor de quadro próprio — Ativa (23/10/2026)
Não usar tldraw (licença comercial paga / marca d'água; zoom limitado), Excalidraw (feito para diagramas; zoom limitado) nem Konva/Fabric/Pixi (não resolvem zoom infinito nem latência). Construímos o motor com peças livres (ver [dependencias.md](dependencias.md)).

### D-07 · TypeScript + Vite + React (só para menus) + Canvas 2D — Ativa (23/10/2026)
- TypeScript em modo estrito: a IA erra menos.
- O desenho do quadro é feito em Canvas 2D, redesenhado a partir dos dados vetoriais. O pintor fica atrás de uma interface própria, para poder trocar por WebGL no futuro se o desempenho exigir.
- React apenas na casca (menus, painéis, diálogos). **O motor não importa React.**

### D-08 · Dados em Yjs, salvos no aparelho (IndexedDB) — Ativa (23/10/2026)
Yjs guarda o documento, faz desfazer/refazer e deixa a colaboração futura pronta sem reescrita. Persistência local via IndexedDB.

### D-09 · Android = mesmo código web dentro do Capacitor — Ativa (23/10/2026)
Passo 1: PWA (site instalável). Passo 2: app Capacitor com uma pequena peça nativa (Jetpack Ink, Apache-2.0) para a "tinta molhada" de baixa latência, botão da S Pen e reconhecimento de letra. Não reescrever o quadro em Kotlin, Flutter ou React Native.

### D-10 · Colaboração em tempo real — Em espera (24/10/2026)
Substitui a ideia inicial de usar Liveblocks (serviço pago de terceiros), descartada por D-01/D-03.
Quando for ativada: servidor próprio de código aberto (**Hocuspocus**, MIT, compatível com Yjs), hospedado pelo autor — pode ser o próprio PC na mesma rede. Permissões (visualizar/comentar/editar) implementadas nesse servidor. Observação: colaborar pela internet exige ao menos um servidor no meio; isso é limitação da internet, não do projeto.
O módulo `colaboracao/` deve ser construído como peça trocável e desligada por padrão.

### D-11 · Reconhecimento de letra — Parcialmente em espera (24/10/2026)
Substitui a ideia inicial de usar Gemini (nuvem), descartada por D-03.
- **Endireitar linhas (Extra 5a):** feito só com geometria, sem ler as letras. Funciona offline em todas as plataformas. **Ativo.**
- **Transformar em texto (Extra 5b):**
  - App Android: **Google ML Kit Digital Ink** (roda no aparelho). Ver exceção D-12.
  - Navegador: **em espera** — não há hoje opção gratuita, offline e de boa qualidade para letra cursiva em português.
- O reconhecedor é uma peça trocável (interface `Reconhecedor`) para encaixar soluções futuras.

### D-12 · Política de licenças — Ativa (24/10/2026)
Permitidas: **MIT, Apache-2.0, BSD, ISC** (código) e **SIL OFL** (fontes).
Proibidas: licenças com royalties, marca d'água, restrição comercial ou copyleft forte (GPL/AGPL) no código distribuído.
**Exceção aprovada:** Google ML Kit (gratuito, uso comercial permitido, proprietário), **somente dentro do app Android**. Observações: o pacote de idioma português é baixado uma vez com internet; o SDK envia estatísticas de uso ao Google (declarar na política de privacidade).
Toda dependência nova deve ser registrada em [dependencias.md](dependencias.md) antes de ser usada.

### D-13 · Nomes no código em português — Ativa (24/10/2026)
Pastas, arquivos, variáveis, funções, comentários e mensagens de commit em português (ex.: `camera.aplicarZoom()`). Termos de bibliotecas e da plataforma permanecem como são (`PointerEvent`, `useState`). Motivo: consistência com as pastas e legibilidade para o autor; misturar idiomas é o pior cenário.

### D-14 · Estrutura em quatro camadas — Ativa (24/10/2026)
`motor/` → `objetos/` → `modulos/` → `interface/`. Cada camada só enxerga as camadas abaixo dela. Detalhes em [arquitetura.md](arquitetura.md).

### D-15 · Guardião automático da modularidade — Ativa (24/10/2026)
Usar **dependency-cruiser** (MIT) para impedir, na verificação automática, que: um módulo importe outro módulo; o motor importe React ou qualquer camada acima; objetos importem módulos.

### D-16 · Ferramenta de programação — Ativa (24/10/2026)
O código será escrito pelo Claude (vibe coding), sob comando do autor. Regras de IA ficam em `AGENTS.md` (lido por Claude, Antigravity e outras IAs); `CLAUDE.md` apenas importa o `AGENTS.md`.

### D-17 · Fontes empacotadas no app — Ativa (24/10/2026)
As fontes da caixa de texto vêm dentro do app (licença OFL/Apache), para funcionar offline e para o PDF exportado ser idêntico à tela.

---

## Experiência de uso

### D-18 · Modo noturno inverte tintas preta e branca — Ativa (24/10/2026)
Cores da paleta são salvas como **referência à paleta** (ex.: `tinta:preto`), não como código de cor fixo. No modo noturno, preto↔branco se invertem na exibição; as demais cores podem ter versão ajustada para fundo escuro. Cores personalizadas são salvas como código fixo. **Exportações (PDF/imagem) usam sempre as cores do modo claro**, a menos que o usuário escolha o contrário.

### D-19 · "Caneta escreve, dedo navega" — Ativa (24/10/2026)
Padrão: caneta desenha; dedo arrasta e dá zoom (pinça); a palma da mão é ignorada enquanto a caneta está em uso (rejeição de palma). Configuração opcional: "dedo também desenha" (para quem não tem caneta). Mouse: botão esquerdo desenha; roda/arrastar com botão do meio navega.

### D-20 · Biblioteca de cadernos — Ativa (24/10/2026)
Tela inicial simples para criar, abrir, renomear e apagar cadernos. Entra na Fase 1, em versão mínima.

### D-21 · Proteção contra perda de dados — Ativa (24/10/2026)
Pedir ao navegador armazenamento persistente (`navigator.storage.persist()`) e oferecer exportação/importação do caderno como arquivo de backup (formato próprio `.maia`).

### D-22 · Teste no tablet via conexão segura — Ativa (24/10/2026)
A "tinta delegada" (recurso que reduz a latência no Chrome) só funciona em conexão segura. Testar no tablet **via cabo USB** (`adb reverse`, o tablet enxerga como `localhost`) ou com certificado de teste em HTTPS. Testar por `http://192.168...` dá resultado de latência falso.

### D-23 · Identidade visual — Em espera (24/10/2026)
O [design-system.md](design-system.md) atual é um **rascunho** e pode ser usado provisoriamente. Uma sessão dedicada à identidade visual (cor de destaque, logo, estilo dos menus) acontecerá antes de os menus definitivos serem construídos.

### D-24 · Menu na Fase 1 é fixo e simples — Ativa (24/10/2026)
O menu arrastável para as quatro bordas (Extra 4) chega na Fase 7. Até lá, um menu simples e fixo, já construído de forma que possa virar móvel sem reescrita.
