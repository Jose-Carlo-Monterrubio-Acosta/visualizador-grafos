import { useState, useRef } from 'react';

// ==========================================
// 1. TIPADOS E INTERFACES
// ==========================================
interface Nodo {
    id: string;
    x: number;
    y: number;
}

interface Arista {
    origen: string;
    destino: string;
}

interface EstadoTopo {
    nodoActual: string | null;
    visitados: Set<string>;
    orden: string[];
    lineaActiva: number;
    terminado: boolean;
}

// ==========================================
// 2. LÓGICA DEL ALGORITMO (GENERADOR - DFS Post-orden)
// ==========================================
function* topoGenerador(grafo: Record<string, string[]>, nodos: string[]): Generator<EstadoTopo> {
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

// ==========================================
// 3. DATOS ESTÁTICOS DEL GRAFO (DAG)
// ==========================================
const nodosGrafo: Nodo[] = [
    { id: 'A', x: 250, y: 50 },
    { id: 'B', x: 150, y: 150 },
    { id: 'C', x: 350, y: 150 },
    { id: 'D', x: 250, y: 250 }
];

const aristasGrafo: Arista[] = [
    { origen: 'A', destino: 'B' },
    { origen: 'A', destino: 'C' },
    { origen: 'B', destino: 'D' },
    { origen: 'C', destino: 'D' }
];

const listaAdyacencia: Record<string, string[]> = {
    'A': ['B', 'C'],
    'B': ['D'],
    'C': ['D'],
    'D': []
};

// ==========================================
// 4. COMPONENTE REACT DE INTEGRACIÓN
// ==========================================
export default function OrdenTopologico() {
    const generadorRef = useRef<Generator<EstadoTopo> | null>(null);
    const [estado, setEstado] = useState<EstadoTopo>({
        nodoActual: null,
        visitados: new Set(),
        orden: [],
        lineaActiva: 0,
        terminado: false
    });

    const iniciarSimulacion = () => {
        generadorRef.current = topoGenerador(listaAdyacencia, nodosGrafo.map(n => n.id));
        const pasoInicial = generadorRef.current.next();
        if (!pasoInicial.done) setEstado(pasoInicial.value);
    };

    const siguientePaso = () => {
        if (!generadorRef.current) return;
        const paso = generadorRef.current.next();
        if (!paso.done) setEstado(paso.value);
    };

    const getColorNodo = (id: string) => {
        if (estado.nodoActual === id) return '#e06c75'; 
        if (estado.orden.includes(id)) return '#28a745'; 
        if (estado.visitados.has(id)) return '#2a3f5f'; 
        return '#151b29'; 
    };

    return (
        <div style={{ backgroundColor: '#0b0f19', color: 'white', padding: '20px', fontFamily: 'sans-serif' }}>
            <header style={{ marginBottom: '20px' }}>
                <h2 style={{ color: '#e06c75' }}>Ordenamiento Topológico (DFS Post-orden)</h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={iniciarSimulacion} style={{ padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Reiniciar Simulador</button>
                    <button onClick={siguientePaso} disabled={estado.terminado || !generadorRef.current} style={{ padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: estado.terminado ? 'not-allowed' : 'pointer', opacity: estado.terminado ? 0.5 : 1 }}>Siguiente Paso</button>
                </div>
            </header>

            <main style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                <section style={{ flex: 1, backgroundColor: '#151b29', borderRadius: '10px', minHeight: '300px', border: '1px solid #2a3441' }}>
                    <svg width="100%" height="100%">
                        <defs>
                            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="28" refY="3.5" orient="auto">
                                <polygon points="0 0, 10 3.5, 0 7" fill="#2a3441" />
                            </marker>
                        </defs>
                        {aristasGrafo.map((arista, index) => {
                            const nO = nodosGrafo.find(n => n.id === arista.origen)!;
                            const nD = nodosGrafo.find(n => n.id === arista.destino)!;
                            return <line key={index} x1={nO.x} y1={nO.y} x2={nD.x} y2={nD.y} stroke="#2a3441" strokeWidth="4" markerEnd="url(#arrowhead)" />;
                        })}
                        {nodosGrafo.map(nodo => (
                            <g key={nodo.id}>
                                <circle cx={nodo.x} cy={nodo.y} r="20" fill={getColorNodo(nodo.id)} stroke="#4da6ff" strokeWidth="2" style={{ transition: 'fill 0.3s ease' }} />
                                <text x={nodo.x} y={nodo.y} fill="white" fontSize="16px" textAnchor="middle" dominantBaseline="central">{nodo.id}</text>
                            </g>
                        ))}
                    </svg>
                </section>

                <section style={{ flex: 1, backgroundColor: '#151b29', padding: '20px', borderRadius: '10px', border: '1px solid #2a3441' }}>
                    <pre style={{ margin: 0, fontFamily: 'monospace', fontSize: '14px', lineHeight: '1.5' }}>
                        <code>
                            {[
                                `def topologico(grafo):`,
                                `    visitados = set()`,
                                `    orden = []`,
                                `    def dfs(u):`,
                                `        visitados.add(u)`,
                                `        for v in grafo[u]:`,
                                `            if v not in visitados:`,
                                `                dfs(v)`,
                                `        orden.insert(0, u)`,
                                `    for nodo in grafo:`,
                                `        if nodo not in visitados:`,
                                `            dfs(nodo)`,
                                `    return orden`
                            ].map((texto, index) => {
                                const numLinea = index + 1;
                                const resaltada = estado.lineaActiva === numLinea;
                                return (
                                    <div key={numLinea} style={{ backgroundColor: resaltada ? 'rgba(77, 166, 255, 0.2)' : 'transparent', borderLeft: resaltada ? '4px solid #4da6ff' : '4px solid transparent', paddingLeft: '8px' }}>
                                        {texto}
                                    </div>
                                );
                            })}
                        </code>
                    </pre>
                </section>
            </main>

            <footer style={{ backgroundColor: '#151b29', padding: '20px', borderRadius: '10px', border: '1px solid #2a3441' }}>
                <h3 style={{ marginTop: 0, color: '#4da6ff' }}>Estructura de Datos: Orden Topológico</h3>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', minHeight: '60px' }}>
                    {estado.orden.map((nodo, index) => (
                        <div key={`${nodo}-${index}`} style={{ backgroundColor: '#28a745', color: '#151b29', padding: '10px 25px', borderRadius: '5px', fontWeight: 'bold' }}>
                            {nodo}
                        </div>
                    ))}
                    {estado.orden.length === 0 && <div style={{ color: '#5c6370' }}>Arreglo vacío</div>}
                </div>
            </footer>
        </div>
    );
}
