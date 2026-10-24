# Fase 0 — Preparação (roteiro de execução)

> [!IMPORTANT]
> **Para a IA que executar este roteiro:**
> - **NÃO escreva código da aplicação.** Não crie nenhum arquivo dentro de `app/src/`. Não rode `create-vite` nem qualquer gerador de projeto (eles criam código).
> - Execute os passos **na ordem**, um de cada vez. Se um passo falhar, **pare e explique o erro ao autor** em linguagem simples. Não invente soluções alternativas.
> - Não altere nenhum documento em `docs/`, exceto a coluna "Status" de `docs/dependencias.md` (passo A6) e as caixas de seleção deste arquivo.
> - Comandos que baixam da internet (`npm install`, `npx playwright install`) precisam rodar com acesso à rede.
> - Todos os comandos rodam dentro de `/home/omaia/Documents/Maia Class/app`, salvo indicação contrária.

---

## Parte A — Executada pela IA

### A1. Atualizar as peças para as versões atuais
A lista de peças foi escrita à mão e está desatualizada.

```bash
npm install react@latest react-dom@latest lucide-react@latest clsx@latest tailwind-merge@latest perfect-freehand@latest yjs@latest
npm install -D vite@latest @vitejs/plugin-react@latest typescript@latest @types/react@latest @types/react-dom@latest
```
- [ ] Concluído. Se aparecer conflito de versões (`ERESOLVE`), **pare e relate**.

### A2. Trocar o Tailwind 3 pelo Tailwind 4
O Tailwind 4 não usa mais `tailwind.config.js` nem `postcss.config.js`.

```bash
npm uninstall tailwindcss postcss autoprefixer
npm install -D tailwindcss@latest @tailwindcss/vite@latest
rm tailwind.config.js postcss.config.js
```

Substituir **todo** o conteúdo de `app/vite.config.ts` por:
```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    port: 5173,
  },
});
```
- [ ] Concluído. (A linha `@import "tailwindcss";` no CSS será criada junto com o código, na Fase 1. **Não crie o arquivo CSS agora.**)

### A3. Instalar as ferramentas de verificação e as peças da Fase 1
```bash
npm install y-indexeddb@latest
npm install -D vitest@latest dependency-cruiser@latest @playwright/test@latest vite-plugin-pwa@latest
npx playwright install chromium
```
- [ ] Concluído. Se o `playwright install` reclamar do sistema operacional, mas baixar o Chromium, está ok. Se não baixar, relate e siga para o passo A4.

### A4. Criar o guardião da modularidade
Criar o arquivo `app/.dependency-cruiser.cjs` com **exatamente** este conteúdo (não altere as regras):

```js
/** Guardião da modularidade — ver docs/arquitetura.md §1 e docs/decisoes.md D-14/D-15.
 *  NUNCA afrouxe ou desative uma regra para "fazer passar". */
module.exports = {
  forbidden: [
    {
      name: 'motor-isolado',
      comment: 'O motor não pode importar nenhuma camada acima dele.',
      severity: 'error',
      from: { path: '^src/motor/' },
      to: { path: '^src/(objetos|modulos|interface)/' },
    },
    {
      name: 'motor-e-objetos-sem-react',
      comment: 'Motor e objetos são TypeScript puro, sem React.',
      severity: 'error',
      from: { path: '^src/(motor|objetos)/' },
      to: { path: '^node_modules/(react|react-dom)/' },
    },
    {
      name: 'objetos-nao-usam-modulos',
      comment: 'Objetos não podem importar módulos nem a interface.',
      severity: 'error',
      from: { path: '^src/objetos/' },
      to: { path: '^src/(modulos|interface)/' },
    },
    {
      name: 'objeto-nao-importa-outro-objeto',
      comment: 'Um tipo de objeto não importa outro. Código comum vai para motor/geometria.',
      severity: 'error',
      from: { path: '^src/objetos/([^/]+)/' },
      to: { path: '^src/objetos/', pathNot: '^src/objetos/$1/' },
    },
    {
      name: 'modulo-nao-importa-outro-modulo',
      comment: 'Um módulo NUNCA importa outro módulo. Comunicação só pelo motor.',
      severity: 'error',
      from: { path: '^src/modulos/([^/]+)/' },
      to: { path: '^src/modulos/', pathNot: '^src/modulos/$1/' },
    },
    {
      name: 'so-pela-porta-do-motor',
      comment: 'Fora do motor, só se importa motor/api.ts.',
      severity: 'error',
      from: { path: '^src/(objetos|modulos|interface)/' },
      to: { path: '^src/motor/', pathNot: '^src/motor/api\\.ts$' },
    },
    {
      name: 'react-so-na-interface-e-paineis',
      comment: 'Arquivos .tsx só em interface/, modulos/*/painel.tsx e main.tsx.',
      severity: 'error',
      from: {
        path: '\\.tsx$',
        pathNot: '^src/(interface/|modulos/[^/]+/painel\\.tsx$|main\\.tsx$)',
      },
      to: {},
    },
    {
      name: 'sem-ciclos',
      comment: 'Dependências circulares não são permitidas.',
      severity: 'error',
      from: {},
      to: { circular: true },
    },
  ],
  options: {
    doNotFollow: { path: 'node_modules' },
    tsPreCompilationDeps: true,
    tsConfig: { fileName: 'tsconfig.json' },
    enhancedResolveOptions: { extensions: ['.ts', '.tsx', '.js'] },
  },
};
```
- [ ] Concluído.

### A5. Comandos de verificação no `app/package.json`
Substituir **apenas** o bloco `"scripts"` por:
```json
"scripts": {
  "dev": "vite",
  "build": "tsc -b && vite build",
  "preview": "vite preview",
  "test": "vitest run --passWithNoTests",
  "regras": "depcruise src --config .dependency-cruiser.cjs",
  "verificar": "tsc -b && npm run test && npm run regras"
}
```
Rodar para conferir:
```bash
npm run test
npm run regras
```
- [ ] Os dois rodaram sem erro.
- **Esperado:** `npm run verificar` e `npm run build` **falham** com o erro `TS18003: No inputs were found` porque ainda não existe código. **Isso é normal. Não crie arquivos para "consertar".**

### A6. Limpar o `app/index.html`
Substituir **todo** o conteúdo por:
```html
<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <meta name="mobile-web-app-capable" content="yes" />
    <title>Maia Class</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```
- [ ] Concluído.

### A7. Conferir licenças e atualizar `docs/dependencias.md`
Para cada peça instalada, rodar `npm view <nome> license` e conferir se está na lista permitida (MIT, Apache-2.0, BSD, ISC).
- Se **alguma** não estiver, **pare e relate**.
- Atualizar **somente a coluna "Status"** em `docs/dependencias.md`: "A instalar" → "Instalada" para y-indexeddb, Vitest, Playwright, dependency-cruiser e vite-plugin-pwa; Tailwind CSS → "Instalada (v4)". Acrescentar uma linha para `@tailwindcss/vite` (MIT, Fase 0, Instalada).
- [ ] Concluído.

### A8. Salvar no Git
```bash
cd "/home/omaia/Documents/Maia Class"
git add -A
git commit -m "Fase 0: peças atualizadas, Tailwind 4, guardião da modularidade e comandos de verificação"
```
- [ ] Concluído.

---

## Parte B — Feita pelo autor (a IA só orienta, passo a passo)

### B1. Seu nome nos registros do Git
Os salvamentos estão assinados como "Maia <maia@local>" (provisório). O autor informa o nome e o e-mail, e a IA roda (na raiz do projeto):
```bash
git config user.name "NOME DO AUTOR"
git config user.email "EMAIL DO AUTOR"
```
- [ ] Concluído.

### B2. Testar a pressão da Wacom no Fedora (antes de qualquer código)
1. Instalar o Chromium (navegador de código aberto do Google, necessário para os recursos de baixa latência):
   `sudo dnf install chromium`
2. Abrir no Chromium uma página de teste de caneta, por exemplo: `https://patrickhlauke.github.io/touch/pen-tracker/`
3. Desenhar com a Wacom e conferir se a **pressão** (`pressure`) varia entre 0 e 1, e se o tipo aparece como `pen`.
4. Repetir no Firefox, só para registro.
- [ ] Pressão funciona no Chromium? ☐ Sim ☐ Não. *(Se não funcionar, a IA deve investigar antes da Fase 1.)*

### B3. Preparar o tablet para teste via cabo USB (D-22)
1. No computador: `sudo dnf install android-tools`
2. No Galaxy Tab S6 Lite: **Configurações → Sobre o tablet → Informações do software** → tocar 7 vezes em **"Número de compilação"** (ativa as "Opções do desenvolvedor").
3. **Configurações → Opções do desenvolvedor** → ativar **"Depuração USB"**.
4. Ligar o tablet no PC pelo cabo e aceitar a mensagem "Permitir depuração USB?".
5. No computador: `adb devices` → o tablet deve aparecer na lista como `device`.
- [ ] Tablet aparece no `adb devices`.
- *(Na Fase 1, o comando `adb reverse tcp:5173 tcp:5173` fará o tablet abrir o app em `http://localhost:5173`, que conta como conexão segura.)*

### B4. Backup no GitHub (repositório **privado**, porque o produto é comercial)
1. Criar uma conta em github.com (se ainda não tiver).
2. `sudo dnf install gh` e depois `gh auth login` (seguir as perguntas: GitHub.com → HTTPS → login pelo navegador).
3. Na raiz do projeto: `gh repo create maia-class --private --source=. --push`
- [ ] Projeto aparece no GitHub como **privado**.

---

## Quando tudo estiver marcado
A Fase 0 está concluída. O próximo passo é o autor pedir ao Claude o início da **Fase 1** (ver [plano-completo.md](plano-completo.md)).
