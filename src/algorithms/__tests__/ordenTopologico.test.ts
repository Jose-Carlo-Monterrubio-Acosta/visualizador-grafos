import { describe, it, expect } from 'vitest';
import { topoGenerador } from '../ordenTopologico';
import type { EstadoTopo } from '../../types/ordenTopologico';

describe('Orden Topológico Generador', () => {
    it('debe generar un orden topológico válido para un DAG', () => {
        const grafo = { 'A': ['B'], 'B': ['C'], 'C': [] };
        const nodos = ['A', 'B', 'C'];
        const gen = topoGenerador(grafo, nodos);
        let ultimoEstado: EstadoTopo | undefined;
        for (const estado of gen) {
            ultimoEstado = estado;
        }
        expect(ultimoEstado?.orden).toEqual(['A', 'B', 'C']);
        expect(ultimoEstado?.terminado).toBe(true);
    });
});
