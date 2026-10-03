import { joinList, plural } from '@/i18n/format';

export const fleury = {
    name: "Fleury's algorithm",
    shortName: 'Fleury',
    tagline:
        'Builds an Eulerian trail by walking through the graph and avoiding crossing a bridge while another edge is still available.',
    complexity: 'O(m² )',
    constraints: [
        'Requires an undirected, connected graph',
        'At most 2 vertices of odd degree',
        'Ignores edge weights',
    ],
    reference: {
        idea: "A connected graph is Eulerian if and only if all of its vertices have even degree (Euler's theorem), and semi-Eulerian if exactly two vertices have odd degree. The algorithm walks through the graph removing the traversed edges and avoids crossing a bridge while there is another option.",
        pseudocode: [
            "Fleury's algorithm",
            '  1. if V(G) has 3 or more vertices of odd degree then STOP',
            "  2. Let G' = (V', E') such that V' ← V(G) and E' ← E(G)",
            "  3. Select a starting vertex v ∈ V'",
            '       (choose a vertex v of odd degree, if there is one)',
            "  4. while E' ≠ ∅ do",
            '     a. if d(v) > 1 then',
            "          Select an edge {v, w} that is not a bridge in G'",
            '        else',
            "          Select the only edge {v, w} available in G'",
            "     c. v ← w;   E' ← E' − {v, w}",
            '',
            '  // Walk from v to w and remove the traversed edge',
        ],
        invariant:
            "The trail being built never repeats edges and, by avoiding bridges, keeps the remaining edges of G' connected, which guarantees that the walk only ends once every edge has been traversed.",
        pitfalls: [
            'Crossing a bridge while another edge is available: the edges on the other side become unreachable and the trail ends early.',
            'Starting from a vertex of even degree in a semi-Eulerian graph: the trail must start at one of the two vertices of odd degree.',
            'Confusing it with a Hamiltonian graph: an Eulerian trail uses each edge once, a Hamiltonian path visits each vertex once.',
        ],
    },
    issues: {
        undirectedOnly:
            "Fleury's algorithm is defined for undirected graphs: convert every edge to undirected.",
        tooManyOdd: (vertices: string[]) =>
            `The graph has ${vertices.length} vertices of odd degree (${vertices.join(', ')}). A connected graph is Eulerian if every degree is even and semi-Eulerian if exactly two vertices have odd degree.`,
        disconnected:
            "The graph is not connected: Euler's theorem requires a connected graph for an Eulerian trail or circuit to exist.",
        mustStartAtOdd: (vertices: string[]) =>
            `With vertices of odd degree, the Eulerian trail must start at one of them: ${joinList(vertices, 'or')}.`,
    },
    trace: {
        remainingTitle: "Remaining edges in E'",
        traversedStatus: (position: number) => `traversed (#${position})`,
        pendingStatus: "in E'",
        degreesTitle: "Degrees in G'",
        degreeInRemaining: "d(v) in G'",
        degreeInOriginal: 'd(v) in G',
        trailLabel: 'Trail',
        startBadge: 'start',
        endBadge: 'end',
        initTitle: (vertex: string) => `Initialization: starting vertex ${vertex}`,
        initEulerian: (vertex: string) =>
            `Every vertex has even degree, so the graph is Eulerian and an Eulerian circuit exists. G' starts equal to G and the walk starts at ${vertex}, chosen freely.`,
        initSemiEulerian: (oddVertices: string[], start: string) =>
            `There are exactly ${oddVertices.length} vertices of odd degree (${oddVertices.join(', ')}), so the graph is semi-Eulerian. The walk must start at one of them: ${start}.`,
        onlyEdgeReason: (vertex: string) =>
            `${vertex} has only one edge available in G', so it is traversed even though it is a bridge.`,
        avoidBridgesReason: (available: number, bridges: string[], chosen: string) =>
            `Among the ${available} available edges, ${bridges.join(', ')} ${plural(bridges.length, 'is a bridge', 'are bridges')} in G' and ${plural(bridges.length, 'is', 'are')} avoided. ${chosen} is chosen, since it is not a bridge.`,
        noBridgesReason: (available: number, chosen: string) =>
            `None of the ${available} available edges is a bridge in G', so any of them works. ${chosen} is chosen.`,
        allBridgesReason:
            "Every available edge is a bridge in G', so one of them has to be traversed.",
        analyzeTitle: (vertex: string) => `Examine the edges incident to ${vertex}`,
        walkTitle: (vertex: string) => `Walk to ${vertex}`,
        walkDescription: (vertex: string, remaining: number) =>
            `The edge is traversed and removed from E': v ← ${vertex}. ${remaining} ${plural(remaining, 'edge remains', 'edges remain')} in G'.`,
        circuitTitle: 'Eulerian circuit found',
        trailTitle: 'Eulerian trail found',
        interruptedTitle: 'Walk interrupted',
        completeDescription: (total: number) =>
            `E' is empty: all ${total} edges were traversed exactly once.`,
        interruptedDescription: (remaining: number) =>
            `The walk ended with ${remaining} ${plural(remaining, 'edge', 'edges')} still in E'.`,
        trailConclusion: (closed: boolean, trail: string) =>
            `Eulerian ${closed ? 'circuit' : 'trail'}: ${trail}.`,
        countConclusion: (used: number, total: number) =>
            `${used} of ${total} ${plural(total, 'edge was', 'edges were')} traversed, each exactly once.`,
        eulerianConclusion:
            'Every vertex has even degree, so the graph is Eulerian: the trail is closed and starts and ends at the same vertex.',
        semiEulerianConclusion: (oddVertices: string[]) =>
            `The graph has exactly two vertices of odd degree (${joinList(oddVertices, 'and')}), so it is semi-Eulerian: the trail is open and starts and ends at them.`,
    },
};
