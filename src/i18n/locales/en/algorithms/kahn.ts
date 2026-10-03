import { plural } from '@/i18n/format';

export const kahn = {
    name: "Kahn's algorithm",
    shortName: 'Kahn',
    tagline:
        'At each step takes a vertex with in-degree zero, appends it to the result and lowers the in-degree of its successors.',
    complexity: 'O(n + m)',
    constraints: [
        'Requires a directed graph',
        'A topological order only exists in an acyclic graph',
        'Detects the presence of a cycle',
    ],
    reference: {
        idea: 'At each step it finds a vertex with no incoming edges, that is, with d⁻(v) = 0, and appends it to the end of the result. Instead of removing edges, it keeps and updates a map M with the in-degree of each vertex.',
        pseudocode: [
            "Kahn's algorithm",
            '  1. for every vertex v do M[v] ← d⁻(v)',
            '  2. Queue ← ∅; Topo_Order ← ∅',
            '  3. for every vertex v such that d⁻(v) = 0 do',
            '       Queue.Insert(v)',
            '  4. while not Queue.Empty() do',
            '     a. v ← Queue.Remove()',
            '     b. Topo_Order.InsertAtEnd(v)',
            '     c. for every vertex w ∈ Γ⁺(v) do',
            '        i.  M[w] ← M[w] − 1',
            '        ii. if M[w] = 0 then Queue.Insert(w)',
            '  5. If every vertex was processed, SUCCESS;',
            '     otherwise, there is a CYCLE',
        ],
        invariant:
            'A vertex only enters the queue once all of its predecessors are already in Topo_Order, so ord(v) < ord(w) for every edge (v, w) ∈ E(G).',
        pitfalls: [
            'Applying it to an undirected graph or to a graph with a cycle: no precedence relation can be established, and no topological order exists.',
            'Treating an empty queue with pending vertices as an error: that is exactly how the algorithm detects a cycle.',
            'Assuming the order is unique: a directed acyclic graph can have several valid topological orders.',
        ],
    },
    trace: {
        degreesTitle: 'In-degree map M',
        positionStatus: (position: number) => `position ${position}`,
        queuedStatus: 'queued',
        waitingStatus: 'waiting',
        initDescription:
            'M[v] receives the in-degree d⁻(v) of each vertex. The queue and the result Topo_Order start empty.',
        sourcesTitle: 'Vertices with no incoming edges',
        sourcesDescription: (vertices: string) =>
            `The vertices with d⁻(v) = 0 enter the queue: ${vertices}. They do not depend on any other vertex.`,
        noSourcesDescription:
            'No vertex has d⁻(v) = 0. Since every directed acyclic graph has at least one vertex with no incoming edges, the graph contains a cycle.',
        insertTitle: (vertex: string, position: number) =>
            `${vertex} enters Topo_Order at position ${position}`,
        insertDescription: (vertex: string, position: number) =>
            `${vertex} leaves the queue and is appended to the end of the result. Its topological number is ${position}, since every vertex that precedes it has already been processed.`,
        zeroTitle: (vertex: string) => `M[${vertex}] reaches 0, joins the queue`,
        zeroDescription: (from: string, to: string, before: number) =>
            `With edge (${from}, ${to}) removed, the in-degree of ${to} drops from ${before} to 0: all of its dependencies are already in the result, so it joins the queue.`,
        decreasedDescription: (from: string, to: string, before: number) =>
            `With edge (${from}, ${to}) removed, the in-degree of ${to} drops from ${before} to ${before - 1}. It still depends on ${before - 1} ${plural(before - 1, 'vertex', 'vertices')} and stays out of the queue.`,
        cycleTitle: 'Cycle detected',
        cycleDescription: (count: number, vertices: string) =>
            `The queue emptied with ${count} ${plural(count, 'vertex', 'vertices')} still unprocessed: ${vertices}. All of them still have M[v] > 0, which is only possible if there is a cycle among them.`,
        pendingConclusion: (vertices: string) =>
            `Not every vertex was processed: the graph has a cycle involving ${vertices}.`,
        completeDescription: (count: number, order: string) =>
            `All ${count} vertices were processed: ${order}.`,
        numberingConclusion:
            'The topological number ord(v) matches the insertion order in the result and satisfies ord(v) < ord(w) for every edge (v, w) ∈ E(G).',
        acyclicConclusion:
            'Every vertex was processed, so the graph is acyclic. Note that the topological order may not be unique.',
    },
};
