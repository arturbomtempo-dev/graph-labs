import { plural } from '@/i18n/format';

export const welshPowell = {
    name: 'Welsh-Powell algorithm',
    shortName: 'Welsh-Powell',
    tagline:
        'Sorts the vertices by non-increasing degree and gives one color to every vertex not adjacent to a vertex already painted with it.',
    complexity: 'O(n² )',
    constraints: [
        'Requires an undirected graph',
        'Approximate coloring, not necessarily minimum',
        'Usually uses fewer colors than the greedy method',
    ],
    reference: {
        idea: 'A refinement of the greedy method: the vertices are sorted by non-increasing degree and each color is handed out in a full pass through the list, coloring every vertex that is not adjacent to one already painted with that color.',
        pseudocode: [
            'Welsh-Powell algorithm',
            '  1. Sort the vertices by non-increasing degree',
            '     v₁, v₂, . . ., vₙ',
            '  2. Identify the colors by indices, adding more colors',
            '     when needed',
            '  3. Color v₁ with the first color',
            '  4. Go down the vertex list coloring every vertex that is',
            '     not adjacent to an already colored vertex, always using',
            '     the same color',
            '  5. Repeat step 4 for every uncolored vertex using a new',
            '     color, always following the non-increasing degree',
            '     order, until every vertex is colored',
        ],
        invariant:
            'Each color forms an independent set: no two vertices with the same color are adjacent. The method terminates because each pass colors at least one vertex.',
        pitfalls: [
            'Taking the result as optimal: there is a counterexample in which Welsh-Powell uses 3 colors on a bipartite graph, for which χ(G) = 2.',
            'Dropping the degree order when starting a new color: the sorted list is walked from the beginning in every pass.',
            'Coloring a vertex adjacent to another already painted with the current pass color: the check is against the vertices already painted with that color.',
        ],
    },
    trace: {
        sortTitle: 'Step 1: sort by degree',
        sortDescription: (order: string) =>
            `The vertices are sorted by non-increasing degree: ${order}.`,
        passTitle: (color: number) => `Color ${color}: new pass through the list`,
        passDescription: (color: number) =>
            `Walk through the sorted list, giving color ${color} to every uncolored vertex that is not adjacent to any vertex already painted with it.`,
        blockedTitle: (vertex: string, color: number) => `${vertex} cannot get color ${color}`,
        blockedDescription: (vertex: string, color: number) =>
            `${vertex} is adjacent to a vertex already painted with color ${color} in this pass, so it is left for a later color.`,
        colorDescription: (vertex: string, color: number) =>
            `${vertex} is not adjacent to any vertex already painted with color ${color}. Its neighbors are blocked for this color during this pass.`,
        passDoneTitle: (color: number) => `Color ${color} finished`,
        passDoneDescription: (color: number, painted: string[], remaining: boolean) =>
            `Color ${color} was given to ${painted.length} ${plural(painted.length, 'vertex', 'vertices')}: ${painted.join(', ') || '-'}. ${remaining ? 'Some vertices are still uncolored, so a new color starts.' : 'Every vertex is colored.'}`,
        completeDescription: (colors: number) =>
            `Every vertex was colored with ${colors} ${plural(colors, 'color', 'colors')}, always following the non-increasing degree order.`,
        resultConclusion: (colors: number) =>
            `Welsh-Powell produced a ${colors}-coloring, so χ(G) ≤ ${colors}.`,
        comparisonConclusion:
            'Sorting by degree usually gives a better result than the greedy method, but it does not guarantee the minimum coloring. There are counterexamples, such as bipartite graphs where the method uses 3 colors even though χ(G) = 2.',
    },
};
