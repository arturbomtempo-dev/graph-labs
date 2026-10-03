import type { AlgorithmTexts } from '@/i18n/dictionaries';
import { plural } from '@/i18n/format';

export const kruskal: AlgorithmTexts['kruskal'] = {
    name: 'Algoritmo de Kruskal',
    shortName: 'Kruskal',
    tagline:
        'Incluye aristas, no vértices: ordena las aristas por peso no decreciente y acepta cada una que no forme ciclo con las ya incluidas en E(T).',
    complexity: 'O(m log m)',
    constraints: [
        'Requiere un grafo no dirigido',
        'Requiere un grafo ponderado con peso w(e) > 0',
        'En un grafo no conexo produce un bosque de expansión mínima',
    ],
    reference: {
        idea: 'Construye el AEM incluyendo aristas, y no vértices como en Prim. Ordena las aristas en orden no decreciente de peso y acepta, en cada iteración, la arista de menor peso que no forme ciclo con las ya incluidas en E(T).',
        pseudocode: [
            'Algoritmo de Kruskal',
            '  1. Ordenar las aristas en orden no decreciente de peso:',
            '     e₁, e₂, e₃, . . .',
            '  2. V(T) ← V(G)      // todos los vértices entran en el AEM',
            '  3. E(T) ← { e₁ }',
            '  4. j ← 2            // arista a analizar',
            '  5. mientras | E(T) | < | V(T) | − 1 hacer',
            '     a. si la arista e  no forma ciclo con las aristas de E(T)',
            '                      j',
            '        entonces Añadir e  a E(T)',
            '                         j',
            '     b. j ← j + 1',
        ],
        invariant:
            'En cada iteración, T = (V(T), E(T)) es un bosque de expansión contenido en algún árbol de expansión mínima de G.',
        pitfalls: [
            'Suponer que bastan n − 1 iteraciones: se necesitan al menos n − 1, pero pueden ser más, ya que las aristas que forman ciclo deben descartarse.',
            'Aceptar una arista cuyos extremos ya están unidos por aristas de E(T): cerraría un ciclo.',
            'En un grafo no conexo el resultado es un bosque de expansión mínima, no un árbol de expansión.',
        ],
    },
    trace: {
        edgesTitle: 'Aristas en orden no decreciente de peso',
        decisions: {
            accepted: 'entra en E(T)',
            rejected: 'forma ciclo, descartada',
            examining: 'en análisis',
            waiting: 'en espera',
        },
        setsTitle: 'Componentes del bosque parcial T',
        initDescription: (edges) =>
            `V(T) recibe todos los vértices de V(G) y E(T) empieza vacío, así que cada vértice es una componente aislada del bosque. ${plural(edges, `La ${edges} arista se ordenó`, `Las ${edges} aristas se ordenaron`)} en orden no decreciente de peso.`,
        examineTitle: (edge, weight) => `Analiza ${edge} de peso ${weight}`,
        cycleDescription:
            'Los dos extremos ya están unidos por aristas de E(T), así que esta arista formaría un ciclo.',
        noCycleDescription:
            'Los extremos están en componentes distintas del bosque parcial, así que la arista no forma ciclo con las aristas de E(T).',
        rejectedTitle: 'Arista descartada (forma ciclo)',
        acceptedTitle: 'Arista añadida a E(T)',
        rejectedDescription:
            'La arista se descarta y el bosque parcial no cambia. Por eso pueden necesitarse más de n − 1 iteraciones.',
        acceptedDescription: (from, to) =>
            `La arista entra en E(T) y las componentes de ${from} y ${to} se convierten en una sola.`,
        completeTitle: 'Ejecución completada',
        completeDescription: (target, total) =>
            `| E(T) | = | V(T) | − 1 = ${target}: el bucle termina con peso total C(T) = ${total}.`,
        incompleteDescription: (target, total) =>
            `Se analizaron todas las aristas sin llegar a | V(T) | − 1 = ${target} aristas, así que el grafo no es conexo. Peso total C(T) = ${total}.`,
        weightConclusion: (total, accepted, rejected) =>
            `Peso total: C(T) = ${total}, con ${accepted} ${plural(accepted, 'arista', 'aristas')} en E(T) y ${rejected} ${plural(rejected, 'arista descartada', 'aristas descartadas')} por formar ciclo.`,
        iterationsConclusion: (iterations, accepted) =>
            `${plural(iterations, 'Fue necesaria', 'Fueron necesarias')} ${iterations} ${plural(iterations, 'iteración', 'iteraciones')} para ${accepted} ${plural(accepted, 'arista aceptada', 'aristas aceptadas')}: como las aristas que forman ciclo deben descartarse, n − 1 iteraciones pueden no bastar.`,
        treeConclusion:
            'El grafo es conexo, así que el resultado es un árbol de expansión mínima (AEM).',
        forestConclusion: (components) =>
            `El grafo tiene ${components} componentes conexas, así que el resultado es un bosque de expansión mínima.`,
    },
};
