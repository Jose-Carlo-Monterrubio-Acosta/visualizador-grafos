import type { AdjacencyList, Edge, Graph, NodeId } from '../types/graph';

/**
 * Construye un `Graph` a partir de una lista de nodos y aristas.
 *
 * - Si el grafo es NO dirigido, cada arista (u, v) se agrega en ambos sentidos
 *   a la lista de adyacencia.
 * - Los vecinos se ordenan alfabéticamente para que el recorrido sea
 *   determinista (siempre el mismo orden de pasos en la visualización).
 *
 * @throws Error si una arista referencia un nodo que no existe.
 */
export function buildGraph(
  nodes: readonly NodeId[],
  edges: readonly Edge[],
  directed = false,
): Graph {
  const adjacency: Record<NodeId, NodeId[]> = {};
  for (const node of nodes) {
    adjacency[node] = [];
  }

  const ensureNode = (id: NodeId): NodeId[] => {
    const list = adjacency[id];
    if (list === undefined) {
      throw new Error(`La arista referencia un nodo inexistente: "${id}"`);
    }
    return list;
  };

  for (const { from, to } of edges) {
    const fromList = ensureNode(from);
    const toList = ensureNode(to);

    if (!fromList.includes(to)) fromList.push(to);
    if (!directed && !toList.includes(from)) toList.push(from);
  }

  for (const node of nodes) {
    ensureNode(node).sort((a, b) => a.localeCompare(b));
  }

  return {
    nodes: [...nodes],
    edges: [...edges],
    adjacency: adjacency as AdjacencyList,
    directed,
  };
}
