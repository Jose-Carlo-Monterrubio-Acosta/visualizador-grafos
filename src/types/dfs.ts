import type { Edge, NodeId } from './graph';

/**
 * Tipos de acción que emite el DFS en cada `yield`.
 *
 *  - INICIO        → estado inicial, antes de visitar cualquier nodo.
 *  - VISITANDO     → se entra a un nodo por primera vez (se marca como visitado).
 *  - EXPLORANDO    → se evalúa la arista (actual → vecino) y el vecino NO está visitado.
 *  - YA_VISITADO   → se evalúa la arista (actual → vecino) pero el vecino ya fue visitado.
 *  - RETROCEDIENDO → se terminaron los vecinos del nodo; se hace backtrack.
 *  - FIN           → el recorrido terminó.
 */
export type DfsActionType =
  | 'INICIO'
  | 'VISITANDO'
  | 'EXPLORANDO'
  | 'YA_VISITADO'
  | 'RETROCEDIENDO'
  | 'FIN';

/** Estado del nodo para pintarlo en la UI. */
export type DfsNodeStatus =
  | 'no-visitado' // gris
  | 'en-pila' // amarillo: está en la pila de recursión (se está explorando)
  | 'terminado'; // verde: ya se exploraron todos sus vecinos

/** Snapshot inmutable que el generador emite en cada paso. */
export interface DfsState {
  /** Número de paso (0, 1, 2, ...). */
  readonly step: number;
  /** Tipo de acción realizada en este paso. */
  readonly actionType: DfsActionType;
  /** Descripción legible (ej. "Visitando A", "Retrocediendo de B"). */
  readonly action: string;
  /** Nodo que se está evaluando en este paso (null en INICIO/FIN). */
  readonly currentNode: NodeId | null;
  /** Arista que se está evaluando (null si no aplica). */
  readonly currentEdge: Edge | null;
  /** Nodos visitados, en orden de descubrimiento. */
  readonly visited: readonly NodeId[];
  /** Pila de recursión actual (de la raíz al nodo actual). */
  readonly stack: readonly NodeId[];
  /** Estado de cada nodo para colorearlo. */
  readonly nodeStatus: Readonly<Record<NodeId, DfsNodeStatus>>;
  /** Aristas del árbol DFS (las que llevaron a descubrir un nodo nuevo). */
  readonly treeEdges: readonly Edge[];
  /** Orden en que los nodos terminaron (post-orden). */
  readonly finishOrder: readonly NodeId[];
}
