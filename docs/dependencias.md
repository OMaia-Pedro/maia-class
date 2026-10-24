# Dependências Aprovadas — Maia Class

Lista de peças externas (bibliotecas) aprovadas para o projeto, com sua licença.
**Regra:** nenhuma dependência nova entra no código sem antes ser registrada aqui, com licença compatível com a política D-12 de [decisoes.md](decisoes.md).

Licenças permitidas: MIT, Apache-2.0, BSD, ISC (código) e SIL OFL (fontes).

| Peça | Para que serve | Licença | Fase | Status |
|---|---|---|---|---|
| TypeScript | Linguagem com verificação de erros | Apache-2.0 | 0 | Instalada |
| Vite | Servidor de teste e empacotador | MIT | 0 | Instalada |
| React + React DOM | Casca da interface (menus) | MIT | 0 | Instalada |
| Tailwind CSS | Estilos da interface | MIT | 0 | Instalada (atualizar p/ versão atual) |
| lucide-react | Ícones | ISC | 0 | Instalada |
| clsx / tailwind-merge | Utilitários de estilo | MIT | 0 | Instaladas |
| perfect-freehand | Traço com pressão (modo fluido) | MIT | 1 | Instalada |
| Yjs | Documento, desfazer/refazer, colaboração futura | MIT | 1 | Instalada |
| y-indexeddb | Salvar o documento Yjs no aparelho | MIT | 1 | A instalar |
| Vitest | Testes automáticos | MIT | 0 | A instalar |
| Playwright | Testes no navegador automático | Apache-2.0 | 1 | A instalar |
| dependency-cruiser | Guardião da modularidade (D-15) | MIT | 0 | A instalar |
| @vitejs/plugin-basic-ssl | HTTPS de teste (alternativa ao cabo USB, D-22) | MIT | 1 | Opcional |
| vite-plugin-pwa | App instalável e offline | MIT | 1 | A instalar |
| rbush | Índice espacial (desenhar só o que está visível) | MIT | 3 | A instalar |
| pdfjs-dist (pdf.js) | Abrir/importar PDF | Apache-2.0 | 5 | A instalar |
| jsPDF | Exportar PDF vetorial | MIT | 6 | A instalar |
| Capacitor | Empacotar como app Android | MIT | 10 | A instalar |
| androidx.ink (Jetpack Ink) | Tinta nativa de baixa latência no Android | Apache-2.0 | 10 | A instalar |
| Hocuspocus | Servidor próprio de colaboração (D-10) | MIT | 11 | Em espera |

## Exceções aprovadas

| Peça | Licença | Onde | Observações |
|---|---|---|---|
| Google ML Kit Digital Ink | Proprietária, gratuita, uso comercial permitido | **Somente no app Android** | Roda no aparelho; pacote do idioma baixado uma vez com internet; envia estatísticas de uso ao Google (declarar na política de privacidade). Ver D-11/D-12. |

## Fontes (a escolher na Fase 5, todas OFL ou Apache)
Candidatas: Inter, Roboto, Lora, Merriweather, Source Serif, JetBrains Mono, Caveat (manuscrita). Arquivos empacotados no app (D-17).

## Rejeitadas (não usar)
| Peça | Motivo |
|---|---|
| tldraw SDK | Licença comercial paga / marca d'água obrigatória |
| Liveblocks | Serviço pago de terceiros (contraria D-03) |
| Gemini / APIs de nuvem para reconhecimento | Exige internet (contraria D-03) |
| MyScript iink | Pago |
