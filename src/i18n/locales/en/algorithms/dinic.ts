import { plural } from '@/i18n/format';

export const dinic = {
    name: "Dinic's algorithm",
    shortName: 'Dinic',
    tagline: 'Each iteration builds the level graph GL from G′(f) and finds a blocking flow in it.',
    complexity: 'O(n² · m)',
    constraints: [
        'Requires a flow network: a directed graph with capacity u(e) > 0',
        'Requires a source s and a sink t',
        'At most n − 1 blocking flows',
    ],
    reference: {
        idea: 'Instead of augmenting one path at a time, it builds the level graph GL from G′(f) and finds a full blocking flow in it. Since the number of levels grows by at least one at each iteration, there are at most n − 1 blocking flows.',
        pseudocode: [
            'Level graph GL: V(GL) = V(G′) and, for (v, w) ∈ E(G′):',
            '  (v, w) ∈ E(GL) with capacity u (e) if dist(w) = dist(v) + 1,',
            '                                r',
            '  where dist(v) is the shortest geodesic distance from s to v',
            '',
            'Blocking flow fb: a flow in GL such that, keeping only the',
            '  edges with capacity greater than fb, there is no longer',
            '  any augmenting path in GL',
            '',
            "Dinic's algorithm",
            '  1. for every edge e ∈ E(G) do  f(e) ← 0',
            '  2. Build the residual network G′(f)',
            '  3. Build the level graph GL from G′(f)',
            '  4. while dist(t) < ∞ do',
            '     a. Find a blocking flow fb in GL',
            '     b. Update the flow f using fb',
            '     c. Update the residual network G′(f)',
            '     d. Build the level graph GL from G′(f)',
        ],
        invariant:
            'dist(t) strictly increases between iterations, so there are at most n − 1 blocking flows. Each blocking flow is found in O(n·m), hence O(n²·m).',
        pitfalls: [
            'Searching for paths outside GL: only edges (v, w) with dist(w) = dist(v) + 1 count.',
            'Rebuilding the level graph after every path instead of after every blocking flow: an iteration is defined by the complete blocking flow.',
            'Stopping as soon as one path saturates: the blocking flow only ends when there is no path left from s to t in GL.',
        ],
    },
    trace: {
        levelsTitle: 'Level graph GL',
        initTitle: 'Initial residual network G′(f)',
        initDescription: (source: string, sink: string) =>
            `f(e) = 0 for every edge, so u_r(e) = u(e). The source is s = ${source} and the sink is t = ${sink}.`,
        endTitle: 'dist(t) = ∞, the loop ends',
        endDescription: (reachable: string) =>
            `The sink is no longer reachable in G′(f), so there is neither an augmenting path nor a blocking flow. The set S = { ${reachable} } defines the minimum s-t cut.`,
        blockingFlowsMetric: 'Blocking flows',
        blockingFlowsConclusion: (count: number, flows: string) =>
            `${count} blocking ${plural(count, 'flow was', 'flows were')} needed: ${flows}.`,
        levelsConclusion:
            'The number of levels grows by at least one with each blocking flow, so there are at most n − 1 iterations.',
        levelGraphTitle: (phase: number, distance: number) =>
            `Level graph ${phase}: dist(t) = ${distance}`,
        levelGraphDescription: (distance: number) =>
            `A breadth-first search in G′(f) sets dist(v) for each vertex. GL contains only the edges (v, w) of G′(f) with dist(w) = dist(v) + 1, highlighted in orange. Every path from s to t in GL has exactly ${distance} ${plural(distance, 'edge', 'edges')}.`,
        pathTitle: (phase: number, path: number, label: string) =>
            `Blocking flow ${phase}, path ${path}: ${label}`,
        pathDescription: (path: string, bottleneck: string) =>
            `GL contains the path ${path}, with bottleneck δ = ${bottleneck}. After the push, at least one of its edges saturates and leaves GL, which moves the blocking flow forward.`,
        blockingFlowMetric: 'Blocking flow',
        phaseDoneTitle: (phase: number, value: string) =>
            `Blocking flow ${phase} found: fb = ${value}`,
        phaseDoneDescription: (paths: number, value: string) =>
            `There is no path from s to t left in GL: the blocking flow is complete, with ${paths} ${plural(paths, 'path', 'paths')} and value ${value}. The flow f is updated, and a new residual network and a new level graph are built.`,
        limitConclusion: (value: string, phases: number) =>
            `Flow value reached: ${value} after ${phases} blocking ${plural(phases, 'flow', 'flows')}.`,
    },
};
