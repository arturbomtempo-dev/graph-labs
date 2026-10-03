import type { AlgorithmTexts } from '@/i18n/dictionaries';

export const floydWarshall: AlgorithmTexts['floyd-warshall'] = {
    name: 'Algoritmo de Floyd-Warshall',
    shortName: 'Floyd-Warshall',
    tagline:
        'Caminos mínimos entre todos los pares mediante programación dinámica: la ronda k habilita el vértice k como intermedio.',
    complexity: 'O(n³)',
    constraints: [
        'Admite aristas de peso negativo',
        'No admite ciclos de peso negativo',
        'Calcula todos los pares de vértices de una sola vez',
    ],
    reference: {
        idea: 'Programación dinámica sobre el conjunto de vértices intermedios permitidos. Con los vértices numerados de 1 a n, distᵏ[i, j] es la distancia entre i y j usando como intermedios solo los vértices de { 1, 2, . . ., k }.',
        pseudocode: [
            'Relajación de la longitud de los caminos',
            '  distᵏ[i, j] = min( distᵏ⁻¹[i, j],',
            '                     distᵏ⁻¹[i, k] + distᵏ⁻¹[k, j] )',
            '  con dist⁰[i, j] = d   si (i, j) ∈ E(G); ∞ en otro caso;',
            '                     ij',
            '  y dist⁰[i, i] = 0',
            '',
            'Algoritmo de Floyd-Warshall',
            '  1. para i = 1, . . ., n hacer',
            '       para j = 1, . . ., n | j ≠ i hacer',
            '         dist[i, j] ← ∞; pred[i, j] ← nulo',
            '       dist[i, i] ← 0;   pred[i, i] ← i',
            '  2. para toda arista (i, j) ∈ E(G) hacer',
            '       dist[i, j] ← d  ;  pred[i, j] ← i',
            '                     ij',
            '  3. para k = 1, . . ., n hacer   // cada posible intermedio',
            '       para i = 1, . . ., n hacer',
            '         para j = 1, . . ., n hacer',
            '           si dist[i, j] > dist[i, k] + dist[k, j] entonces',
            '             dist[i, j] ← dist[i, k] + dist[k, j]',
            '             pred[i, j] ← pred[k, j]',
        ],
        invariant:
            'Al final de la ronda k, dist[i, j] es el peso del camino más corto de i a j que usa solo { 1, . . ., k } como vértices intermedios; pred[i, j] guarda el penúltimo vértice de ese camino.',
        pitfalls: [
            'Cambiar el orden de los bucles: k debe ser el bucle más externo.',
            'Actualizar el predecesor con pred[i, k] en lugar de pred[k, j]: pred[i, j] es el penúltimo vértice del camino de i a j.',
            'Una entrada negativa en la diagonal, es decir, dist[i, i] < 0, indica un ciclo de peso negativo.',
        ],
    },
    trace: {
        distMatrixTitle: 'Matriz dist',
        predMatrixTitle: 'Matriz pred',
        initTitle: 'Matrices iniciales (k = 0)',
        initDescription:
            'dist⁰[i, i] = 0, dist⁰[i, j] = dij para toda arista (i, j) ∈ E(G) e ∞ para los pares sin conexión directa. En pred, cada par unido por una arista recibe el propio i, ya que i es el penúltimo vértice del camino directo de i a j.',
        pivotDescription: (allowed, pivot) =>
            `Ahora los vértices { ${allowed} } pueden usarse como intermedios. Para todo par (i, j), se comprueba si dist[i, j] > dist[i, ${pivot}] + dist[${pivot}, j].`,
        pivotMetric: 'Intermedio k',
        updateDescription: (values) =>
            `dist[${values.i}, ${values.k}] + dist[${values.k}, ${values.j}] = ${values.viaFirst} + ${values.viaSecond} = ${values.total}, menor que ${values.previous}. También se actualiza pred[${values.i}, ${values.j}] ← pred[${values.k}, ${values.j}] = ${values.predecessor}.`,
        noImprovementTitle: (pivot) => `Ninguna mejora con k = ${pivot}`,
        noImprovementDescription: (pivot) =>
            `Ningún par (i, j) reduce su distancia pasando por ${pivot}.`,
        negativeCycleBadge: 'ciclo −',
        negativeCycleConclusion: (vertices) =>
            `Ciclo de peso negativo detectado: dist[i, i] < 0 para ${vertices}. En ese caso no hay un camino mínimo bien definido entre los pares afectados.`,
        noNegativeCycleConclusion:
            'Ninguna entrada de la diagonal quedó negativa, así que el grafo no tiene ciclos de peso negativo.',
        pathConclusion: (start, end, path, weight) =>
            `Camino mínimo de ${start} a ${end}, recuperado de atrás hacia adelante con la matriz pred: ${path} (peso ${weight}).`,
        finalTitle: 'Matrices finales',
        finalDescription:
            'Tras habilitar todos los vértices como intermedios, dist[i, j] contiene la distancia mínima entre cada par de vértices y pred[i, j] permite recuperar los caminos.',
    },
};
