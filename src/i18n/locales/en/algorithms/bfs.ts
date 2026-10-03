import { plural } from '@/i18n/format';

const edgeKinds = {
    tree: 'Tree (parent)',
    uncle: 'Uncle',
    sibling: 'Sibling',
    cousin: 'Cousin',
};

type ClassifiedKind = 'uncle' | 'sibling' | 'cousin';

export const bfs = {
    name: 'Breadth-first search',
    shortName: 'BFS',
    tagline:
        'Always picks the marked vertex that was reached least recently, using a queue, and assigns each vertex its level.',
    complexity: 'O(n + m)',
    constraints: [
        'Accepts directed and undirected edges',
        'Ignores edge weights',
        'Classifies edges as parent, uncle, sibling and cousin',
    ],
    reference: {
        idea: 'A generic search in which, among all marked vertices incident to some unexplored edge, the one reached least recently is always chosen, a rule implemented with a queue. Each vertex gets an index L[v] (discovery order) and a level[v] (distance from the root in number of edges).',
        pseudocode: [
            'Initialization / Initial call',
            '  t ← 0; Queue ← ∅',
            '  for every vertex v ∈ V(G) do',
            '    L[v] ← 0; level[v] ← 0; parent[v] ← null',
            '  while there is some vertex v such that L[v] = 0 do',
            '    t ← t + 1; L[v] ← t          // v is the search root',
            '    Queue.Insert(v)',
            '    Run Breadth_Search()',
            '',
            'Breadth_Search()',
            '  while not Queue.Empty() do',
            '    v ← Queue.Remove()',
            '    for every vertex w ∈ Γ(v) do',
            '      if L[w] = 0 then           // tree (or parent) edge',
            '        parent[w] ← v; level[w] ← level[v] + 1',
            '        t ← t + 1; L[w] ← t; Queue.Insert(w)',
            '      else if level[w] = level[v] + 1 then',
            '        Visit uncle edge {v, w}',
            '      else if level[w] = level[v] and parent[v] = parent[w] and L[w] > L[v] then',
            '        Visit sibling edge {v, w}',
            '      else if level[w] = level[v] and parent[v] ≠ parent[w] and L[w] > L[v] then',
            '        Visit cousin edge {v, w}',
        ],
        invariant:
            'level[w] = level[parent[w]] + 1 for every w ≠ root. So, as soon as w is marked, level[w] is already the distance (number of edges) between the search root and w.',
        pitfalls: [
            'Marking the vertex (assigning L[w]) only when it leaves the queue, not when it enters: the same vertex would end up queued several times.',
            'Forgetting the condition L[w] > L[v] when classifying sibling and cousin edges: it guarantees that each edge is explored only once.',
            'In a weighted graph, breadth-first search only returns a minimum-weight path if all weights are equal; it minimizes the number of edges, not the weight.',
        ],
    },
    trace: {
        attributesTitle: 'Index, level and parent',
        levelColumn: 'level',
        edgeKinds,
        levelBadge: (level: number) => `level ${level}`,
        initDescription:
            'Every vertex starts unmarked: L[v] = 0, level[v] = 0 and parent[v] = null. The global counter t starts at 0.',
        rootTitle: (vertex: string) => `Search root: ${vertex}`,
        newRootTitle: (vertex: string) => `New root: ${vertex}`,
        rootDescription: (vertex: string, index: number) =>
            `${vertex} is the search root: it gets L = ${index}, level 0 and enters the queue.`,
        newRootDescription: (vertex: string) =>
            `${vertex} still has L = 0 after the previous search, so it starts a new breadth-first tree at level 0.`,
        dequeueTitle: (vertex: string) => `Remove ${vertex} from the queue`,
        dequeueDescription: (vertex: string, level: number) =>
            `${vertex} leaves the queue (level ${level}) and its neighborhood Γ(${vertex}) is examined in alphabetical order.`,
        treeEdgeTitle: (from: string, to: string) => `Tree (parent) edge {${from}, ${to}}`,
        treeEdgeDescription: (from: string, to: string, level: number, index: number) =>
            `${to} had L = 0, so it is visited for the first time: parent[${to}] = ${from}, level = level[${from}] + 1 = ${level} and L = ${index}. The vertex enters the queue.`,
        uncleReason: (from: string, to: string) =>
            `level[${to}] = level[${from}] + 1, but parent[${to}] ≠ ${from}`,
        sameLevelReason: (from: string, to: string, sameParent: boolean) =>
            `level[${to}] = level[${from}] and parent[${from}] ${sameParent ? '=' : '≠'} parent[${to}]`,
        classifiedTitle: (kind: ClassifiedKind) => `${edgeKinds[kind]} edge`,
        classifiedDescription: (from: string, to: string, reason: string, kind: ClassifiedKind) =>
            `${to} was already marked, and ${reason}. So {${from}, ${to}} is ${kind === 'uncle' ? 'an' : 'a'} ${edgeKinds[kind].toLowerCase()} edge and does not belong to the breadth-first tree.`,
        exploredTitle: (vertex: string) => `${vertex} explored`,
        exploredDescription: (vertex: string) =>
            `Every edge incident to ${vertex} has been explored, so the vertex is explored.`,
        completeWithUnreachable: (count: number) =>
            `The queue is empty. ${count} ${plural(count, 'vertex was', 'vertices were')} not reached from the root, so the search produced more than one breadth-first tree.`,
        completeAll: 'The queue is empty and every vertex was reached from the root.',
        visitOrderConclusion: (order: string) => `Visit order: ${order}.`,
        treeConclusion: (count: number) =>
            `The breadth-first tree is made of every vertex and the tree (or parent) edges, ${count} in total. level[v] is the distance, in number of edges, between the search root and v.`,
        unreachableConclusion: (root: string, vertices: string) =>
            `Not reached from ${root}: ${vertices}. Each of them started a new breadth-first tree.`,
        singleTreeConclusion:
            'Every vertex was reached from the root: the search produced a single breadth-first tree.',
    },
};
