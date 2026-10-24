import { getStroke } from 'perfect-freehand';
import { Camera } from './camera';
import { TracoVetorial, PontoEntrada } from './documento';

export type TipoFundo = 'grade' | 'pontilhado' | 'linhas' | 'liso';

export interface OpcoesPintor {
  tipoFundo: TipoFundo;
  modoEscuro: boolean;
}

export class PintorQuadro {
  private dpr: number = window.devicePixelRatio || 1;

  public redimensionar(canvas: HTMLCanvasElement, largura: number, altura: number): void {
    this.dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(largura * this.dpr);
    canvas.height = Math.round(altura * this.dpr);
    canvas.style.width = `${largura}px`;
    canvas.style.height = `${altura}px`;
  }

  /**
   * Renderiza a grade de fundo infinito de acordo com o zoom e deslocamento da câmera.
   */
  public desenharFundo(
    ctx: CanvasRenderingContext2D,
    camera: Camera,
    largura: number,
    altura: number,
    opcoes: OpcoesPintor
  ): void {
    ctx.save();
    ctx.scale(this.dpr, this.dpr);

    // Cor de fundo
    ctx.fillStyle = opcoes.modoEscuro ? '#121214' : '#FBFBFC';
    ctx.fillRect(0, 0, largura, altura);

    if (opcoes.tipoFundo === 'liso') {
      ctx.restore();
      return;
    }

    const corGrid = opcoes.modoEscuro ? '#27272A' : '#E2E8F0';
    ctx.strokeStyle = corGrid;
    ctx.fillStyle = corGrid;
    ctx.lineWidth = 1;

    // Tamanho base do passo da grade (30px no zoom de 100%)
    const passoBase = 32;
    let passo = passoBase * camera.zoom;

    // Adaptação de grade para zoom extremo (subdivisões dinâmicas)
    while (passo < 16) passo *= 2;
    while (passo > 64) passo /= 2;

    const inicioX = (camera.x % passo + passo) % passo;
    const inicioY = (camera.y % passo + passo) % passo;

    if (opcoes.tipoFundo === 'grade') {
      ctx.beginPath();
      for (let x = inicioX; x < largura; x += passo) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, altura);
      }
      for (let y = inicioY; y < altura; y += passo) {
        ctx.moveTo(0, y);
        ctx.lineTo(largura, y);
      }
      ctx.stroke();
    } else if (opcoes.tipoFundo === 'pontilhado') {
      const raioPonto = 1.25;
      for (let x = inicioX; x < largura; x += passo) {
        for (let y = inicioY; y < altura; y += passo) {
          ctx.beginPath();
          ctx.arc(x, y, raioPonto, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    } else if (opcoes.tipoFundo === 'linhas') {
      ctx.beginPath();
      for (let y = inicioY; y < altura; y += passo) {
        ctx.moveTo(0, y);
        ctx.lineTo(largura, y);
      }
      ctx.stroke();
    }

    ctx.restore();
  }

  /**
   * Renderiza todos os traços já secos no canvas principal.
   */
  public desenharTracos(
    ctx: CanvasRenderingContext2D,
    camera: Camera,
    tracos: TracoVetorial[]
  ): void {
    ctx.save();
    ctx.scale(this.dpr, this.dpr);

    // Primeiro desenhamos os marca-textos (ficam na camada de trás), depois as canetas
    const marcaTextos = tracos.filter((t) => t.tipo === 'marcatexto');
    const canetas = tracos.filter((t) => t.tipo !== 'marcatexto');

    for (const t of marcaTextos) {
      this.desenharUmTraco(ctx, camera, t);
    }
    for (const t of canetas) {
      this.desenharUmTraco(ctx, camera, t);
    }

    ctx.restore();
  }

  /**
   * Renderiza o traço molhado em tempo real (baixa latência) na camada temporária.
   */
  public desenharTracoAtivo(
    ctx: CanvasRenderingContext2D,
    camera: Camera,
    pontos: PontoEntrada[],
    config: {
      cor: string;
      espessura: number;
      modo: 'fluido' | 'uniforme';
      estilo: 'continuo' | 'pontilhado' | 'tracejado';
      tipo: 'caneta' | 'marcatexto';
      tipoEspessura: 'real' | 'virtual';
    }
  ): void {
    if (pontos.length === 0) return;

    ctx.save();
    ctx.scale(this.dpr, this.dpr);

    const tracoTemp: TracoVetorial = {
      id: 'ativo',
      pontos,
      cor: config.cor,
      espessura: config.espessura,
      modo: config.modo,
      estilo: config.estilo,
      tipo: config.tipo,
      tipoEspessura: config.tipoEspessura,
      zoomCriacao: camera.zoom,
    };

    this.desenharUmTraco(ctx, camera, tracoTemp);
    ctx.restore();
  }

  private desenharUmTraco(
    ctx: CanvasRenderingContext2D,
    camera: Camera,
    traco: TracoVetorial
  ): void {
    if (traco.pontos.length === 0) return;

    // Converte os pontos do mundo para a tela
    const pontosTela = traco.pontos.map((p) => {
      const posTela = camera.mundoParaTela(p.x, p.y);
      return [posTela.x, posTela.y, p.pressao];
    });

    // Calcula a espessura aparente na tela
    let tamanhoTela = traco.espessura;
    if (traco.tipoEspessura === 'virtual') {
      tamanhoTela = traco.espessura * camera.zoom;
    }

    if (traco.modo === 'fluido' && traco.estilo === 'continuo') {
      // Modo Fluido: contorno poligonal suave sensível à pressão via perfect-freehand
      const contorno = getStroke(pontosTela, {
        size: Math.max(tamanhoTela, 1.5),
        thinning: 0.5,
        smoothing: 0.5,
        streamline: 0.5,
      });

      if (contorno.length < 3) return;

      ctx.fillStyle = traco.cor;
      ctx.beginPath();
      ctx.moveTo(contorno[0][0], contorno[0][1]);
      for (let i = 1; i < contorno.length; i++) {
        ctx.lineTo(contorno[i][0], contorno[i][1]);
      }
      ctx.closePath();
      ctx.fill();
    } else {
      // Modo Uniforme ou traços pontilhados/tracejados
      ctx.strokeStyle = traco.cor;
      ctx.lineWidth = Math.max(tamanhoTela, 1);
      ctx.lineCap = traco.estilo === 'pontilhado' ? 'round' : 'round';
      ctx.lineJoin = 'round';

      if (traco.estilo === 'pontilhado') {
        ctx.setLineDash([1, Math.max(tamanhoTela * 2, 8)]);
      } else if (traco.estilo === 'tracejado') {
        ctx.setLineDash([Math.max(tamanhoTela * 3, 12), Math.max(tamanhoTela * 2, 8)]);
      } else {
        ctx.setLineDash([]);
      }

      ctx.beginPath();
      ctx.moveTo(pontosTela[0][0], pontosTela[0][1]);
      for (let i = 1; i < pontosTela.length; i++) {
        ctx.lineTo(pontosTela[i][0], pontosTela[i][1]);
      }
      ctx.stroke();
      ctx.setLineDash([]); // restaura
    }
  }
}
