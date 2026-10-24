import * as Y from 'yjs';

export interface PontoEntrada {
  x: number;
  y: number;
  pressao: number;
}

export interface TracoVetorial {
  id: string;
  pontos: PontoEntrada[];
  cor: string;
  espessura: number;
  modo: 'fluido' | 'uniforme';
  estilo: 'continuo' | 'pontilhado' | 'tracejado';
  tipo: 'caneta' | 'marcatexto';
  tipoEspessura: 'real' | 'virtual';
  zoomCriacao: number;
}

export class DocumentoQuadro {
  public ydoc: Y.Doc;
  public tracosArray: Y.Array<TracoVetorial>;
  public undoManager: Y.UndoManager;
  private ouvintes: Set<() => void> = new Set();

  constructor() {
    this.ydoc = new Y.Doc();
    this.tracosArray = this.ydoc.getArray<TracoVetorial>('tracos');
    this.undoManager = new Y.UndoManager(this.tracosArray);

    this.tracosArray.observe(() => {
      this.notificarMudanca();
    });
  }

  public adicionarTraco(traco: TracoVetorial): void {
    this.ydoc.transact(() => {
      this.tracosArray.push([traco]);
    });
  }

  public obterTracos(): TracoVetorial[] {
    return this.tracosArray.toArray();
  }

  public desfazer(): boolean {
    if (this.undoManager.canUndo()) {
      this.undoManager.undo();
      return true;
    }
    return false;
  }

  public refazer(): boolean {
    if (this.undoManager.canRedo()) {
      this.undoManager.redo();
      return true;
    }
    return false;
  }

  public podeDesfazer(): boolean {
    return this.undoManager.canUndo();
  }

  public podeRefazer(): boolean {
    return this.undoManager.canRedo();
  }

  public limpar(): void {
    this.ydoc.transact(() => {
      this.tracosArray.delete(0, this.tracosArray.length);
    });
  }

  public aoMudar(callback: () => void): () => void {
    this.ouvintes.add(callback);
    return () => this.ouvintes.delete(callback);
  }

  private notificarMudanca(): void {
    for (const ouvinte of this.ouvintes) {
      ouvinte();
    }
  }
}
