import { describe, expect, it } from 'vitest';
import { dfsGenerator } from '../dfs';
import { buildGraph } from '../../utils/graphBuilder';
import { dfsSampleGraph } from '../../data/sampleGraphs';
import type { DfsState } from '../../types/dfs';

/** Consume el generador completo y devuelve todos los estados emitidos. */
function runAll(gen: Generator<DfsState, DfsState, undefined>): DfsState[] {
  const states: DfsState[] = [];
  for (const s of gen) states.push(s);
  return states;
}

describe('DFS recursivo (generador)', () => {
  it('visita los nodos en el orden DFS esperado', () => {
    const states = runAll(dfsGenerator(dfsSampleGraph, 'A'));
    const last = states[states.length - 1];
    expect(last?.actionType).toBe('FIN');
    expect(last?.visited).toEqual(['A', 'B', 'D', 'E', 'F', 'C', 'G']);
  });

  it('emite INICIO primero y retrocede de cada nodo visitado', () => {
    const states = runAll(dfsGenerator(dfsSampleGraph, 'A'));
    expect(states[0]?.actionType).toBe('INICIO');
    const backtracks = states.filter((s) => s.actionType === 'RETROCEDIENDO');
    expect(backtracks.map((s) => s.currentNode)).toEqual(['D', 'C', 'G', 'F', 'E', 'B', 'A']);
  });

  it('con exploreAll visita también nodos desconectados', () => {
    const states = runAll(dfsGenerator(dfsSampleGraph, 'A', { exploreAll: true }));
    expect(states[states.length - 1]?.visited).toContain('H');
  });

  it('los snapshots son inmutables entre pasos', () => {
    const states = runAll(dfsGenerator(dfsSampleGraph, 'A'));
    expect(states[1]?.visited).toEqual(['A']);
  });

  it('lanza error si el nodo inicial no existe', () => {
    const g = buildGraph(['A'], []);
    expect(() => dfsGenerator(g, 'Z').next()).toThrow();
  });
});
