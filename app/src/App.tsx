import { useState, useMemo } from 'react';
import { Quadro } from './interface/Quadro';
import { BarraFerramentas, PosicaoDock } from './interface/BarraFerramentas';
import { DocumentoQuadro } from './motor/documento';
import { ConfigCaneta, CONFIG_CANETA_PADRAO } from './modulos/caneta';
import { TipoFundo } from './motor/pintor';

export function App() {
  const documento = useMemo(() => new DocumentoQuadro(), []);

  const [configCaneta, setConfigCaneta] = useState<ConfigCaneta>(CONFIG_CANETA_PADRAO);
  const [tipoFundo, setTipoFundo] = useState<TipoFundo>('grade');
  const [modoEscuro, setModoEscuro] = useState<boolean>(false);
  const [posicaoDock, setPosicaoDock] = useState<PosicaoDock>('rodape');

  // Estado do histórico para habilitar/desabilitar botões
  const [, setHistoricoTick] = useState(0);

  const atualizarConfigCaneta = (nova: Partial<ConfigCaneta>) => {
    setConfigCaneta((prev) => ({ ...prev, ...nova }));
  };

  const handleHistoricoMudou = () => {
    setHistoricoTick((t) => t + 1);
  };

  return (
    <div className={`w-full h-full relative overflow-hidden ${modoEscuro ? 'dark' : ''}`}>
      {/* Quadro Infinito */}
      <Quadro
        documento={documento}
        configCaneta={configCaneta}
        tipoFundo={tipoFundo}
        modoEscuro={modoEscuro}
        onHistoricoMudou={handleHistoricoMudou}
      />

      {/* Barra de Ferramentas Flutuante (Dock móvel) */}
      <BarraFerramentas
        configCaneta={configCaneta}
        aoMudarConfigCaneta={atualizarConfigCaneta}
        tipoFundo={tipoFundo}
        aoMudarTipoFundo={setTipoFundo}
        modoEscuro={modoEscuro}
        aoAlternarModoEscuro={() => setModoEscuro((v) => !v)}
        podeDesfazer={documento.podeDesfazer()}
        podeRefazer={documento.podeRefazer()}
        aoDesfazer={() => documento.desfazer()}
        aoRefazer={() => documento.refazer()}
        posicaoDock={posicaoDock}
        aoMudarPosicaoDock={setPosicaoDock}
      />
    </div>
  );
}

export default App;
