export interface NodoTopo {
    id: string;
    x: number;
    y: number;
}

export interface AristaTopo {
    origen: string;
    destino: string;
}

export interface EstadoTopo {
    nodoActual: string | null;
    visitados: Set<string>;
    orden: string[];
    lineaActiva: number;
    terminado: boolean;
}
