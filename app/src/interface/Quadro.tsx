import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Camera } from '../motor/camera';
import { DocumentoQuadro, PontoEntrada, TracoVetorial } from '../motor/documento';
import { PintorQuadro, TipoFundo } from '../motor/pintor';
import { ConfigCaneta } from '../modulos/caneta';

interface PropsQuadro {
  documento: DocumentoQuadro;
  configCaneta: ConfigCaneta;
  tipoFundo: TipoFundo;
  modoEscuro: boolean;
  onHistoricoMudou?: () => void;
}

export const Quadro: React.FC<PropsQuadro> = ({
  documento,
  configCaneta,
  tipoFundo,
  modoEscuro,
  onHistoricoMudou,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasFundoRef = useRef<HTMLCanvasElement>(null);
  const canvasSecoRef = useRef<HTMLCanvasElement>(null);
  const canvasMolhadoRef = useRef<HTMLCanvasElement>(null);

  const cameraRef = useRef<Camera>(new Camera(0, 0, 1.0));
  const pintorRef = useRef<PintorQuadro>(new PintorQuadro());

  // Traço ativo
  const pontosAtivosRef = useRef<PontoEntrada[]>([]);
  const estaDesenhandoRef = useRef<boolean>(false);
  const pointerIdAtivoRef = useRef<number | null>(null);

  // Gestos de 2 dedos (Pan / Pinch Zoom)
  const toquesAtivosRef = useRef<Map<number, { x: number; y: number }>>(new Map());
  const distanciaInicialToquesRef = useRef<number | null>(null);
  const centroInicialToquesRef = useRef<{ x: number; y: number } | null>(null);

  // Informações de diagnóstico / latência
  const [zoomAtual, setZoomAtual] = useState<number>(100);
  const [fps, setFps] = useState<number>(60);
  const frameCountRef = useRef<number>(0);
  const ultimoFpsCheckRef = useRef<number>(performance.now());

  // Redesenho do fundo e tinta seca
  const redesenharTudo = useCallback(() => {
    const canvasFundo = canvasFundoRef.current;
    const canvasSeco = canvasSecoRef.current;
    if (!canvasFundo || !canvasSeco) return;

    const ctxFundo = canvasFundo.getContext('2d');
    const ctxSeco = canvasSeco.getContext('2d');
    if (!ctxFundo || !ctxSeco) return;

    const largura = canvasFundo.clientWidth;
    const altura = canvasFundo.clientHeight;

    // Fundo
    pintorRef.current.desenharFundo(ctxFundo, cameraRef.current, largura, altura, {
      tipoFundo,
      modoEscuro,
    });

    // Traços secos
    ctxSeco.clearRect(0, 0, canvasSeco.width, canvasSeco.height);
    pintorRef.current.desenharTracos(
      ctxSeco,
      cameraRef.current,
      documento.obterTracos()
    );

    setZoomAtual(Math.round(cameraRef.current.zoom * 100));
  }, [documento, tipoFundo, modoEscuro]);

  // Redimensionamento de tela
  useEffect(() => {
    const atualizarTamanho = () => {
      const container = containerRef.current;
      const cFundo = canvasFundoRef.current;
      const cSeco = canvasSecoRef.current;
      const cMolhado = canvasMolhadoRef.current;
      if (!container || !cFundo || !cSeco || !cMolhado) return;

      const largura = container.clientWidth;
      const altura = container.clientHeight;

      pintorRef.current.redimensionar(cFundo, largura, altura);
      pintorRef.current.redimensionar(cSeco, largura, altura);
      pintorRef.current.redimensionar(cMolhado, largura, altura);

      redesenharTudo();
    };

    atualizarTamanho();
    window.addEventListener('resize', atualizarTamanho);
    return () => window.removeEventListener('resize', atualizarTamanho);
  }, [redesenharTudo]);

  // Observa mudanças nos dados (ex: desfazer/refazer)
  useEffect(() => {
    const cancel = documento.aoMudar(() => {
      redesenharTudo();
      onHistoricoMudou?.();
    });
    return cancel;
  }, [documento, redesenharTudo, onHistoricoMudou]);

  // Loop de medição de FPS
  useEffect(() => {
    let animId: number;
    const medirFps = () => {
      frameCountRef.current++;
      const agora = performance.now();
      if (agora - ultimoFpsCheckRef.current >= 1000) {
        setFps(frameCountRef.current);
        frameCountRef.current = 0;
        ultimoFpsCheckRef.current = agora;
      }
      animId = requestAnimationFrame(medirFps);
    };
    animId = requestAnimationFrame(medirFps);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Eventos de Ponteiro (Caneta, Touch e Mouse)
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);

    // Registro para multitoque (dedos)
    toquesAtivosRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (toquesAtivosRef.current.size >= 2) {
      // Entrando em modo de pan/pinch de 2 dedos
      estaDesenhandoRef.current = false;
      pontosAtivosRef.current = [];
      const ctxMolhado = canvasMolhadoRef.current?.getContext('2d');
      if (ctxMolhado && canvasMolhadoRef.current) {
        ctxMolhado.clearRect(0, 0, canvasMolhadoRef.current.width, canvasMolhadoRef.current.height);
      }
      return;
    }

    // Se for caneta ou botão primário do mouse: inicia desenho
    if (e.buttons === 1 || e.pointerType === 'pen') {
      estaDesenhandoRef.current = true;
      pointerIdAtivoRef.current = e.pointerId;

      const pMundo = cameraRef.current.telaParaMundo(e.clientX, e.clientY);
      const pressao = e.pressure > 0 ? e.pressure : 0.5;

      pontosAtivosRef.current = [{ x: pMundo.x, y: pMundo.y, pressao }];

      const ctxMolhado = canvasMolhadoRef.current?.getContext('2d');
      if (ctxMolhado) {
        pintorRef.current.desenharTracoAtivo(
          ctxMolhado,
          cameraRef.current,
          pontosAtivosRef.current,
          configCaneta
        );
      }
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();

    // 1. Gesto de 2 dedos (Pan + Zoom)
    if (toquesAtivosRef.current.has(e.pointerId)) {
      toquesAtivosRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    }

    if (toquesAtivosRef.current.size === 2) {
      const pontos = Array.from(toquesAtivosRef.current.values());
      const p1 = pontos[0];
      const p2 = pontos[1];

      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const distanciaAtual = Math.hypot(dx, dy);
      const centroAtual = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };

      if (distanciaInicialToquesRef.current !== null && centroInicialToquesRef.current !== null) {
        // Deslocamento (Pan)
        const dX = centroAtual.x - centroInicialToquesRef.current.x;
        const dY = centroAtual.y - centroInicialToquesRef.current.y;
        cameraRef.current.deslocar(dX, dY);

        // Zoom por pinça
        const fator = distanciaAtual / distanciaInicialToquesRef.current;
        cameraRef.current.aplicarZoom(fator, centroAtual.x, centroAtual.y);

        redesenharTudo();
      }

      distanciaInicialToquesRef.current = distanciaAtual;
      centroInicialToquesRef.current = centroAtual;
      return;
    }

    // 2. Traço da Caneta (Baixa latência com coalesced events)
    if (estaDesenhandoRef.current && pointerIdAtivoRef.current === e.pointerId) {
      // Coalesced events capturam todos os pontos intermediários enviados pelo digitalizador Wacom/S Pen
      const native = e.nativeEvent;
      const eventos: (PointerEvent | React.PointerEvent<HTMLCanvasElement>)[] =
        typeof native.getCoalescedEvents === 'function' ? native.getCoalescedEvents() : [e];

      for (const evt of eventos) {
        const pMundo = cameraRef.current.telaParaMundo(evt.clientX, evt.clientY);
        const pressao = evt.pressure > 0 ? evt.pressure : 0.5;
        pontosAtivosRef.current.push({ x: pMundo.x, y: pMundo.y, pressao });
      }

      const canvasMolhado = canvasMolhadoRef.current;
      if (!canvasMolhado) return;
      const ctxMolhado = canvasMolhado.getContext('2d');
      if (!ctxMolhado) return;

      // Limpa apenas a camada do traço ativo e repinta instantaneamente
      ctxMolhado.clearRect(0, 0, canvasMolhado.width, canvasMolhado.height);
      pintorRef.current.desenharTracoAtivo(
        ctxMolhado,
        cameraRef.current,
        pontosAtivosRef.current,
        configCaneta
      );
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    toquesAtivosRef.current.delete(e.pointerId);

    if (toquesAtivosRef.current.size < 2) {
      distanciaInicialToquesRef.current = null;
      centroInicialToquesRef.current = null;
    }

    if (estaDesenhandoRef.current && pointerIdAtivoRef.current === e.pointerId) {
      estaDesenhandoRef.current = false;
      pointerIdAtivoRef.current = null;

      if (pontosAtivosRef.current.length > 0) {
        // Empacota o traço no documento Yjs
        const novoTraco: TracoVetorial = {
          id: `traco_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          pontos: [...pontosAtivosRef.current],
          cor: configCaneta.cor,
          espessura: configCaneta.espessura,
          modo: configCaneta.modo,
          estilo: configCaneta.estilo,
          tipo: configCaneta.tipo,
          tipoEspessura: configCaneta.tipoEspessura,
          zoomCriacao: cameraRef.current.zoom,
        };

        documento.adicionarTraco(novoTraco);
        pontosAtivosRef.current = [];

        // Limpa a camada temporária
        const ctxMolhado = canvasMolhadoRef.current?.getContext('2d');
        if (ctxMolhado && canvasMolhadoRef.current) {
          ctxMolhado.clearRect(0, 0, canvasMolhadoRef.current.width, canvasMolhadoRef.current.height);
        }
      }
    }
  };

  // Zoom da roda do mouse ou gesto de pinça no trackpad
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.ctrlKey || e.metaKey) {
      // Zoom
      const fator = Math.exp(-e.deltaY * 0.005);
      cameraRef.current.aplicarZoom(fator, e.clientX, e.clientY);
    } else {
      // Pan
      cameraRef.current.deslocar(-e.deltaX, -e.deltaY);
    }
    redesenharTudo();
  };

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      className="relative w-full h-full overflow-hidden select-none cursor-crosshair touch-none"
    >
      {/* 1. Camada de Fundo (Grade / Pontilhado / Pautado) */}
      <canvas ref={canvasFundoRef} className="absolute inset-0 pointer-events-none" />

      {/* 2. Camada Seca (Todos os traços finalizados vetoriais) */}
      <canvas ref={canvasSecoRef} className="absolute inset-0 pointer-events-none" />

      {/* 3. Camada Molhada (Traço ativo de altíssima velocidade e eventos de ponteiro) */}
      <canvas
        ref={canvasMolhadoRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="absolute inset-0 touch-none"
      />

      {/* Indicador Discreto de Zoom e Performance (Canto inferior direito) */}
      <div className="fixed bottom-3 right-4 z-40 px-2.5 py-1 rounded-lg text-xs font-mono backdrop-blur-sm pointer-events-none border bg-white/70 dark:bg-zinc-900/70 text-slate-500 dark:text-zinc-400 border-slate-200/60 dark:border-zinc-800/60 flex gap-3">
        <span>Zoom: {zoomAtual}%</span>
        <span>FPS: {fps}</span>
      </div>
    </div>
  );
};
