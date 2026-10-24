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
