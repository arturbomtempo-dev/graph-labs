import type { AlgorithmDefinition } from '../graph/types';
import { bellmanFord } from './bellmanFord';
import { breadthFirstSearch } from './breadthFirstSearch';
import { depthFirstSearch } from './depthFirstSearch';
import { dijkstra } from './dijkstra';
import { floydWarshall } from './floydWarshall';
import { fordFulkerson } from './fordFulkerson';
import { kosaraju } from './kosaraju';
import { kruskal } from './kruskal';
import { prim } from './prim';

export const algorithms: AlgorithmDefinition[] = [
    breadthFirstSearch,
    depthFirstSearch,
    kosaraju,
    prim,
    kruskal,
    dijkstra,
    bellmanFord,
    floydWarshall,
    fordFulkerson,
];

export const algorithmsById = new Map(algorithms.map((algorithm) => [algorithm.id, algorithm]));

export function findAlgorithm(id: string): AlgorithmDefinition | undefined {
    return algorithmsById.get(id);
}
