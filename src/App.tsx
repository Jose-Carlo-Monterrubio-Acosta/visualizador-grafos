import { useState } from 'react';
import VisualizadorGrafos from './components/VisualizadorGrafos';
import DfsIterativo from './components/DfsIterativo';

export default function App() {
    const [algoritmoActivo, setAlgoritmoActivo] = useState<'recursivo' | 'iterativo'>('recursivo');

    return (
        <div style={{ backgroundColor: '#0b0f19', minHeight: '100vh', color: 'white', padding: '20px', fontFamily: 'sans-serif' }}>
            <header style={{ marginBottom: '20px', borderBottom: '1px solid #2a3441', paddingBottom: '15px' }}>
                <h1 style={{ margin: '0 0 15px 0', color: '#e6e6e6' }}>Plataforma de Algoritmos</h1>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        onClick={() => setAlgoritmoActivo('recursivo')}
                        style={{ 
                            padding: '10px 15px', 
                            backgroundColor: algoritmoActivo === 'recursivo' ? '#4da6ff' : '#151b29', 
                            color: algoritmoActivo === 'recursivo' ? '#0b0f19' : 'white', 
                            border: '1px solid #4da6ff', 
                            borderRadius: '5px', 
                            cursor: 'pointer',
                            fontWeight: algoritmoActivo === 'recursivo' ? 'bold' : 'normal'
                        }}
                    >
                        Algoritmo 1: DFS Recursivo
                    </button>
                    <button
                        onClick={() => setAlgoritmoActivo('iterativo')}
                        style={{ 
                            padding: '10px 15px', 
                            backgroundColor: algoritmoActivo === 'iterativo' ? '#e06c75' : '#151b29', 
                            color: algoritmoActivo === 'iterativo' ? '#0b0f19' : 'white', 
                            border: '1px solid #e06c75', 
                            borderRadius: '5px', 
                            cursor: 'pointer',
                            fontWeight: algoritmoActivo === 'iterativo' ? 'bold' : 'normal'
                        }}
                    >
                        Algoritmo 7: DFS Iterativo
                    </button>
                </div>
            </header>
            
            <main>
                {algoritmoActivo === 'recursivo' && <VisualizadorGrafos />}
                {algoritmoActivo === 'iterativo' && <DfsIterativo />}
            </main>
        </div>
    );
}
