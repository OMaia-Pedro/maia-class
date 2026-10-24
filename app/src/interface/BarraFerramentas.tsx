import React, { useState } from 'react';
import {
  Pen,
  Highlighter,
  Eraser,
  Undo2,
  Redo2,
  Moon,
  Sun,
  Grid,
  Sliders,
  Move,
} from 'lucide-react';
import {
  ConfigCaneta,
  PALETA_CORES_CANETA,
  PALETA_CORES_MARCATEXTO,
} from '../modulos/caneta';
import { TipoFundo } from '../motor/pintor';

export type PosicaoDock = 'topo' | 'rodape' | 'esquerda' | 'direita';

interface PropsBarraFerramentas {
  configCaneta: ConfigCaneta;
  aoMudarConfigCaneta: (novaConfig: Partial<ConfigCaneta>) => void;
  tipoFundo: TipoFundo;
  aoMudarTipoFundo: (fundo: TipoFundo) => void;
  modoEscuro: boolean;
  aoAlternarModoEscuro: () => void;
  podeDesfazer: boolean;
  podeRefazer: boolean;
  aoDesfazer: () => void;
  aoRefazer: () => void;
  posicaoDock: PosicaoDock;
  aoMudarPosicaoDock: (pos: PosicaoDock) => void;
}

export const BarraFerramentas: React.FC<PropsBarraFerramentas> = ({
  configCaneta,
  aoMudarConfigCaneta,
  tipoFundo,
  aoMudarTipoFundo,
  modoEscuro,
  aoAlternarModoEscuro,
  podeDesfazer,
  podeRefazer,
  aoDesfazer,
  aoRefazer,
  posicaoDock,
  aoMudarPosicaoDock,
}) => {
  const [menuAberto, setMenuAberto] = useState<'cores' | 'espessura' | 'fundo' | null>(null);

  const classesPosicao: Record<PosicaoDock, string> = {
    topo: 'top-4 left-1/2 -translate-x-1/2 flex-row',
    rodape: 'bottom-6 left-1/2 -translate-x-1/2 flex-row',
    esquerda: 'left-4 top-1/2 -translate-y-1/2 flex-col',
    direita: 'right-4 top-1/2 -translate-y-1/2 flex-col',
  };

  const alternarPosicao = () => {
    const ordem: PosicaoDock[] = ['rodape', 'topo', 'esquerda', 'direita'];
    const proxima = ordem[(ordem.indexOf(posicaoDock) + 1) % ordem.length];
    aoMudarPosicaoDock(proxima);
  };

  const paletaAtual =
    configCaneta.tipo === 'marcatexto' ? PALETA_CORES_MARCATEXTO : PALETA_CORES_CANETA;

  return (
    <div
      className={`fixed z-50 flex items-center gap-1.5 p-2 rounded-2xl shadow-xl backdrop-blur-md transition-all duration-200 border ${
        modoEscuro
          ? 'bg-[#18181B]/90 border-zinc-700/60 text-zinc-100'
          : 'bg-white/95 border-slate-200/80 text-slate-800'
      } ${classesPosicao[posicaoDock]}`}
    >
      {/* Botão de mover dock */}
      <button
        onClick={alternarPosicao}
        title="Mover barra de ferramentas"
        className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200"
      >
        <Move className="w-4 h-4" />
      </button>

      <div className="h-5 w-px bg-slate-200 dark:bg-zinc-700 mx-0.5" />

      {/* Caneta */}
      <button
        onClick={() => {
          aoMudarConfigCaneta({ tipo: 'caneta' });
          if (menuAberto === 'cores') setMenuAberto(null);
        }}
        title="Caneta"
        className={`p-2.5 rounded-xl transition-all ${
          configCaneta.tipo === 'caneta'
            ? 'bg-blue-600 text-white shadow-md'
            : 'hover:bg-black/5 dark:hover:bg-white/10'
        }`}
      >
        <Pen className="w-5 h-5" />
      </button>

      {/* Marca-texto */}
      <button
        onClick={() => {
          aoMudarConfigCaneta({ tipo: 'marcatexto' });
          if (menuAberto === 'cores') setMenuAberto(null);
        }}
        title="Marca-texto"
        className={`p-2.5 rounded-xl transition-all ${
          configCaneta.tipo === 'marcatexto'
            ? 'bg-amber-500 text-white shadow-md'
            : 'hover:bg-black/5 dark:hover:bg-white/10'
        }`}
      >
        <Highlighter className="w-5 h-5" />
      </button>

      {/* Borracha */}
      <button
        onClick={() => {
          // Fase 2 integrará a borracha com corte parcial
        }}
        title="Borracha (em breve)"
        className="p-2.5 rounded-xl opacity-50 hover:bg-black/5 dark:hover:bg-white/10 cursor-not-allowed"
      >
        <Eraser className="w-5 h-5" />
      </button>

      <div className="h-5 w-px bg-slate-200 dark:bg-zinc-700 mx-0.5" />

      {/* Seletor de Cores */}
      <div className="relative">
        <button
          onClick={() => setMenuAberto(menuAberto === 'cores' ? null : 'cores')}
          title="Escolher Cor"
          className="p-2.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 flex items-center justify-center"
        >
          <div
            className="w-5 h-5 rounded-full border-2 border-white dark:border-zinc-800 shadow-sm"
            style={{ backgroundColor: configCaneta.cor }}
          />
        </button>

        {menuAberto === 'cores' && (
          <div
            className={`absolute bottom-full mb-3 left-1/2 -translate-x-1/2 p-3 rounded-2xl shadow-2xl border flex gap-2 backdrop-blur-md z-50 ${
              modoEscuro
                ? 'bg-[#1E1E22] border-zinc-700 text-white'
                : 'bg-white border-slate-200 text-slate-800'
            }`}
          >
            {paletaAtual.map((cor) => {
              const valorFinal: string =
                modoEscuro && 'valorEscuro' in cor && typeof cor.valorEscuro === 'string'
                  ? cor.valorEscuro
                  : cor.valor;
              const ativa = configCaneta.cor === valorFinal;
              return (
                <button
                  key={cor.nome}
                  onClick={() => {
                    aoMudarConfigCaneta({ cor: valorFinal });
                    setMenuAberto(null);
                  }}
                  className={`w-7 h-7 rounded-full transition-transform ${
                    ativa ? 'scale-125 ring-2 ring-blue-500 ring-offset-2' : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: valorFinal }}
                  title={cor.nome}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Seletor de Estilo & Espessura */}
      <div className="relative">
        <button
          onClick={() => setMenuAberto(menuAberto === 'espessura' ? null : 'espessura')}
          title="Ajustes do Traço"
          className="p-2.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/10"
        >
          <Sliders className="w-5 h-5" />
        </button>

        {menuAberto === 'espessura' && (
          <div
            className={`absolute bottom-full mb-3 left-1/2 -translate-x-1/2 p-4 rounded-2xl shadow-2xl border w-64 backdrop-blur-md z-50 space-y-3.5 ${
              modoEscuro
                ? 'bg-[#1E1E22] border-zinc-700 text-white'
                : 'bg-white border-slate-200 text-slate-800'
            }`}
          >
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1 text-slate-500 dark:text-zinc-400">
                <span>Espessura: {configCaneta.espessura}px</span>
                <span>{configCaneta.tipoEspessura === 'real' ? 'Real' : 'Virtual'}</span>
              </div>
              <input
                type="range"
                min="1"
                max="32"
                value={configCaneta.espessura}
                onChange={(e) => aoMudarConfigCaneta({ espessura: Number(e.target.value) })}
                className="w-full accent-blue-600"
              />
            </div>

            <div className="flex gap-1.5 text-xs">
              <button
                onClick={() =>
                  aoMudarConfigCaneta({
                    tipoEspessura: configCaneta.tipoEspessura === 'real' ? 'virtual' : 'real',
                  })
                }
                className="flex-1 py-1 px-2 rounded-lg bg-black/5 dark:bg-white/10 hover:bg-blue-600 hover:text-white"
              >
                {configCaneta.tipoEspessura === 'real' ? '📐 Modo Real' : '🔍 Modo Virtual'}
              </button>
              <button
                onClick={() =>
                  aoMudarConfigCaneta({
                    modo: configCaneta.modo === 'fluido' ? 'uniforme' : 'fluido',
                  })
                }
                className="flex-1 py-1 px-2 rounded-lg bg-black/5 dark:bg-white/10 hover:bg-blue-600 hover:text-white"
              >
                {configCaneta.modo === 'fluido' ? '✍️ Fluida' : '📏 Uniforme'}
              </button>
            </div>

            {/* Estilo do traço */}
            <div className="flex gap-1 pt-1 border-t border-slate-200 dark:border-zinc-700 text-xs">
              {(['continuo', 'pontilhado', 'tracejado'] as const).map((estilo) => (
                <button
                  key={estilo}
                  onClick={() => aoMudarConfigCaneta({ estilo })}
                  className={`flex-1 py-1 rounded capitalize ${
                    configCaneta.estilo === estilo
                      ? 'bg-blue-600 text-white font-medium'
                      : 'hover:bg-black/5 dark:hover:bg-white/10'
                  }`}
                >
                  {estilo === 'continuo' ? 'Liso' : estilo === 'pontilhado' ? 'Pontos' : 'Traços'}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="h-5 w-px bg-slate-200 dark:bg-zinc-700 mx-0.5" />

      {/* Desfazer */}
      <button
        onClick={aoDesfazer}
        disabled={!podeDesfazer}
        title="Desfazer"
        className={`p-2.5 rounded-xl transition-all ${
          podeDesfazer
            ? 'hover:bg-black/5 dark:hover:bg-white/10 active:scale-95'
            : 'opacity-30 cursor-not-allowed'
        }`}
      >
        <Undo2 className="w-5 h-5" />
      </button>

      {/* Refazer */}
      <button
        onClick={aoRefazer}
        disabled={!podeRefazer}
        title="Refazer"
        className={`p-2.5 rounded-xl transition-all ${
          podeRefazer
            ? 'hover:bg-black/5 dark:hover:bg-white/10 active:scale-95'
            : 'opacity-30 cursor-not-allowed'
        }`}
      >
        <Redo2 className="w-5 h-5" />
      </button>

      <div className="h-5 w-px bg-slate-200 dark:bg-zinc-700 mx-0.5" />

      {/* Tipo de Fundo */}
      <div className="relative">
        <button
          onClick={() => setMenuAberto(menuAberto === 'fundo' ? null : 'fundo')}
          title="Fundo do Quadro"
          className="p-2.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/10"
        >
          <Grid className="w-5 h-5" />
        </button>

        {menuAberto === 'fundo' && (
          <div
            className={`absolute bottom-full mb-3 left-1/2 -translate-x-1/2 p-2 rounded-2xl shadow-2xl border flex flex-col gap-1 w-36 backdrop-blur-md z-50 text-xs ${
              modoEscuro
                ? 'bg-[#1E1E22] border-zinc-700 text-white'
                : 'bg-white border-slate-200 text-slate-800'
            }`}
          >
            {(['grade', 'pontilhado', 'linhas', 'liso'] as const).map((f) => (
              <button
                key={f}
                onClick={() => {
                  aoMudarTipoFundo(f);
                  setMenuAberto(null);
                }}
                className={`py-1.5 px-3 rounded-lg text-left capitalize ${
                  tipoFundo === f
                    ? 'bg-blue-600 text-white font-medium'
                    : 'hover:bg-black/5 dark:hover:bg-white/10'
                }`}
              >
                {f === 'grade'
                  ? 'Matemática'
                  : f === 'pontilhado'
                  ? 'Pontilhado'
                  : f === 'linhas'
                  ? 'Linhas'
                  : 'Liso'}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Tema Claro / Escuro */}
      <button
        onClick={aoAlternarModoEscuro}
        title={modoEscuro ? 'Tema Claro' : 'Tema Escuro'}
        className="p-2.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/10"
      >
        {modoEscuro ? (
          <Sun className="w-5 h-5 text-amber-400" />
        ) : (
          <Moon className="w-5 h-5 text-slate-600" />
        )}
      </button>
    </div>
  );
};
