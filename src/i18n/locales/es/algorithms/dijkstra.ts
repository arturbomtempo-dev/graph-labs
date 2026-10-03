import type { AlgorithmTexts } from '@/i18n/dictionaries';

export const dijkstra: AlgorithmTexts['dijkstra'] = {
    name: 'Algoritmo de Dijkstra',
    shortName: 'Dijkstra',
    tagline:
        '"Cierra" un vértice por iteración, siempre el de menor dist, y relaja las aristas tensas que salen de él.',
    complexity: 'O(n²)',
    constraints: [
        'Acepta aristas dirigidas y no dirigidas',
        'Requiere pesos no negativos',
        'Se basa en el principio de relajación',
    ],
    reference: {
        idea: 'Resuelve el problema del camino mínimo desde una única raíz s. Se basa en el principio de relajación y "cierra" un vértice por iteración: elige el vértice aún no cerrado con el menor valor de dist y relaja las aristas tensas que salen de él.',
        pseudocode: [
            'Operación de relajación',
            '  si dist[v] + d    < dist[w] entonces   // ¿la arista (v, w) está tensa?',
            '                vw',
            '    dist[w] ← dist[v] + d',
            '                         vw',
            '    pred[w] ← v',
            '',
            'Algoritmo de Dijkstra',
            '  1. para todo vértice v ∈ V(G) hacer',
            '       dist[v] ← ∞; pred[v] ← nulo',
            '  2. dist[s] ← 0        // s es la raíz de la búsqueda',
            '  3. S ← ∅              // conjunto de vértices cerrados',
            '  4. mientras S ≠ V(G) hacer',
            '     a. Elegir el vértice v ∉ S de menor dist[v]',
            '     b. S ← S ∪ { v }                  // "cerrar" el vértice v',
            '     c. para todo vértice w ∈ Γ⁺(v) hacer',
            '          si dist[w] > dist[v] + d    entonces   // ¿arista tensa?',
            '                                  vw',
            '            dist[w] ← dist[v] + d',
            '                                 vw',
            '            pred[w] ← v',
        ],
        invariant:
            'Para todo v ∈ S, dist[v] ya es el peso del camino mínimo desde la raíz hasta v. Al final, dist[ ] guarda los pesos de los caminos mínimos; los caminos en sí se recuperan con la lista de predecesores pred[ ].',
        pitfalls: [
            'Aplicar el algoritmo a un grafo con una arista de peso negativo: falla. Reponderar sumando una constante a todas las aristas también puede fallar.',
            'Reabrir un vértice que ya pertenece a S: una vez cerrado, su dist ya no cambia.',
            'Creer que dist[ ] devuelve los caminos: sin pred[ ] solo se obtienen los pesos.',
        ],
    },
    issues: {
        negativeWeights:
            'El algoritmo de Dijkstra falla con aristas de peso negativo: usa Bellman-Ford. Reponderar sumando una constante a todas las aristas también puede fallar.',
    },
    trace: {
        openSetTitle: 'Vértices aún no cerrados',
        initDescription: (root) =>
            `dist[${root}] = 0 en la raíz y dist[v] = ∞ en los demás vértices, con pred[v] = nulo. Todavía no se ha cerrado ningún vértice, es decir, S = ∅.`,
        unreachableTitle: 'Vértices inalcanzables',
        unreachableDescription:
            'Todos los vértices aún no cerrados tienen dist = ∞: no son alcanzables desde la raíz y el algoritmo termina.',
        closeTitle: (vertex, distance) => `Cierra ${vertex} con dist = ${distance}`,
        closeDescription: (vertex) =>
            `${vertex} es el vértice no cerrado con el menor valor de dist, así que entra en S. Como no hay pesos negativos, dist[${vertex}] ya es el peso definitivo del camino mínimo desde la raíz.`,
        notTenseTitle: (from, to) => `La arista (${from}, ${to}) no está tensa`,
        notTenseDescription: (values) =>
            `dist[${values.from}] + d = ${values.fromDistance} + ${values.weight} = ${values.candidate} no es menor que dist[${values.to}] = ${values.current}, así que nada cambia.`,
        pathHighlighted: (target) => `El camino mínimo hasta ${target} está resaltado en morado.`,
        allClosedDescription:
            'Todos los vértices alcanzables se cerraron con su valor definitivo de dist.',
        predConclusion:
            'dist[ ] guarda solo los pesos de los caminos mínimos; los caminos en sí se recuperan recorriendo la lista de predecesores pred[ ].',
    },
};
