const edgeKinds = {
    tree: 'Tree',
    back: 'Back',
    forward: 'Forward',
    cross: 'Cross',
};

type ClassifiedKind = 'back' | 'forward' | 'cross';

export const dfs = {
    name: 'Depth-first search',
    shortName: 'DFS',
    tagline:
        'Always picks the marked vertex that was reached most recently, recording a discovery time d and a finish time f.',
    complexity: 'O(n + m)',
    constraints: [
        'Accepts directed and undirected edges',
        'Undirected graph: tree and back edges',
        'Directed graph: tree, back, forward and cross edges',
    ],
    reference: {
        idea: 'A generic search in which, among all marked vertices incident to some unexplored edge, the one reached most recently is always chosen. Each vertex gets a discovery time d[v] and a finish time f[v], stamped by a global counter t.',
        pseudocode: [
            'Initialization / Initial call',
            '  t ← 0',
            '  for every vertex v ∈ V(G) do',
            '    d[v] ← 0; f[v] ← 0; parent[v] ← null',
            '  while there is some vertex v such that d[v] = 0 do',
            '    Run Depth_Search(v)              // v is the search root',
            '',
            'Depth_Search(v)                       // undirected graph',
            '  t ← t + 1; d[v] ← t',
            '  for every vertex w ∈ Γ(v) do',
            '    if d[w] = 0 then                 // tree edge',
            '      parent[w] ← v; Run Depth_Search(w)',
            '    else if f[w] = 0 and w ≠ parent[v] then',
            '      Visit back edge {v, w}',
            '  t ← t + 1; f[v] ← t',
            '',
            'Depth_Search(v)                       // directed graph',
            '  for every vertex w ∈ Γ⁺(v) do',
            '    if d[w] = 0 then  tree edge (v, w); parent[w] ← v; ...',
            '    else if f[w] = 0 then             back edge (v, w)',
            '    else if d[v] < d[w] then          forward edge (v, w)',
            '    else                              cross edge (v, w)',
        ],
        invariant:
            'The lifetime intervals I(v) = [d[v], f[v]] are either nested or disjoint; they never partially overlap. Vertex w is a descendant of v if and only if I(w) is contained in I(v).',
        pitfalls: [
            'In an undirected graph there are only tree and back edges; forward and cross edges appear only in directed graphs.',
            'Forgetting the condition w ≠ parent[v]: the edge used to reach v is not a back edge.',
            'Every back edge reveals a cycle in the original graph. In a directed graph, it is the only evidence needed.',
        ],
    },
    trace: {
        timesTitle: 'Discovery and finish times',
        discoveryColumn: 'd',
        finishColumn: 'f',
        edgeKinds,
        stackTitle: 'Recursion stack',
        initDescription:
            'Every vertex starts unmarked (white): d[v] = 0, f[v] = 0 and parent[v] = null. The global counter t starts at 0.',
        discoverTitle: (vertex: string) => `Discover ${vertex}`,
        discoverDescription: (vertex: string, time: number) =>
            `${vertex} becomes marked (gray) with d = ${time} and is pushed onto the recursion stack.`,
        treeEdgeTitle: (pair: string) => `Tree edge ${pair}`,
        treeEdgeDescription: (from: string, to: string) =>
            `d[${to}] = 0, that is, ${to} is visited for the first time: parent[${to}] = ${from} and the search goes deeper through this edge.`,
        returnTitle: (vertex: string) => `Back to ${vertex}`,
        returnDescription: (vertex: string) =>
            `The recursive call has finished; the search resumes examining the neighbors of ${vertex}.`,
        backReasonDirected: (from: string, to: string) =>
            `f[${to}] = 0, so ${to} is an ancestor of ${from}`,
        forwardReason: (from: string, to: string) =>
            `d[${from}] < d[${to}], so ${to} is a descendant of ${from} without being its child`,
        crossReason: (from: string, to: string) =>
            `${to} is neither a descendant nor an ancestor of ${from}`,
        backReasonUndirected: (from: string, to: string) =>
            `f[${to}] = 0 and ${to} ≠ parent[${from}], so ${to} is an ancestor of ${from} without being its parent`,
        classifiedTitle: (kind: ClassifiedKind) => `${edgeKinds[kind]} edge`,
        classifiedDescription: (reason: string, pair: string, kind: ClassifiedKind) =>
            `${reason}. Therefore ${pair} is classified as a ${edgeKinds[kind].toLowerCase()} edge.`,
        exploredTitle: (vertex: string) => `${vertex} explored`,
        exploredDescription: (vertex: string, discovery: number, finish: number) =>
            `The whole neighborhood of ${vertex} has been examined: the vertex becomes explored (black) with f = ${finish}. Its lifetime interval is I(${vertex}) = [${discovery}, ${finish}].`,
        newRootTitle: (vertex: string) => `New root: ${vertex}`,
        newRootDescription: (vertex: string) =>
            `d[${vertex}] = 0 after the previous search, so ${vertex} becomes the root of a new depth-first tree.`,
        completeDescription: (treeEdges: number) =>
            `Every vertex is explored. The ${treeEdges} tree ${treeEdges === 1 ? 'edge forms' : 'edges form'} the depth-first forest.`,
        visitOrderConclusion: (order: string) => `Visit order: ${order}.`,
        countsConclusion: (treeEdges: number, backEdges: number) =>
            `Tree edges: ${treeEdges}. Back edges: ${backEdges}.`,
        cycleConclusion: 'Back edges always represent a cycle in the original graph.',
        acyclicConclusion: 'There are no back edges, so the graph is acyclic.',
        intervalsConclusion:
            'The lifetime intervals I(v) = [d[v], f[v]] are nested: w is a descendant of v if and only if I(w) is contained in I(v).',
    },
};
