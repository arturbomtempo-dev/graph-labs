import type { AlgorithmTexts } from '@/i18n/dictionaries';
import { plural } from '@/i18n/format';

export const welshPowell: AlgorithmTexts['welsh-powell'] = {
    name: 'Algoritmo de Welsh-Powell',
    shortName: 'Welsh-Powell',
    tagline:
        'Ordena los vértices por grado no creciente y colorea con un mismo color todos los que no estén conectados a un vértice ya coloreado con él.',
    complexity: 'O(n² )',
    constraints: [
        'Requiere un grafo no dirigido',
        'Coloración aproximada, no necesariamente mínima',
        'Suele usar menos colores que el método voraz',
    ],
    reference: {
        idea: 'Refinamiento del método voraz: los vértices se ordenan por grado no creciente y cada color se reparte en una pasada completa por la lista, coloreando todos los vértices que no estén conectados a uno ya coloreado con ese color.',
        pseudocode: [
            'Algoritmo de Welsh-Powell',
            '  1. Ordenar los vértices por grado no creciente',
            '     v₁, v₂, . . ., vₙ',
            '  2. Identificar los colores con índices, añadiendo más',
            '     colores cuando sea necesario',
            '  3. Colorear v₁ con el primer color',
            '  4. Recorrer la lista de vértices coloreando todos los',
            '     vértices no conectados a un vértice ya coloreado,',
            '     usando siempre el mismo color',
            '  5. Repetir el paso 4 para todos los vértices sin colorear',
            '     usando un nuevo color, respetando siempre el orden de',
            '     grado no creciente, hasta que todos estén coloreados',
        ],
        invariant:
            'Cada color forma un conjunto independiente: ningún par de vértices con el mismo color es adyacente. El método termina porque cada pasada colorea al menos un vértice.',
        pitfalls: [
            'Tomar el resultado como óptimo: existe un contraejemplo en el que Welsh-Powell usa 3 colores en un grafo bipartito, para el cual χ(G) = 2.',
            'Abandonar el orden por grado al empezar un nuevo color: la lista ordenada se recorre desde el principio en cada pasada.',
            'Colorear un vértice adyacente a otro ya coloreado con el color de la pasada actual: la comprobación se hace contra los vértices ya coloreados con ese color.',
        ],
    },
    trace: {
        sortTitle: 'Paso 1: ordenación por grado',
        sortDescription: (order) => `Los vértices se ordenan por grado no creciente: ${order}.`,
        passTitle: (color) => `Color ${color}: nueva pasada por la lista`,
        passDescription: (color) =>
            `Se recorre la lista ordenada coloreando con el color ${color} todo vértice aún sin color que no sea adyacente a ningún vértice ya coloreado con él.`,
        blockedTitle: (vertex, color) => `${vertex} no puede recibir el color ${color}`,
        blockedDescription: (vertex, color) =>
            `${vertex} es adyacente a un vértice ya coloreado con el color ${color} en esta pasada, así que queda para un color siguiente.`,
        colorDescription: (vertex, color) =>
            `${vertex} no es adyacente a ningún vértice ya coloreado con el color ${color}. Sus vecinos quedan bloqueados para este color durante esta pasada.`,
        passDoneTitle: (color) => `Color ${color} terminado`,
        passDoneDescription: (color, painted, remaining) =>
            `El color ${color} se asignó a ${painted.length} ${plural(painted.length, 'vértice', 'vértices')}: ${painted.join(', ') || '-'}. ${remaining ? 'Todavía quedan vértices sin color, así que se empieza un nuevo color.' : 'Todos los vértices están coloreados.'}`,
        completeDescription: (colors) =>
            `Todos los vértices se colorearon con ${colors} ${plural(colors, 'color', 'colores')}, respetando siempre el orden de grado no creciente.`,
        resultConclusion: (colors) =>
            `Welsh-Powell produjo una ${colors}-coloración, luego χ(G) ≤ ${colors}.`,
        comparisonConclusion:
            'Ordenar por grado suele dar un resultado mejor que el del método voraz, pero no garantiza la coloración mínima. Existen contraejemplos, como grafos bipartitos en los que el método usa 3 colores aunque χ(G) = 2.',
    },
};
