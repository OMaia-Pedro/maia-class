export interface ConfigCaneta {
  cor: string;
  espessura: number;
  modo: 'fluido' | 'uniforme';
  estilo: 'continuo' | 'pontilhado' | 'tracejado';
  tipo: 'caneta' | 'marcatexto';
  tipoEspessura: 'real' | 'virtual';
}

export const PALETA_CORES_CANETA = [
  { nome: 'Preto', valor: '#1E293B', valorEscuro: '#F8FAFC' },
  { nome: 'Azul', valor: '#2563EB', valorEscuro: '#3B82F6' },
  { nome: 'Vermelho', valor: '#DC2626', valorEscuro: '#EF4444' },
  { nome: 'Verde', valor: '#16A34A', valorEscuro: '#22C55E' },
  { nome: 'Roxo', valor: '#9333EA', valorEscuro: '#A855F7' },
  { nome: 'Laranja', valor: '#EA580C', valorEscuro: '#F97316' },
];

export const PALETA_CORES_MARCATEXTO = [
  { nome: 'Amarelo', valor: 'rgba(250, 204, 21, 0.45)' },
  { nome: 'Verde', valor: 'rgba(74, 222, 128, 0.45)' },
  { nome: 'Azul', valor: 'rgba(56, 189, 248, 0.45)' },
  { nome: 'Rosa', valor: 'rgba(244, 114, 182, 0.45)' },
  { nome: 'Laranja', valor: 'rgba(251, 146, 60, 0.45)' },
];

export const CONFIG_CANETA_PADRAO: ConfigCaneta = {
  cor: '#1E293B',
  espessura: 4,
  modo: 'fluido',
  estilo: 'continuo',
  tipo: 'caneta',
  tipoEspessura: 'real',
};
