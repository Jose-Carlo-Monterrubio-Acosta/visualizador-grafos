import { describe, it, expect } from 'vitest';
import { fwGenerador } from '../floydWarshall';
import type { EstadoFW } from '../../types/floydWarshall';

const INF = 999;

describe('Floyd-Warshall Generador', () => {
    it('debe calcular las distancias mínimas correctamente', () => {
        const aristas = [{ origen: 0, destino: 1, peso: 5 }];
        const gen = fwGenerador(2, aristas);
        let ultimoEstado: EstadoFW | undefined;
        for (const estado of gen) {
            ultimoEstado = estado;
        }
        expect(ultimoEstado?.distancias[0]?.[1]).toBe(5);
        expect(ultimoEstado?.distancias[0]?.[0]).toBe(0);
        expect(ultimoEstado?.distancias[1]?.[0]).toBe(INF);
        expect(ultimoEstado?.terminado).toBe(true);
    });
});
