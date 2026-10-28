import { useState, useRef } from 'react';
import type { NodoDFS, AristaDFS, EstadoDFS } from '../types/dfsIterativo';
import { dfsGenerador } from '../algorithms/dfsIterativo';

// ==========================================
// DATOS ESTÁTICOS DEL GRAFO
// ==========================================
const nodosGrafo: NodoDFS[] = [
    { id: 'A', x: 250, y: 50 },
    { id: 'B', x: 150, y: 150 },
    { id: 'C', x: 350, y: 150 },
    { id: 'D', x: 100, y: 250 },
    { id: 'E', x: 200, y: 250 }
];

const aristasGrafo: AristaDFS[] = [
    { origen: 'A', destino: 'B' },
    { origen: 'A', destino: 'C' },
    { origen: 'B', destino: 'D' },
    { origen: 'B', destino: 'E' }
];

const listaAdyacencia: Record<string, string[]> = {
    'A': ['B', 'C'],
    'B': ['D', 'E'],
    'C': [],
    'D': [],
    'E': []
};

// ==========================================
// COMPONENTE REACT DE INTEGRACIÓN
// ==========================================
export default function DfsIterativo() {
    const generadorRef = useRef<Generator<EstadoDFS> | null>(null);
    const [estadoSimulacion, setEstadoSimulacion] = useState<EstadoDFS>({
        nodoActual: null,
        visitados: new Set(),
        pila: [],
        lineaActiva: 0,
        terminado: false
    });

    const iniciarSimulacion = () => {
        generadorRef.current = dfsGenerador(listaAdyacencia, 'A');
        const pasoInicial = generadorRef.current.next();
        if (!pasoInicial.done) setEstadoSimulacion(pasoInicial.value);
    };

    const siguientePaso = () => {
        if (!generadorRef.current) return;
        const paso = generadorRef.current.next();
        if (!paso.done) setEstadoSimulacion(paso.value);
    };

    const getColorNodo = (id: string) => {
        if (estadoSimulacion.nodoActual === id) return '#e06c75';
        if (estadoSimulacion.visitados.has(id)) return '#2a3f5f';
        if (estadoSimulacion.pila.includes(id)) return '#d19a66';
        return '#151b29';
    };

    return (
        <div style={{ backgroundColor: '#0b0f19', color: 'white', padding: '20px', fontFamily: 'sans-serif' }}>
            <header style={{ marginBottom: '20px' }}>
                <h2 style={{ color: '#e06c75' }}>DFS Iterativo (Simulador por Pasos)</h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={iniciarSimulacion} style={{ padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Reiniciar Simulador</button>
                    <button onClick={siguientePaso} disabled={estadoSimulacion.terminado || !generadorRef.current} style={{ padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: estadoSimulacion.terminado ? 'not-allowed' : 'pointer', opacity: estadoSimulacion.terminado ? 0.5 : 1 }}>Siguiente Paso</button>
                </div>
            </header>

            <main style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                <section style={{ flex: 1, backgroundColor: '#151b29', borderRadius: '10px', minHeight: '300px', border: '1px solid #2a3441' }}>
                    <svg width="100%" height="100%">
                        {aristasGrafo.map((arista, index) => {
                            const nO = nodosGrafo.find(n => n.id === arista.origen)!;
                            const nD = nodosGrafo.find(n => n.id === arista.destino)!;
                            return <line key={index} x1={nO.x} y1={nO.y} x2={nD.x} y2={nD.y} stroke="#2a3441" strokeWidth="4" />;
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
                                `def dfs_iterativo(grafo, inicio):`,
                                `    visitados = set()`,
                                `    pila = [inicio]`,
                                `    while pila:`,
                                `        u = pila.pop()`,
                                `        if u not in visitados:`,
                                `            visitados.add(u)`,
                                `            visit(u)`,
                                `            for v in reversed(grafo[u]):`,
                                `                pila.append(v)`
                            ].map((texto, index) => {
                                const numLinea = index + 1;
                                const resaltada = estadoSimulacion.lineaActiva === numLinea;
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
                <h3 style={{ marginTop: 0, color: '#4da6ff' }}>Estructura de Datos: Pila (LIFO)</h3>
                <div style={{ display: 'flex', gap: '5px', flexDirection: 'column-reverse', alignItems: 'center', minHeight: '100px', justifyContent: 'flex-start' }}>
                    {estadoSimulacion.pila.map((nodo, index) => (
                        <div key={`${nodo}-${index}`} style={{ backgroundColor: '#d19a66', color: '#151b29', padding: '8px 20px', borderRadius: '5px', fontWeight: 'bold', width: '40px', textAlign: 'center' }}>
                            {nodo}
                        </div>
                    ))}
                    {estadoSimulacion.pila.length === 0 && <div style={{ color: '#5c6370' }}>Pila vacía</div>}
                </div>
            </footer>
        </div>
    );
}
