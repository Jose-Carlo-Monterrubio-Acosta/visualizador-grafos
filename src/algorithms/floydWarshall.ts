import type { AristaFW, EstadoFW } from '../types/floydWarshall';

export const INF = 999; // Representación visual de Infinito

export function* fwGenerador(nodosTotales: number, aristas: AristaFW[]): Generator<EstadoFW> {
    const dist: number[][] = Array.from({ length: nodosTotales }, () => Array(nodosTotales).fill(INF));
    
    // Inicialización
    for (let i = 0; i < nodosTotales; i++) {
        const row = dist[i];
        if (row) row[i] = 0;
    }
    for (const arista of aristas) {
        const row = dist[arista.origen];
        if (row) row[arista.destino] = arista.peso;
    }

    yield { distancias: dist.map(row => [...row]), k: null, i: null, j: null, lineaActiva: 2, terminado: false };

    // Triple Bucle
    for (let k = 0; k < nodosTotales; k++) {
        yield { distancias: dist.map(row => [...row]), k, i: null, j: null, lineaActiva: 3, terminado: false };
        for (let i = 0; i < nodosTotales; i++) {
            yield { distancias: dist.map(row => [...row]), k, i, j: null, lineaActiva: 4, terminado: false };
            for (let j = 0; j < nodosTotales; j++) {
                yield { distancias: dist.map(row => [...row]), k, i, j, lineaActiva: 5, terminado: false };
                
                const dIK = dist[i]?.[k] ?? INF;
                const dKJ = dist[k]?.[j] ?? INF;
                const dIJ = dist[i]?.[j] ?? INF;

                if (dIK !== INF && dKJ !== INF) {
                    yield { distancias: dist.map(row => [...row]), k, i, j, lineaActiva: 6, terminado: false };
                    
                    if (dIK + dKJ < dIJ) {
                        const rowI = dist[i];
                        if (rowI) rowI[j] = dIK + dKJ;
                        yield { distancias: dist.map(row => [...row]), k, i, j, lineaActiva: 7, terminado: false };
                    }
                }
            }
        }
    }

    yield { distancias: dist.map(row => [...row]), k: null, i: null, j: null, lineaActiva: 0, terminado: true };
}
