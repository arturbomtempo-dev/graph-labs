import { plural } from '@/i18n/format';

export const bellmanFord = {
    name: 'Bellman-Ford algorithm',
    shortName: 'Bellman-Ford',
    tagline:
        'Dynamic programming: examines every edge in each iteration, relaxing the tense ones, for |V(G)| − 1 iterations.',
    complexity: 'O(n · m)',
    constraints: [
        'Allows negative-weight edges',
        'Does not allow negative-weight cycles',
        'Detects a negative-weight cycle reachable from the source',
    ],
    reference: {
        idea: 'Computes shortest paths through dynamic programming. Instead of "closing" one vertex per iteration, as Dijkstra does, it examines every edge in each iteration. Since any path in a graph with n vertices has at most n − 1 edges, n − 1 iterations are enough.',
        pseudocode: [
            'Relaxation step',
            '  if dist[v] + d    < dist[w] then    // is edge (v, w) tense?',
            '                vw',
            '    dist[w] ← dist[v] + d',
            '                         vw',
            '    pred[w] ← v',
            '',
            'Bellman-Ford algorithm',
            '  1. for every vertex v ∈ V(G) do',
            '       dist[v] ← ∞; pred[v] ← null',
            '  2. dist[s] ← 0',
            '  3. for i = 1, . . ., | V(G) | − 1 do',
            '       for each (v, w) ∈ E(G) do',
            '         if dist[w] > dist[v] + d    then    // tense edge?',
            '                                 vw',
            '           dist[w] ← dist[v] + d',
            '                                vw',
            '           pred[w] ← v',
            '',
            '  If some edge is still tense after the last iteration,',
            '  then the graph has a negative-weight cycle.',
        ],
        invariant:
            'After the i-th iteration, dist[w] is at most the weight of the shortest path from s to w that uses up to i edges.',
        pitfalls: [
            'If no edge is tense in some iteration, the algorithm can stop: the following iterations would bring no updates.',
            'If there is a negative-weight cycle between s and t, no shortest path exists between them; without such a cycle, the shortest path is simple (it does not repeat vertices).',
            'An undirected edge with negative weight is, by itself, a negative-weight cycle.',
        ],
    },
    trace: {
        arcsTitle: 'Edge list (fixed examination order)',
        initDescription: (source: string) =>
            `dist[${source}] = 0 at the source, dist[v] = ∞ and pred[v] = null for every other vertex. Each undirected edge is examined in both directions.`,
        iterationTitle: (round: number, rounds: number) => `Iteration ${round} of ${rounds}`,
        iterationDescription: (arcs: number, rounds: number) =>
            `In this iteration all ${arcs} edges are examined, always in the same order, and the tense ones are relaxed. Since any path has at most n − 1 edges, ${rounds} ${plural(rounds, 'iteration is', 'iterations are')} enough.`,
        iterationMetric: 'Iteration',
        noTenseTitle: (round: number) => `Iteration ${round} with no tense edges`,
        noTenseDescription:
            'No edge was tense in this iteration, so there will be no updates in the next ones and the algorithm can stop.',
        checkTitle: 'Negative-weight cycle check',
        checkDescription:
            'One extra iteration is run: if some edge is still tense, some path would have n or more edges, which is only possible when there is a negative-weight cycle reachable from the source.',
        negativeCycleTitle: (from: string, to: string) =>
            `Negative-weight cycle detected at (${from}, ${to})`,
        negativeCycleDescription: (fromDistance: string, weight: string, current: string) =>
            `The edge is still tense (${fromDistance} + ${weight} < ${current}), which is only possible if there is a negative-weight cycle reachable from the source.`,
        invalidTitle: 'Result invalid due to a negative-weight cycle',
        invalidDescription: (edges: number, rounds: number) =>
            `${edges} ${plural(edges, 'edge is', 'edges are')} still tense after ${rounds} ${plural(rounds, 'iteration', 'iterations')}.`,
        negativeCycleConclusion:
            'There is a negative-weight cycle reachable from the source: the affected vertices have no shortest path, because the weight can always be lowered by going around the cycle once more.',
        lastRoundConclusion: (last: number, rounds: number) =>
            `The last iteration with a tense edge was number ${last}, out of ${rounds}. Without a negative-weight cycle, every shortest path is simple (it does not repeat vertices).`,
        doneDescription:
            'No edge is tense, so the optimal value was reached and there is no reachable negative-weight cycle.',
    },
};
