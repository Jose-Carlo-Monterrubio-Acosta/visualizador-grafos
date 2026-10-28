# Visualizador de Grafos — Integrante 2

Aplicación web (React + TypeScript) para visualizar algoritmos de grafos como
**simulaciones matemáticas reales paso a paso** (sin animaciones CSS pregrabadas).
Cada algoritmo está implementado como **función generadora** (`function*`) que hace
`yield` de un snapshot del estado en cada evaluación importante; la UI avanza con
`generador.next()`.

## Avance

| # | Algoritmo | Estado |
|---|-----------|--------|
| 1 | Búsqueda en Profundidad (DFS recursivo) | ✅ Implementado + pruebas |
| 2 | Coloreo Bipartito (BFS, 2 colores) | ⏳ Pendiente |
| 3 | Bellman-Ford | ⏳ Pendiente |
| 7 | Búsqueda en Profundidad (DFS iterativo) | ✅ Implementado |
| 8 | Ordenamiento Topológico (DFS post-orden) | ✅ Implementado |

## Cómo ejecutar

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # pruebas unitarias del generador (Vitest)
npm run build      # typecheck estricto + build de producción
```

## Estructura

```
src/
├── types/
│   ├── graph.ts            # Graph, Edge, AdjacencyList, NodeId
│   └── dfs.ts              # DfsState, DfsActionType, DfsNodeStatus
├── utils/graphBuilder.ts   # Construye lista de adyacencia desde lista de aristas
├── algorithms/
│   ├── dfs.ts              # dfsGenerator (function* + yield* recursivo)
│   └── __tests__/dfs.test.ts
├── data/sampleGraphs.ts    # Grafo de ejemplo + posiciones para el SVG
├── components/
│   ├── VisualizadorGrafos.tsx
│   └── VisualizadorGrafos.css
├── App.tsx
└── main.tsx
```

## DFS: qué emite cada `yield`

| Acción | Cuándo |
|--------|--------|
| `INICIO` | Antes de visitar cualquier nodo |
| `VISITANDO` | Se entra a un nodo (se marca visitado y entra a la pila) |
| `EXPLORANDO` | Se evalúa una arista hacia un vecino NO visitado → se profundiza |
| `YA_VISITADO` | Se evalúa una arista hacia un vecino ya visitado → se omite |
| `RETROCEDIENDO` | Se agotaron los vecinos → backtrack |
| `FIN` | Termina el recorrido |

Cada `DfsState` incluye: `step`, `action`, `currentNode`, `currentEdge`,
`visited[]`, `stack[]` (pila de recursión), `nodeStatus`, `treeEdges[]` y `finishOrder[]`.
Los snapshots son **copias inmutables**, por lo que React detecta el cambio y el
historial no se altera.

La recursión se delega con `yield*`:

```ts
function* dfsVisit(node, ctx, parent) {
  // ...marcar visitado...
  yield snapshot(ctx, 'VISITANDO', `Visitando ${node}`, node);
  for (const vecino of ctx.graph.adjacency[node] ?? []) {
    if (!ctx.visitedSet.has(vecino)) {
      yield* dfsVisit(vecino, ctx, node);   // ← recursión dentro del generador
    }
  }
  yield snapshot(ctx, 'RETROCEDIENDO', `Retrocediendo de ${node}`, node);
}
```

## Integración con React

- El generador vive en `useRef` (persiste entre renders, no provoca re-render).
- El último `yield` vive en `useState`.
- El botón **Siguiente Paso** ejecuta `generador.current.next()` y guarda `value`.
- **Reiniciar** crea un generador nuevo.
