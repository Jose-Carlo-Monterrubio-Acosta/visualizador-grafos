/**
 * Tipos base del grafo.
 *
 * Se diseñan de forma genérica para que sirvan a los 3 algoritmos del módulo:
 *  - DFS y Coloreo Bipartito usan la lista de adyacencia.
 *  - Bellman-Ford usará la lista de aristas con `weight`.
 */

/** Identificador de un nodo (ej. "A", "B", "C"). */
export type NodeId = string;

/** Arista dirigida u opcionalmente ponderada. */
export interface Edge {
  readonly from: NodeId;
  readonly to: NodeId;
  /** Peso de la arista (opcional; lo usará Bellman-Ford). */
  readonly weight?: number;
}

/** Lista de adyacencia: para cada nodo, la lista ordenada de sus vecinos. */
export type AdjacencyList = Readonly<Record<NodeId, readonly NodeId[]>>;

/** Representación completa del grafo. */
export interface Graph {
  /** Todos los nodos (incluye nodos aislados). */
  readonly nodes: readonly NodeId[];
  /** Aristas tal como se definieron (útil para dibujar y para Bellman-Ford). */
  readonly edges: readonly Edge[];
  /** Lista de adyacencia derivada de `edges`. */
  readonly adjacency: AdjacencyList;
  /** `true` = dirigido; `false` = no dirigido (cada arista se agrega en ambos sentidos). */
  readonly directed: boolean;
}
