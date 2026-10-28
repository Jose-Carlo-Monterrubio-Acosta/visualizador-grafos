export interface NodoFW {
    id: number;
    etiqueta: string;
    x: number;
    y: number;
}

export interface AristaFW {
    origen: number;
    destino: number;
    peso: number;
}

export interface EstadoFW {
    distancias: number[][];
    k: number | null;
    i: number | null;
    j: number | null;
    lineaActiva: number;
    terminado: boolean;
}
