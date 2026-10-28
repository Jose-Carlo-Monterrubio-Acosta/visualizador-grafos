import { useState } from 'react';
import VisualizadorGrafos from './components/VisualizadorGrafos';
import DfsIterativo from './components/DfsIterativo';
import OrdenTopologico from './components/OrdenTopologico';

export default function App() {
    const [algoritmoActivo, setAlgoritmoActivo] = useState<'recursivo' | 'iterativo' | 'topologico'>('recursivo');

    const getBtnStyle = (id: string, colorH: string) => ({
        padding: '10px 15px',
        backgroundColor: algoritmoActivo === id ? colorH : '#151b29',
        color: algoritmoActivo === id ? '#0b0f19' : 'white',
        border: `1px solid ${colorH}`,
        borderRadius: '5px',
        cursor: 'pointer',
        fontWeight: algoritmoActivo === id ? 'bold' : 'normal'
    });

    return (
        <div style={{ backgroundColor: '#0b0f19', minHeight: '100vh', color: 'white', padding: '20px', fontFamily: 'sans-serif' }}>
            <header style={{ marginBottom: '20px', borderBottom: '1px solid #2a3441', paddingBottom: '15px' }}>
                <h1 style={{ margin: '0 0 15px 0', color: '#e6e6e6' }}>Plataforma de Algoritmos</h1>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <button onClick={() => setAlgoritmoActivo('recursivo')} style={getBtnStyle('recursivo', '#4da6ff')}>Algoritmo 1: DFS Recursivo</button>
                    <button onClick={() => setAlgoritmoActivo('iterativo')} style={getBtnStyle('iterativo', '#e06c75')}>Algoritmo 7: DFS Iterativo</button>
                    <button onClick={() => setAlgoritmoActivo('topologico')} style={getBtnStyle('topologico', '#28a745')}>Algoritmo 8: Orden Topológico</button>
                </div>
            </header>
            
            <main>
                {algoritmoActivo === 'recursivo' && <VisualizadorGrafos />}
                {algoritmoActivo === 'iterativo' && <DfsIterativo />}
                {algoritmoActivo === 'topologico' && <OrdenTopologico />}
            </main>
        </div>
    );
}
