import { bellmanFord } from './bellmanFord';
import { bfs } from './bfs';
import { dfs } from './dfs';
import { dijkstra } from './dijkstra';
import { dinic } from './dinic';
import { edmonds } from './edmonds';
import { edmondsKarp } from './edmondsKarp';
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

export const algorithms = {
    bfs,
    dfs,
    kosaraju,
    fleury,
    prim,
    kruskal,
    dijkstra,
    'bellman-ford': bellmanFord,
    'floyd-warshall': floydWarshall,
    'ford-fulkerson': fordFulkerson,
    'edmonds-karp': edmondsKarp,
    dinic,
    kahn,
    'topological-dfs': topologicalDfs,
    edmonds,
    'greedy-coloring': greedyColoring,
    'welsh-powell': welshPowell,
};
