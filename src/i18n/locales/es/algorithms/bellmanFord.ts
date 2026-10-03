import type { AlgorithmTexts } from '@/i18n/dictionaries';
import { plural } from '@/i18n/format';

export const bellmanFord: AlgorithmTexts['bellman-ford'] = {
    name: 'Algoritmo de Bellman-Ford',
    shortName: 'Bellman-Ford',
    tagline:
        'Programación dinámica: examina todas las aristas en cada iteración, relajando las que estén tensas, durante |V(G)| − 1 iteraciones.',
    complexity: 'O(n · m)',
    constraints: [
        'Admite aristas de peso negativo',
        'No admite ciclos de peso negativo',
        'Detecta un ciclo de peso negativo alcanzable desde el origen',
    ],
    reference: {
        idea: 'Calcula caminos mínimos mediante programación dinámica. En lugar de "cerrar" un vértice por iteración, como Dijkstra, examina todas las aristas en cada iteración. Como cualquier camino en un grafo con n vértices tiene como máximo n − 1 aristas, bastan n − 1 iteraciones.',
        pseudocode: [
            'Operación de relajación',
            '  si dist[v] + d    < dist[w] entonces   // ¿la arista (v, w) está tensa?',
            '                vw',
            '    dist[w] ← dist[v] + d',
            '                         vw',
            '    pred[w] ← v',
            '',
            'Algoritmo de Bellman-Ford',
            '  1. para todo vértice v ∈ V(G) hacer',
            '       dist[v] ← ∞; pred[v] ← nulo',
            '  2. dist[s] ← 0',
            '  3. para i = 1, . . ., | V(G) | − 1 hacer',
            '       para cada (v, w) ∈ E(G) hacer',
            '         si dist[w] > dist[v] + d    entonces   // ¿arista tensa?',
            '                                 vw',
            '           dist[w] ← dist[v] + d',
            '                                vw',
            '           pred[w] ← v',
            '',
            '  Si aún hay alguna arista tensa tras la última iteración,',
            '  entonces el grafo tiene un ciclo de peso negativo.',
        ],
        invariant:
            'Tras la i-ésima iteración, dist[w] es como máximo el peso del camino más corto de s a w que usa hasta i aristas.',
        pitfalls: [
            'Si en alguna iteración ninguna arista está tensa, el algoritmo puede terminar: las iteraciones siguientes no traerían actualizaciones.',
            'Si hay un ciclo de peso negativo entre s y t, no existe camino mínimo entre ellos; sin ese ciclo, el camino mínimo es simple (no repite vértices).',
            'Una arista no dirigida con peso negativo ya es, por sí sola, un ciclo de peso negativo.',
        ],
    },
    trace: {
        arcsTitle: 'Lista de aristas (orden fijo de examen)',
        initDescription: (source) =>
            `dist[${source}] = 0 en el origen, dist[v] = ∞ y pred[v] = nulo en los demás vértices. Cada arista no dirigida se examina en ambos sentidos.`,
        iterationTitle: (round, rounds) => `Iteración ${round} de ${rounds}`,
        iterationDescription: (arcs, rounds) =>
            `En esta iteración se examinan las ${arcs} aristas, siempre en el mismo orden, y se relajan las que estén tensas. Como cualquier camino tiene como máximo n − 1 aristas, ${plural(rounds, 'basta', 'bastan')} ${rounds} ${plural(rounds, 'iteración', 'iteraciones')}.`,
        iterationMetric: 'Iteración',
        noTenseTitle: (round) => `Iteración ${round} sin aristas tensas`,
        noTenseDescription:
            'Ninguna arista estaba tensa en esta iteración, así que no habrá actualizaciones en las siguientes y el algoritmo puede terminar.',
        checkTitle: 'Comprobación de ciclos de peso negativo',
        checkDescription:
            'Se ejecuta una iteración adicional: si alguna arista sigue tensa, algún camino tendría n aristas o más, lo que solo es posible si hay un ciclo de peso negativo alcanzable desde el origen.',
        negativeCycleTitle: (from, to) => `Ciclo de peso negativo detectado en (${from}, ${to})`,
        negativeCycleDescription: (fromDistance, weight, current) =>
            `La arista sigue tensa (${fromDistance} + ${weight} < ${current}), lo que solo es posible si hay un ciclo de peso negativo alcanzable desde el origen.`,
        invalidTitle: 'Resultado no válido por un ciclo de peso negativo',
        invalidDescription: (edges, rounds) =>
            `${edges} ${plural(edges, 'arista sigue tensa', 'aristas siguen tensas')} tras ${rounds} ${plural(rounds, 'iteración', 'iteraciones')}.`,
        negativeCycleConclusion:
            'Existe un ciclo de peso negativo alcanzable desde el origen: los vértices afectados no tienen camino mínimo, porque siempre se puede reducir el peso dando una vuelta más al ciclo.',
        lastRoundConclusion: (last, rounds) =>
            `La última iteración con una arista tensa fue la número ${last}, de un total de ${rounds}. Sin ciclos de peso negativo, todo camino mínimo es simple (no repite vértices).`,
        doneDescription:
            'Ninguna arista está tensa, así que se alcanzó el valor óptimo y no hay ningún ciclo de peso negativo alcanzable.',
    },
};
