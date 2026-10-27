import { buildGraph } from '../utils/graphBuilder';
import type { Graph } from '../types/graph';

/**
 * Grafo de ejemplo NO dirigido para el DFS.
 *
 *        A
 *       / \
 *      B   C
 *     / \   \
 *    D   E---F
 *            |
 *            G
 *
 * Además incluye un nodo aislado "H" para probar `exploreAll`.
 */
export const dfsSampleGraph: Graph = buildGraph(
  ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
  [
    { from: 'A', to: 'B' },
    { from: 'A', to: 'C' },
    { from: 'B', to: 'D' },
    { from: 'B', to: 'E' },
    { from: 'C', to: 'F' },
    { from: 'E', to: 'F' },
    { from: 'F', to: 'G' },
  ],
  false,
);

/** Posiciones fijas (en px) para dibujar el grafo de ejemplo en el SVG. */
export const dfsSampleLayout: Readonly<Record<string, { x: number; y: number }>> = {
  A: { x: 220, y: 40 },
  B: { x: 130, y: 120 },
  C: { x: 310, y: 120 },
  D: { x: 70, y: 210 },
  E: { x: 190, y: 210 },
  F: { x: 330, y: 210 },
  G: { x: 330, y: 290 },
  H: { x: 70, y: 290 },
};
