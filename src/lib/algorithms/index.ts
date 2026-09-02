import type { AlgorithmDefinition } from '../graph/types';
import { bellmanFord } from './bellmanFord';
import { breadthFirstSearch } from './breadthFirstSearch';
import { depthFirstSearch } from './depthFirstSearch';
import { dijkstra } from './dijkstra';
import { dinic } from './dinic';
import { edmondsKarp } from './edmondsKarp';
import { edmondsMatching } from './edmondsMatching';
import { fleury } from './fleury';
import { floydWarshall } from './floydWarshall';
import { fordFulkerson } from './fordFulkerson';
import { greedyColoring } from './greedyColoring';
import { kahn } from './kahn';
import { kosaraju } from './kosaraju';
import { kruskal } from './kruskal';
import { prim } from './prim';
import { topologicalDfs } from './topologicalDfs';
import { welshPowell } from './welshPowell';

/** Ordem dos decks da disciplina: 07/08 → 09 → 10 → 12 → 13-15 → 16-17 → 18 → 19 → 21. */
export const algorithms: AlgorithmDefinition[] = [
    depthFirstSearch,
    breadthFirstSearch,
    kosaraju,
    fleury,
    prim,
    kruskal,
    dijkstra,
    bellmanFord,
    floydWarshall,
    fordFulkerson,
    edmondsKarp,
    dinic,
    kahn,
    topologicalDfs,
    edmondsMatching,
    greedyColoring,
    welshPowell,
];

export const algorithmsById = new Map(algorithms.map((algorithm) => [algorithm.id, algorithm]));

export function findAlgorithm(id: string): AlgorithmDefinition | undefined {
    return algorithmsById.get(id);
}
