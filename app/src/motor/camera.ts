export interface Ponto {
  x: number;
  y: number;
}

export class Camera {
  public x: number = 0;
  public y: number = 0;
  public zoom: number = 1.0;

  constructor(x = 0, y = 0, zoom = 1.0) {
    this.x = x;
    this.y = y;
    this.zoom = zoom;
  }

  /**
   * Converte uma coordenada de pixel da tela do dispositivo para o ponto no espaço infinito do quadro.
   */
  public telaParaMundo(telaX: number, telaY: number): Ponto {
    return {
      x: (telaX - this.x) / this.zoom,
      y: (telaY - this.y) / this.zoom,
    };
  }

  /**
   * Converte uma coordenada do mundo infinito para pixels na tela.
   */
  public mundoParaTela(mundoX: number, mundoY: number): Ponto {
    return {
      x: mundoX * this.zoom + this.x,
      y: mundoY * this.zoom + this.y,
    };
  }

  /**
   * Aplica deslocamento (pan / arrasto) na câmera.
   */
  public deslocar(dx: number, dy: number): void {
    this.x += dx;
    this.y += dy;
  }

  /**
   * Aplica zoom centrado em um ponto da tela (ex: centro dos dois dedos no tablet ou cursor do mouse).
   */
  public aplicarZoom(fator: number, centroTelaX: number, centroTelaY: number): void {
    const novoZoom = Math.min(Math.max(this.zoom * fator, 0.001), 1000.0);
    if (novoZoom === this.zoom) return;

    // Garante que o ponto sob o cursor/dedos continue exatamente no mesmo lugar
    const mundoAntes = this.telaParaMundo(centroTelaX, centroTelaY);
    this.zoom = novoZoom;
    const mundoDepois = this.telaParaMundo(centroTelaX, centroTelaY);

    this.x += (mundoDepois.x - mundoAntes.x) * this.zoom;
    this.y += (mundoDepois.y - mundoAntes.y) * this.zoom;
  }
}
