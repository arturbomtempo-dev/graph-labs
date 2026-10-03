import { plural } from '@/i18n/format';

export interface RelaxationValues {
    from: string;
    to: string;
    current: string;
    fromDistance: string;
    weight: string;
    candidate: string;
}

export const trace = {
    columns: {
        vertex: 'Vertex',
        edge: 'Edge',
        type: 'Type',
        status: 'Status',
        component: 'Component',
        vertices: 'Vertices',
        weight: 'Weight',
        decision: 'Decision',
        parent: 'parent',
    },
    initialization: 'Initialization',
    visitOrder: 'Visit order',
    queue: 'Queue',
    edgeClassification: 'Edge classification',
    searchComplete: 'Search complete',
    issues: {
        addVertex: 'Add at least one vertex to the graph.',
        addEdge: 'Add at least one edge to the graph.',
        selectRoot: 'Select the root vertex.',
        directedOnly: (method: string) =>
            `${method} works on directed graphs: convert every edge to directed.`,
        undirectedOnly: (method: string) =>
            `${method} works on undirected graphs: convert every edge to undirected.`,
    },
    shortestPath: {
        tableTitle: 'dist and pred',
        relaxedTitle: (from: string, to: string) => `Tense edge (${from}, ${to}): relaxed`,
        relaxedDescription: (values: RelaxationValues) =>
            `dist[${values.to}] = ${values.current} > dist[${values.from}] + d = ${values.fromDistance} + ${values.weight} = ${values.candidate}. So dist[${values.to}] ← ${values.candidate} and pred[${values.to}] ← ${values.from}.`,
        doneTitle: 'Shortest paths computed',
        finalDistances: (root: string, distances: string) =>
            `Final dist[ ] from ${root}: ${distances}.`,
        pathConclusion: (target: string, path: string, weight: string) =>
            `Shortest path to ${target}, recovered through pred[ ]: ${path} (weight ${weight}).`,
    },
    spanningTree: {
        edgesMetric: 'Edges in E(T)',
        totalWeightMetric: 'Total weight C(T)',
    },
    flow: {
        issues: {
            selectSource: 'Select the source vertex s.',
            selectSink: 'Select the sink vertex t.',
            distinctEndpoints: 'The source s and the sink t must be different vertices.',
            directedOnly: 'A flow network is a directed graph: convert every edge to directed.',
            positiveCapacity: 'In a flow network, every edge has capacity u(e) > 0.',
        },
        residualTable: { title: 'Flow and residual capacities', edge: 'Edge e' },
        flowValue: 'Flow value',
        cutCapacity: 'Capacity of cut(S)',
        maxFlowConclusion: (source: string, sink: string, value: string) =>
            `Maximum flow from s = ${source} to t = ${sink}: ${value}.`,
        cutConclusion: (edges: string, capacity: string) =>
            `Minimum s-t cut: cut(S) = { ${edges} }, with capacity ${capacity}, equal to the maximum flow value, as the max-flow min-cut theorem states.`,
        limitHint: 'The iteration limit was reached: review the network capacities.',
        augmenting: {
            initialTitle: "Initial residual network G'(f)",
            initialDescription: (source: string, sink: string) =>
                `f(e) = 0 for every edge, so the residual capacity of each forward edge is u_r(e) = u(e) − f(e) = u(e). The source is s = ${source}, the sink is t = ${sink}, and every other vertex is an internal node.`,
            noPathTitle: "No augmenting path in G'(f)",
            noPathDescription: (reachable: string) =>
                `In G'(f), only S = { ${reachable} } is reachable from s. This is the set S of the minimum s-t cut, and the edges of cut(S), with one endpoint in S and the other outside it, are highlighted in red.`,
            augmentingPaths: 'Augmenting paths',
            pathTitle: (iteration: number, path: string) => `Augmenting path ${iteration}: ${path}`,
            bottleneckSentence: (value: string) =>
                `The bottleneck is δ = min { u_r(e) | e ∈ P } = ${value}.`,
            bottleneck: 'Bottleneck δ',
            edgesInPath: 'Edges in P',
            augmentedTitle: (value: string) => `Flow augmented by δ = ${value}`,
            augmentedDescription: (value: string, total: string) =>
                `On the forward edges of P, f(v, w) ← f(v, w) + δ; on the backward ones, f(w, v) ← f(w, v) − δ. Each forward edge loses ${value} of residual capacity and its reverse edge gains the same amount, which allows the push to be undone in later iterations. The flow value is now ${total}.`,
            pathsConclusion: (method: string, count: number, paths: string) =>
                `${method} used ${count} augmenting ${plural(count, 'path', 'paths')}: ${paths}.`,
            limitConclusion: (value: string, iterations: number) =>
                `Flow value reached: ${value} after ${iterations} ${plural(iterations, 'iteration', 'iterations')}.`,
        },
    },
    coloring: {
        tableTitle: 'Assigned colors',
        colorColumn: 'color(v)',
        colorsUsed: 'Colors used',
        badge: (color: number) => `color ${color}`,
        colorTitle: (vertex: string, color: number) => `${vertex} gets color ${color}`,
        completeTitle: 'Coloring complete',
        undirectedOnly:
            'Vertex coloring is defined for undirected graphs: convert every edge to undirected.',
        boundConclusion: (maxDegree: number) =>
            `Δ(G) = ${maxDegree}, and χ(G) ≤ Δ(G) + 1 = ${maxDegree + 1} always holds.`,
    },
    topological: {
        undirectedIssue:
            'A topological order cannot be established in an undirected graph: convert every edge to directed.',
        result: 'Topo_Order',
        completeTitle: 'Topological sort complete',
        orderConclusion: (order: string) => `Topological order: ${order}.`,
        cycleConclusion:
            'A graph with a cycle has no topological order, because no precedence relation can be established among the vertices of the cycle.',
    },
};
