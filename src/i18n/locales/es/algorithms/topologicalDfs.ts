import type { AlgorithmTexts } from '@/i18n/dictionaries';

export const topologicalDfs: AlgorithmTexts['topological-dfs'] = {
    name: 'Ordenación topológica por búsqueda en profundidad',
    shortName: 'Orden topológico (DFS)',
    tagline:
        'Descrito por Tarjan en 1976: inserta cada vértice al principio del resultado solo después de visitar todos los que dependen de él.',
    complexity: 'O(n + m)',
    constraints: [
        'Requiere un grafo dirigido',
        'Solo existe un orden topológico en un grafo acíclico',
        'Volver a encontrar una marca temporal revela un ciclo',
    ],
    reference: {
        idea: 'Alternativa basada en la búsqueda en profundidad, descrita por Tarjan en 1976. Cada vértice se inserta en el resultado solo después de todos los que dependen de él, y la inserción se hace al principio de la lista, de ahí el orden inverso.',
        pseudocode: [
            'Método por búsqueda en profundidad',
            '  1. para todo vértice v hacer Marca[v] ← 0',
            '  2. Orden_Top ← ∅',
            '  3. mientras exista algún vértice v tal que Marca[v] = 0',
            '     hacer Visita(v)',
            '',
            'Visita(v)',
            '  1. si Marca[v] ≠ 2 entonces   // si v no es permanente',
            '     a. si Marca[v] = 1 entonces CICLO   // marca temporal',
            '     b. Marca[v] ← 1                     // marca temporal',
            '     c. para todo vértice w ∈ Γ⁺(v) hacer Visita(w)',
            '     d. Marca[v] ← 2                     // marca permanente',
            '     e. Orden_Top.InsertarAlPrincipio(v)',
        ],
        invariant:
            'Cuando v recibe la marca permanente, todos los vértices alcanzables desde v ya están en Orden_Top. Como v se inserta al principio, los precede a todos en el orden.',
        pitfalls: [
            'Insertar al final en lugar de al principio: el orden sale invertido. El orden correcto es el inverso del orden de inserción, equivalente al orden decreciente de tiempo de finalización.',
            'No distinguir la marca temporal de la permanente: solo volver a encontrar una marca temporal revela un ciclo; la permanente indica un vértice ya resuelto.',
            'Confundirlo con el bosque de profundidad común: aquí lo que importa es el orden de finalización, no el árbol.',
        ],
    },
    trace: {
        marksTitle: 'Marcas de los vértices',
        markColumn: 'Marca[v]',
        markLabels: ['0 (sin marcar)', '1 (temporal)', '2 (permanente)'],
        callsTitle: 'Llamadas a Visita( )',
        initDescription:
            'Todos los vértices empiezan sin marcar, es decir, Marca[v] = 0, y el resultado Orden_Top empieza vacío.',
        cycleTitle: (vertex) => `Ciclo: ${vertex} ya tiene marca temporal`,
        cycleDescription: (vertex) =>
            `Se llamó a Visita(${vertex}) mientras Marca[${vertex}] = 1, es decir, el vértice todavía está en la cadena de llamadas actual. Esto significa que existe un camino de ${vertex} de vuelta a sí mismo: el grafo tiene un ciclo y no admite orden topológico.`,
        temporaryBadge: 'temp',
        visitTitle: (vertex) => `Visita(${vertex})`,
        visitDescription: (vertex) =>
            `${vertex} recibe marca temporal (Marca = 1) y su vecindad Γ⁺(${vertex}) pasa a visitarse.`,
        prependTitle: (vertex) => `${vertex} entra al principio de Orden_Top`,
        prependDescription: (vertex) =>
            `Todos los vértices que dependen de ${vertex} ya fueron visitados, así que recibe marca permanente (Marca = 2) y se inserta al principio del resultado, de ahí el orden inverso de inserción.`,
        impossibleTitle: 'Ordenación topológica imposible',
        impossibleDescription: (from, to) =>
            `La arista (${from}, ${to}) cierra un ciclo, porque ${to} todavía tenía marca temporal cuando se alcanzó de nuevo.`,
        cycleConclusion: (from, to) =>
            `El grafo tiene un ciclo: ${to} se alcanzó de nuevo con marca temporal desde ${from}.`,
        completeDescription: (order) =>
            `Todos los vértices recibieron marca permanente. Leyendo Orden_Top de principio a fin: ${order}.`,
        reverseConclusion:
            'Cada vértice se insertó al principio del resultado, así que el orden corresponde al inverso del orden de inserción, equivalente al orden decreciente de tiempo de finalización de la búsqueda en profundidad.',
        acyclicConclusion:
            'No se volvió a encontrar ninguna marca temporal, luego el grafo es acíclico. El orden topológico puede no ser único.',
    },
};
