import type { Edge, Graph, NodeId } from '../types/graph';
import type { DfsActionType, DfsNodeStatus, DfsState } from '../types/dfs';

/**
 * ============================================================================
 *  ALGORITMO 1: BÚSQUEDA EN PROFUNDIDAD (DFS) — VERSIÓN RECURSIVA
 * ============================================================================
 *
 * Simulación paso a paso usando funciones generadoras:
 *  - `dfsGenerator` es el punto de entrada (generador "público").
 *  - `dfsVisit` es el generador recursivo; cada llamada recursiva se delega
 *    con `yield*` para que los estados del nivel inferior "suban" hasta
 *    quien consume el generador (el componente de React).
 *
 * Complejidad: O(V + E) — cada nodo se visita una vez y cada arista
 * se evalúa una vez (dos en grafos no dirigidos).
 *
 * Opciones:
 *  - `exploreAll`: si es `true`, al terminar el componente del nodo inicial
 *    continúa con los nodos no visitados (útil para grafos desconectados).
 */

/** Estado interno mutable compartido entre las llamadas recursivas. */
interface DfsContext {
  readonly graph: Graph;
  readonly visited: NodeId[];
  readonly visitedSet: Set<NodeId>;
  readonly stack: NodeId[];
  readonly nodeStatus: Record<NodeId, DfsNodeStatus>;
  readonly treeEdges: Edge[];
  readonly finishOrder: NodeId[];
  step: number;
}

export interface DfsOptions {
  /** Recorrer también los componentes no alcanzables desde `startNode`. */
  readonly exploreAll?: boolean;
}

/**
 * Crea una "fotografía" inmutable del contexto.
 * IMPORTANTE: se copian los arreglos/objetos para que React detecte
 * el cambio y para que estados anteriores no se modifiquen después.
 */
function snapshot(
  ctx: DfsContext,
  actionType: DfsActionType,
  action: string,
  currentNode: NodeId | null,
  currentEdge: Edge | null = null,
): DfsState {
  return {
    step: ctx.step++,
    actionType,
    action,
    currentNode,
    currentEdge,
    visited: [...ctx.visited],
    stack: [...ctx.stack],
    nodeStatus: { ...ctx.nodeStatus },
    treeEdges: [...ctx.treeEdges],
    finishOrder: [...ctx.finishOrder],
  };
}

/**
 * Generador recursivo: visita `node` y explora en profundidad a sus vecinos.
 *
 * @param node   Nodo a visitar.
 * @param ctx    Contexto compartido del recorrido.
 * @param parent Nodo desde el que llegamos (null si es raíz).
 */
function* dfsVisit(
  node: NodeId,
  ctx: DfsContext,
  parent: NodeId | null,
): Generator<DfsState, void, undefined> {
  // 1) Marcar como visitado y meterlo a la pila de recursión.
  ctx.visitedSet.add(node);
  ctx.visited.push(node);
  ctx.stack.push(node);
  ctx.nodeStatus[node] = 'en-pila';

  if (parent !== null) {
    ctx.treeEdges.push({ from: parent, to: node });
  }

  yield snapshot(
    ctx,
    'VISITANDO',
    parent === null ? `Visitando ${node} (raíz)` : `Visitando ${node} (desde ${parent})`,
    node,
    parent === null ? null : { from: parent, to: node },
  );

  // 2) Evaluar cada vecino en orden.
  const neighbors = ctx.graph.adjacency[node] ?? [];
  for (const neighbor of neighbors) {
    const edge: Edge = { from: node, to: neighbor };

    if (!ctx.visitedSet.has(neighbor)) {
      yield snapshot(
        ctx,
        'EXPLORANDO',
        `Evaluando arista ${node} → ${neighbor}: no visitado, se profundiza`,
        node,
        edge,
      );

      // 3) Llamada recursiva delegada con yield*.
      yield* dfsVisit(neighbor, ctx, node);
    } else {
      yield snapshot(
        ctx,
        'YA_VISITADO',
        `Evaluando arista ${node} → ${neighbor}: ${neighbor} ya fue visitado, se omite`,
        node,
        edge,
      );
    }
  }

  // 4) Backtrack: todos los vecinos explorados.
  ctx.stack.pop();
  ctx.nodeStatus[node] = 'terminado';
  ctx.finishOrder.push(node);

  const back = ctx.stack[ctx.stack.length - 1];
  yield snapshot(
    ctx,
    'RETROCEDIENDO',
    back === undefined
      ? `Retrocediendo de ${node} (fin de la rama raíz)`
      : `Retrocediendo de ${node} hacia ${back}`,
    node,
    back === undefined ? null : { from: node, to: back },
  );
}

/**
 * Punto de entrada del DFS.
 *
 * Uso:
 * ```ts
 * const gen = dfsGenerator(grafo, 'A');
 * let r = gen.next();
 * while (!r.done) { console.log(r.value.action); r = gen.next(); }
 * ```
 *
 * @returns Generador que emite un `DfsState` por paso y retorna el estado final.
 * @throws Error si `startNode` no existe en el grafo.
 */
export function* dfsGenerator(
  graph: Graph,
  startNode: NodeId,
  options: DfsOptions = {},
): Generator<DfsState, DfsState, undefined> {
  if (!graph.nodes.includes(startNode)) {
    throw new Error(`El nodo inicial "${startNode}" no existe en el grafo`);
  }

  const nodeStatus: Record<NodeId, DfsNodeStatus> = {};
  for (const n of graph.nodes) nodeStatus[n] = 'no-visitado';

  const ctx: DfsContext = {
    graph,
    visited: [],
    visitedSet: new Set<NodeId>(),
    stack: [],
    nodeStatus,
    treeEdges: [],
    finishOrder: [],
    step: 0,
  };

  yield snapshot(ctx, 'INICIO', `Inicio del DFS desde ${startNode}`, null);

  // Componente del nodo inicial.
  yield* dfsVisit(startNode, ctx, null);

  // Componentes restantes (grafos desconectados).
  if (options.exploreAll === true) {
    for (const node of graph.nodes) {
      if (!ctx.visitedSet.has(node)) {
        yield* dfsVisit(node, ctx, null);
      }
    }
  }

  const final = snapshot(
    ctx,
    'FIN',
    `DFS terminado. Orden de visita: ${ctx.visited.join(' → ')}`,
    null,
  );
  yield final;
  return final;
}
