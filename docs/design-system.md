# Diretrizes de UX e Design System — Maia Class

## 1. Filosofia: "Canvas-First"
O foco central do aplicativo é o quadro branco infinito. A interface gráfica deve ser:
- **Discreta e Elegante:** Não rouba a atenção do usuário nem ocupa espaço útil da escrita.
- **Flutuante e Móvel:** A barra de ferramentas principal pode ser movida livremente para o topo, rodapé ou laterais da tela (conforme a preferência de destros ou canhotos).
- **Sem Fricção:** Ferramentas frequentes (caneta, borracha, cores rápidas) acessíveis em 1 toque.

---

## 2. Paleta de Cores e Temas

### 2.1 Tema Claro (Padrão para Sala de Aula e Apresentações)
- **Fundo do Quadro:** `#FBFBFC` (branco suave, reduz o cansaço visual em comparação ao branco puro `#FFFFFF`).
- **Linhas/Grade de Fundo:** `#E2E8F0` (cinza sutil).
- **Superfícies de Menu (Dock):** `#FFFFFF` com borda fina `#E2E8F0` e sombra suave elevada.
- **Texto e Ícones Principais:** `#1E293B` (grafite escuro).

### 2.2 Tema Escuro (Modo Noturno)
- **Fundo do Quadro:** `#121214` (preto carvão fosco).
- **Linhas/Grade de Fundo:** `#27272A`.
- **Superfícies de Menu:** `#1E1E22` com borda fina `#3F3F46`.
- **Texto e Ícones Principais:** `#F4F4F5`.

### 2.3 Paleta de Tintas Padrão (Canetas e Formas)
Cores de alto contraste e legibilidade:
- Preto clássico: `#1E293B` (ou `#F8FAFC` no tema escuro)
- Azul Royal: `#2563EB`
- Vermelho Vibrante: `#DC2626`
- Verde Esmeralda: `#16A34A`
- Roxo: `#9333EA`
- Laranja: `#EA580C`

### 2.4 Paleta de Marca-Texto (Semitransparente)
- Amarelo fluorescente: `rgba(250, 204, 21, 0.45)`
- Verde neon: `rgba(74, 222, 128, 0.45)`
- Azul celeste: `rgba(56, 189, 248, 0.45)`
- Rosa pastel: `rgba(244, 114, 182, 0.45)`
- Laranja suave: `rgba(251, 146, 60, 0.45)`

---

## 3. Tipografia
- Fonte da interface: Sistema nativo moderno (`Inter`, `system-ui`, `-apple-system`, `Roboto`, `sans-serif`) para renderização instantânea sem download de fontes pesadas.
- Fonte do quadro para texto digitado: Opções clássicas para anotação (`Sans-serif`, `Serif`, `Monospace`, `Manuscrita`).

---

## 4. Anatomia do Menu Móvel (Dock)
- Formato de pílula flutuante com cantos arredondados (`rounded-2xl`).
- Alça de arraste discreta para reposicionar entre as 4 bordas da tela.
- Indicador visual ativo sutil na ferramenta selecionada.
