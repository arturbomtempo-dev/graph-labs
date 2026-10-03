import { plural } from '@/i18n/format';

export const greedyColoring = {
    name: 'Greedy coloring',
    shortName: 'Greedy coloring',
    tagline:
        'Goes through the vertices in any order and gives each one the lowest-index color not used by any of its neighbors.',
    complexity: 'O(n + m)',
    constraints: [
        'Requires an undirected graph',
        'Approximate coloring, not necessarily minimum',
        'The result depends on the vertex order',
    ],
    reference: {
        idea: 'There is no efficient method to find the minimum coloring of a graph, but an approximate coloring can be found quickly: go through the vertices in any order, giving each one the lowest-index color not used by its neighbors.',
        pseudocode: [
            'Greedy method',
            '  1. Consider the vertices of the graph in any order',
            '     v₁, v₂, . . ., vₙ',
            '  2. Identify the colors by indices, adding more colors',
            '     when needed',
            '  3. Color v₁ with the first color',
            '  4. At each iteration, give the current vertex the',
            '     lowest-index color not used by any of its neighbors',
        ],
        invariant:
            'At every step the partial coloring is valid: color(v) ≠ color(w) for every pair of adjacent colored vertices. Since a vertex has at most Δ(G) neighbors, the method never uses more than Δ(G) + 1 colors.',
        pitfalls: [
            'Taking the number of colors obtained as the chromatic number: the result depends on the vertex order and χ(G) is usually smaller.',
            "Forgetting the known bounds: ω(G) ≤ χ(G) ≤ Δ(G) + 1 and, by Brooks' theorem, χ(G) ≤ Δ(G) if G is simple, not complete and not an odd cycle.",
            'Applying it to a directed graph: vertex coloring is defined for undirected graphs.',
        ],
    },
    trace: {
        initDescription: (order: string) =>
            `No vertex is colored. The vertices will be considered in the order ${order}. Any order is valid, but the result depends on it.`,
        neighborsDescription: (vertex: string, colors: number[], chosen: number) =>
            `The already colored neighbors of ${vertex} use ${plural(colors.length, 'color', 'colors')} ${colors.join(', ')}. The lowest-index free color is ${chosen}.`,
        freeDescription: (vertex: string, chosen: number) =>
            `No neighbor of ${vertex} is colored, so it gets the lowest-index color: ${chosen}.`,
        completeDescription: (used: number) =>
            `Every vertex was colored using ${used} ${plural(used, 'color', 'colors')}. Adjacent vertices have different colors, so the coloring is valid.`,
        resultConclusion: (used: number) =>
            `The greedy method produced a ${used}-coloring, so χ(G) ≤ ${used}.`,
        orderConclusion:
            'The result of the greedy method depends on the order in which the vertices are considered: another order may produce fewer colors.',
    },
};
