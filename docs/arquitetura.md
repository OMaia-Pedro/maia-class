# Arquitetura Técnica do Maia Class

## 1. Separação de Camadas

```
+-------------------------------------------------------+
|                Interface (React)                      |
|  - Menus e botões flutuantes (Dock móvel)             |
|  - Paleta de cores, seletores e modais                |
+---------------------------+---------------------------+
                            | (Ações do usuário)
                            v
+-------------------------------------------------------+
|            Módulos / Ferramentas (Plugins)            |
|  - Caneta (fluida / uniforme)                         |
|  - Marca-texto, Borracha, Laço, Formas inteligentes   |
+---------------------------+---------------------------+
                            |
                            v
+-------------------------------------------------------+
|             Motor Gráfico (TypeScript Puro)           |
|  - camera.ts: Posição (x, y) e Zoom                   |
|  - entrada.ts: PointerEvents (caneta, pressão, tilt)  |
|  - pintor.ts: Renderização em Canvas 2D multi-camadas |
|  - documento.ts: Estado reativo e dados com Yjs       |
+-------------------------------------------------------+
```

## 2. Princípio da Tinta Molhada vs. Tinta Seca
Para garantir sensação de latência zero:
1. **Camada de Tinta Molhada (`canvas-molhado`):** Desenha exclusivamente o traço em progresso no instante em que a ponta da caneta se desloca. Redesenhar apenas este único traço custa frações de milissegundo (< 2ms).
2. **Camada de Tinta Seca (`canvas-seco`):** Quando a caneta se levanta (`pointerup`), o traço é adicionado ao documento de dados (`Y.Doc`) e "assado" na camada principal.
3. **Câmera e Zoom:** O zoom nunca estica os pixels da tela. Ele recalcula a escala da projeção vetorial, mantendo a nitidez perfeita.
