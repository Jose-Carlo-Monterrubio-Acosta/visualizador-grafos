import { useState, useRef } from 'react';
import type { NodoFW, AristaFW, EstadoFW } from '../types/floydWarshall';
import { fwGenerador, INF } from '../algorithms/floydWarshall';

// ==========================================
// DATOS ESTÁTICOS DEL GRAFO
// ==========================================
const nodosGrafo: NodoFW[] = [
    { id: 0, etiqueta: 'A', x: 250, y: 50 },
    { id: 1, etiqueta: 'B', x: 100, y: 150 },
    { id: 2, etiqueta: 'C', x: 400, y: 150 },
    { id: 3, etiqueta: 'D', x: 250, y: 250 }
];

const aristasGrafo: AristaFW[] = [
    { origen: 0, destino: 1, peso: 3 },
    { origen: 0, destino: 2, peso: 8 },
    { origen: 1, destino: 2, peso: 2 },
    { origen: 1, destino: 3, peso: 5 },
    { origen: 2, destino: 3, peso: 1 }
];

// ==========================================
// COMPONENTE REACT DE INTEGRACIÓN
// ==========================================
export default function FloydWarshall() {
    const generadorRef = useRef<Generator<EstadoFW> | null>(null);
    const [estado, setEstado] = useState<EstadoFW>({
        distancias: [],
        k: null, i: null, j: null,
        lineaActiva: 0, terminado: false
    });

    const iniciarSimulacion = () => {
        generadorRef.current = fwGenerador(nodosGrafo.length, aristasGrafo);
        const pasoInicial = generadorRef.current.next();
        if (!pasoInicial.done) setEstado(pasoInicial.value);
    };

    const siguientePaso = () => {
        if (!generadorRef.current) return;
        const paso = generadorRef.current.next();
        if (!paso.done) setEstado(paso.value);
    };

    const getColorNodo = (id: number) => {
        if (estado.k === id) return '#e5c07b'; // Pivote (Amarillo)
        if (estado.i === id) return '#61afef'; // Origen (Azul)
        if (estado.j === id) return '#98c379'; // Destino (Verde)
        return '#151b29';
    };

    const getCeldaEstilo = (filaI: number, colJ: number) => {
        const esPivotK = filaI === estado.k || colJ === estado.k;
        const esCeldaActiva = filaI === estado.i && colJ === estado.j;
        return {
            padding: '10px',
            textAlign: 'center' as const,
            border: '1px solid #2a3441',
            backgroundColor: esCeldaActiva ? '#e06c75' : esPivotK ? 'rgba(229, 192, 123, 0.2)' : '#151b29',
            color: esCeldaActiva ? '#151b29' : 'white',
            fontWeight: esCeldaActiva ? 'bold' : 'normal',
            transition: 'background-color 0.3s ease'
        };
    };

    return (
        <div style={{ backgroundColor: '#0b0f19', color: 'white', padding: '20px', fontFamily: 'sans-serif' }}>
            <header style={{ marginBottom: '20px' }}>
                <h2 style={{ color: '#e06c75' }}>Floyd-Warshall (APSP)</h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={iniciarSimulacion} style={{ padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Reiniciar Simulador</button>
                    <button onClick={siguientePaso} disabled={estado.terminado || !generadorRef.current} style={{ padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: estado.terminado ? 'not-allowed' : 'pointer', opacity: estado.terminado ? 0.5 : 1 }}>Siguiente Paso</button>
                </div>
            </header>

            <main style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                <section style={{ flex: 1, backgroundColor: '#151b29', borderRadius: '10px', minHeight: '300px', border: '1px solid #2a3441' }}>
                    <svg width="100%" height="100%">
                        <defs>
                            <marker id="fw-arrow" markerWidth="10" markerHeight="7" refX="28" refY="3.5" orient="auto">
                                <polygon points="0 0, 10 3.5, 0 7" fill="#2a3441" />
                            </marker>
                        </defs>
                        {aristasGrafo.map((arista, idx) => {
                            const nO = nodosGrafo.find(n => n.id === arista.origen)!;
                            const nD = nodosGrafo.find(n => n.id === arista.destino)!;
                            const midX = (nO.x + nD.x) / 2;
                            const midY = (nO.y + nD.y) / 2;
                            return (
                                <g key={`arista-${idx}`}>
                                    <line x1={nO.x} y1={nO.y} x2={nD.x} y2={nD.y} stroke="#2a3441" strokeWidth="4" markerEnd="url(#fw-arrow)" />
                                    <rect x={midX - 12} y={midY - 12} width="24" height="24" fill="#0b0f19" rx="4" />
                                    <text x={midX} y={midY} fill="#e5c07b" fontSize="14px" textAnchor="middle" dominantBaseline="central" fontWeight="bold">{arista.peso}</text>
                                </g>
                            );
                        })}
                        {nodosGrafo.map(nodo => (
                            <g key={nodo.id}>
                                <circle cx={nodo.x} cy={nodo.y} r="20" fill={getColorNodo(nodo.id)} stroke="#4da6ff" strokeWidth="2" style={{ transition: 'fill 0.3s ease' }} />
                                <text x={nodo.x} y={nodo.y} fill="white" fontSize="16px" textAnchor="middle" dominantBaseline="central">{nodo.etiqueta}</text>
                            </g>
                        ))}
                    </svg>
                </section>

                <section style={{ flex: 1, backgroundColor: '#151b29', padding: '20px', borderRadius: '10px', border: '1px solid #2a3441' }}>
                    <pre style={{ margin: 0, fontFamily: 'monospace', fontSize: '14px', lineHeight: '1.5' }}>
                        <code>
                            {[
                                `def floyd_warshall(grafo, V):`,
                                `    dist = inicializar_matriz(grafo)`,
                                `    for k in range(V):`,
                                `        for i in range(V):`,
                                `            for j in range(V):`,
                                `                if dist[i][k] != INF and dist[k][j] != INF:`,
                                `                    if dist[i][k] + dist[k][j] < dist[i][j]:`,
                                `                        dist[i][j] = dist[i][k] + dist[k][j]`
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

            {estado.distancias.length > 0 && (
                <footer style={{ backgroundColor: '#151b29', padding: '20px', borderRadius: '10px', border: '1px solid #2a3441' }}>
                    <h3 style={{ marginTop: 0, color: '#4da6ff' }}>Estructura de Datos: Matriz de Distancias (D)</h3>
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                        <table style={{ borderCollapse: 'collapse', color: 'white' }}>
                            <thead>
                                <tr>
                                    <th style={{ padding: '10px' }}></th>
                                    {nodosGrafo.map(n => <th key={`th-${n.id}`} style={{ padding: '10px', borderBottom: '2px solid #4da6ff' }}>{n.etiqueta}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                {estado.distancias.map((fila, i) => (
                                    <tr key={`fila-${i}`}>
                                        <th style={{ padding: '10px', borderRight: '2px solid #4da6ff' }}>{nodosGrafo[i]?.etiqueta}</th>
                                        {fila.map((valor, j) => (
                                            <td key={`celda-${i}-${j}`} style={getCeldaEstilo(i, j)}>
                                                {valor === INF ? '∞' : valor}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontFamily: 'monospace' }}>
                            <div><span style={{ color: '#e5c07b', fontWeight: 'bold' }}>■</span> k (Pivote): {estado.k !== null ? nodosGrafo[estado.k]?.etiqueta : '-'}</div>
                            <div><span style={{ color: '#61afef', fontWeight: 'bold' }}>■</span> i (Origen): {estado.i !== null ? nodosGrafo[estado.i]?.etiqueta : '-'}</div>
                            <div><span style={{ color: '#98c379', fontWeight: 'bold' }}>■</span> j (Destino): {estado.j !== null ? nodosGrafo[estado.j]?.etiqueta : '-'}</div>
                        </div>
                    </div>
                </footer>
            )}
        </div>
    );
}
