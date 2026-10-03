import type { AlgorithmTexts } from '@/i18n/dictionaries';
import { plural } from '@/i18n/format';

export const greedyColoring: AlgorithmTexts['greedy-coloring'] = {
    name: 'Coloración voraz',
    shortName: 'Coloración voraz',
    tagline:
        'Recorre los vértices en cualquier orden y asigna a cada uno el color de menor índice que no use ninguno de sus vecinos.',
    complexity: 'O(n + m)',
    constraints: [
        'Requiere un grafo no dirigido',
        'Coloración aproximada, no necesariamente mínima',
        'El resultado depende del orden de los vértices',
    ],
    reference: {
        idea: 'No existe un método eficiente para obtener la coloración mínima de un grafo, pero sí se puede obtener rápidamente una coloración aproximada: se recorren los vértices en cualquier orden y se asigna a cada uno el color de menor índice que no usen sus vecinos.',
        pseudocode: [
            'Método voraz',
            '  1. Considerar los vértices del grafo en cualquier orden',
            '     v₁, v₂, . . ., vₙ',
            '  2. Identificar los colores con índices, añadiendo más',
            '     colores cuando sea necesario',
            '  3. Colorear v₁ con el primer color',
            '  4. En cada iteración, asignar al vértice actual el color',
            '     de menor índice que no use ninguno de sus vecinos',
        ],
        invariant:
            'En cada paso la coloración parcial es válida: color(v) ≠ color(w) para todo par de vértices adyacentes ya coloreados. Como un vértice tiene como máximo Δ(G) vecinos, el método nunca usa más de Δ(G) + 1 colores.',
        pitfalls: [
            'Tomar el número de colores obtenido como el número cromático: el resultado depende del orden de los vértices y en general χ(G) es menor.',
            'Olvidar las cotas conocidas: ω(G) ≤ χ(G) ≤ Δ(G) + 1 y, por el teorema de Brooks, χ(G) ≤ Δ(G) si G es simple, no completo y no es un ciclo impar.',
            'Aplicarlo a un grafo dirigido: la coloración de vértices está definida para grafos no dirigidos.',
        ],
    },
    trace: {
        initDescription: (order) =>
            `Ningún vértice está coloreado. Los vértices se considerarán en el orden ${order}. Cualquier orden es válido, pero el resultado depende de él.`,
        neighborsDescription: (vertex, colors, chosen) =>
            `Los vecinos ya coloreados de ${vertex} usan ${plural(colors.length, 'el color', 'los colores')} ${colors.join(', ')}. El color de menor índice aún libre es el ${chosen}.`,
        freeDescription: (vertex, chosen) =>
            `Ningún vecino de ${vertex} está coloreado, así que recibe el color de menor índice: el ${chosen}.`,
        completeDescription: (used) =>
            `Todos los vértices se colorearon usando ${used} ${plural(used, 'color', 'colores')}. Los vértices adyacentes tienen colores distintos, así que la coloración es válida.`,
        resultConclusion: (used) =>
            `El método voraz produjo una ${used}-coloración, luego χ(G) ≤ ${used}.`,
        orderConclusion:
            'El resultado del método voraz depende del orden en que se consideran los vértices: otro orden puede producir menos colores.',
    },
};
