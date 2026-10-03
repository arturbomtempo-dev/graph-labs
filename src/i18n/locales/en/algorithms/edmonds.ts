import { plural } from '@/i18n/format';

export const edmonds = {
    name: "Edmonds' blossom algorithm",
    shortName: 'Edmonds',
    tagline:
        'Searches for M-augmenting paths between exposed vertices, contracting the blossoms that appear, until none is left.',
    complexity: 'O(n² · m)',
    constraints: [
        'Requires an undirected graph',
        'Ignores edge weights',
        'Handles general graphs, not only bipartite ones',
    ],
    reference: {
        idea: "By Berge's theorem, M has maximum cardinality if and only if there is no M-augmenting path. The algorithm looks for such paths in an M-alternating forest; when an edge joins two vertices at even distance in the same tree, an odd cycle appears, the blossom, which is contracted into a pseudo-vertex.",
        pseudocode: [
            'Maximum_Matching(G)',
            '  1. M ← ∅',
            '  2. P ← Find_Augmenting_Path(G, M)',
            '  3. while (P ≠ ∅) do',
            '     a. M ← M ⊕ EP',
            '     b. P ← Find_Augmenting_Path(G, M)',
            '',
            'Find_Augmenting_Path(G, M)',
            '  1. F ← Init_Alternating_Forest(G, M)',
            '  2. for every unmarked vertex v ∈ F such that',
            '     dist(v, F.root[v]) is even do',
            '     a. while ∃ unmarked edge e = {v, w} do',
            '        i.   if w ∉ F then Add_To_Forest(M, F, v, w)',
            '        ii.  else if dist(w, F.root[w]) is even then',
            '               return Get_New_Path(G, M, F, v, w)',
            '        iii. Mark edge e',
            '     b. Mark vertex v',
            '  3. return ∅',
            '',
            'Get_New_Path(G, M, F, v, w)',
            '  1. if F.root[v] ≠ F.root[w] then',
            '       P ← GetPath(F, F.root[v], v)',
            '            + GetPath(F, w, F.root[w])',
            '  2. else                            // blossom',
            '     a. B ← GetPath(F, v, w) + v',
            '     b. G′ ← Contract_Blossom_Graph(G, B, z)',
            '     c. M′ ← Contract_Blossom_Matching(M, B, z)',
            '     d. P ← Find_Augmenting_Path(G′, M′)',
            '     e. if z ∈ P then P ← Expand_Blossom(P, G, B, z)',
            '  3. return P',
        ],
        invariant:
            "M ⊕ EP is always a matching with one more edge than M. By Edmonds' theorem, M is maximum in G if and only if M/B is maximum in G/B, which justifies contracting blossoms.",
        pitfalls: [
            'Using plain breadth-first or depth-first search on a general graph: without handling blossoms, existing M-augmenting paths go unnoticed.',
            'Ignoring the edge {v, w} when dist(w, F.root[w]) is odd: it does not produce an augmenting path.',
            'Confusing a maximal matching with a maximum one: maximal only means no edge can be added; maximum is the one with the largest cardinality. And a maximum matching does not imply a perfect matching.',
        ],
    },
    issues: {
        undirectedOnly:
            'Matching is defined for undirected graphs: convert every edge to undirected.',
    },
    trace: {
        matchingTitle: 'Matching M',
        partnerColumn: 'Partner in M',
        exposedStatus: 'exposed',
        coveredStatus: 'covered',
        exposedMetric: 'Exposed vertices',
        initTitle: 'Initialization: M = ∅',
        initDescription:
            'The matching starts empty, so every vertex is exposed (free). As long as an M-augmenting path exists, M can grow.',
        blossomBadge: (base: string) => `blossom ${base}`,
        blossomTitle: (base: string) => `Blossom found and contracted into ${base}`,
        blossomDescription: (edge: string, members: string, base: string) =>
            `Edge ${edge} joins two vertices at even distance from the root of the same tree, forming an odd-length cycle. The blossom { ${members} } is contracted into a pseudo-vertex with base ${base}; all of its vertices now count as even.`,
        augmentingTitle: (vertex: string) => `M-augmenting path found to ${vertex}`,
        augmentingDescription: (vertex: string, root: string) =>
            `${vertex} is exposed and was reached by an M-alternating path starting at the exposed root ${root}. Since the path starts and ends at exposed vertices, it is M-augmenting, and every M-augmenting path has odd length.`,
        growTitle: (from: string, to: string, partner: string) =>
            `Forest grows through {${from}, ${to}} and {${to}, ${partner}} ∈ M`,
        growDescription: (from: string, to: string, partner: string) =>
            `${to} was not in the forest yet. Edge {${from}, ${to}} joins the tree and, along with it, edge {${to}, ${partner}} of M. ${to} is at odd distance from the root and ${partner} at even distance, so the search can continue from it.`,
        rootBadge: 'root',
        treeTitle: (root: string) => `M-alternating tree rooted at ${root}`,
        treeDescription: (root: string) =>
            `${root} is exposed, so an M-alternating tree is started from it. The search looks for an M-alternating path ending at another exposed vertex.`,
        noPathTitle: (root: string) => `No M-augmenting path from ${root}`,
        noPathDescription: (root: string) =>
            `The M-alternating tree rooted at ${root} was fully explored without reaching another exposed vertex. ${root} stays exposed in the final matching.`,
        augmentTitle: (size: number) => `M ← M ⊕ EP, with |M| = ${size}`,
        augmentDescription: (edges: string, root: string, endpoint: string) =>
            `The symmetric difference removes from M the path edges that were in M and adds those that were not. The edges of M along the path become ${edges}, and ${root} and ${endpoint} are no longer exposed. By Berge's theorem, M grew by exactly one edge.`,
        maximumTitle: 'Maximum matching found',
        maximumDescription: (size: number) =>
            `There is no M-augmenting path left in G, so, by Berge's theorem, M has maximum cardinality: |M| = ${size}.`,
        matchingConclusion: (size: number, pairs: string) =>
            `Maximum matching with |M| = ${size}: ${pairs}.`,
        augmentationsConclusion: (count: number) =>
            `${count} ${plural(count, 'augmentation was', 'augmentations were')} made starting from M = ∅. Each M-augmenting path found increases |M| by exactly one.`,
        perfectConclusion: 'Every vertex is covered, so M is a perfect (or complete) matching.',
        exposedConclusion: (count: number, vertices: string) =>
            `${count} exposed ${plural(count, 'vertex remains', 'vertices remain')} (${vertices}): a maximum matching does not imply that every vertex is saturated.`,
    },
};
