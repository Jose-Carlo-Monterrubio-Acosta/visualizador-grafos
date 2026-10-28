import type { EstadoTopo } from '../types/ordenTopologico';

export function* topoGenerador(grafo: Record<string, string[]>, nodos: string[]): Generator<EstadoTopo> {
    const visitados = new Set<string>();
    const orden: string[] = [];

    yield { nodoActual: null, visitados: new Set(visitados), orden: [...orden], lineaActiva: 2, terminado: false };
    yield { nodoActual: null, visitados: new Set(visitados), orden: [...orden], lineaActiva: 3, terminado: false };

    function* dfs(u: string): Generator<EstadoTopo> {
        visitados.add(u);
        yield { nodoActual: u, visitados: new Set(visitados), orden: [...orden], lineaActiva: 6, terminado: false };
        
        for (const v of (grafo[u] ?? [])) {
            yield { nodoActual: u, visitados: new Set(visitados), orden: [...orden], lineaActiva: 7, terminado: false };
            if (!visitados.has(v)) {
                yield { nodoActual: u, visitados: new Set(visitados), orden: [...orden], lineaActiva: 8, terminado: false };
                yield* dfs(v);
            }
        }
        orden.unshift(u);
        yield { nodoActual: u, visitados: new Set(visitados), orden: [...orden], lineaActiva: 10, terminado: false };
    }

    for (const nodo of nodos) {
        yield { nodoActual: nodo, visitados: new Set(visitados), orden: [...orden], lineaActiva: 12, terminado: false };
        if (!visitados.has(nodo)) {
            yield { nodoActual: nodo, visitados: new Set(visitados), orden: [...orden], lineaActiva: 13, terminado: false };
            yield* dfs(nodo);
        }
    }

    yield { nodoActual: null, visitados: new Set(visitados), orden: [...orden], lineaActiva: 0, terminado: true };
}
