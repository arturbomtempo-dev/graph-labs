import type { AlgorithmTexts } from '@/i18n/dictionaries';
import { plural } from '@/i18n/format';

const edgeKinds = {
    tree: 'Árbol (padre)',
    uncle: 'Tío',
    sibling: 'Hermano',
    cousin: 'Primo',
};

export const bfs: AlgorithmTexts['bfs'] = {
    name: 'Búsqueda en anchura',
    shortName: 'BFS',
    tagline:
        'Elige siempre el vértice marcado alcanzado hace más tiempo, usando una cola, y asigna a cada vértice su nivel.',
    complexity: 'O(n + m)',
    constraints: [
        'Acepta aristas dirigidas y no dirigidas',
        'Ignora los pesos de las aristas',
        'Clasifica las aristas en padre, tío, hermano y primo',
    ],
    reference: {
        idea: 'Búsqueda genérica en la que, entre todos los vértices marcados e incidentes a alguna arista aún no explorada, se elige siempre el alcanzado hace más tiempo, criterio que se implementa con una cola. Cada vértice recibe un índice L[v] (orden de descubrimiento) y un nivel[v] (distancia a la raíz en número de aristas).',
        pseudocode: [
            'Inicialización / Llamada inicial',
            '  t ← 0; Cola ← ∅',
            '  para todo vértice v ∈ V(G) hacer',
            '    L[v] ← 0; nivel[v] ← 0; padre[v] ← nulo',
            '  mientras exista algún vértice v tal que L[v] = 0 hacer',
            '    t ← t + 1; L[v] ← t          // v es la raíz de la búsqueda',
            '    Cola.Insertar(v)',
            '    Ejecutar Búsqueda_Anchura()',
            '',
            'Búsqueda_Anchura()',
            '  mientras not Cola.Vacía() hacer',
            '    v ← Cola.Quitar()',
            '    para todo vértice w ∈ Γ(v) hacer',
            '      si L[w] = 0 entonces       // arista de árbol (o padre)',
            '        padre[w] ← v; nivel[w] ← nivel[v] + 1',
            '        t ← t + 1; L[w] ← t; Cola.Insertar(w)',
            '      si no, si nivel[w] = nivel[v] + 1 entonces',
            '        Visitar arista de tío {v, w}',
            '      si no, si nivel[w] = nivel[v] y padre[v] = padre[w] y L[w] > L[v] entonces',
            '        Visitar arista de hermano {v, w}',
            '      si no, si nivel[w] = nivel[v] y padre[v] ≠ padre[w] y L[w] > L[v] entonces',
            '        Visitar arista de primo {v, w}',
        ],
        invariant:
            'nivel[w] = nivel[padre[w]] + 1 para todo w ≠ raíz. Así, en el momento en que w se marca, nivel[w] ya es la distancia (número de aristas) entre la raíz de la búsqueda y w.',
        pitfalls: [
            'Marcar el vértice (asignar L[w]) solo cuando sale de la cola, y no cuando entra: el mismo vértice terminaría encolado varias veces.',
            'Olvidar la condición L[w] > L[v] al clasificar aristas de hermano y de primo: garantiza que cada arista se explore una sola vez.',
            'En un grafo ponderado, la búsqueda en anchura solo devuelve un camino de peso mínimo si todos los pesos son iguales; minimiza el número de aristas, no el peso.',
        ],
    },
    trace: {
        attributesTitle: 'Índice, nivel y padre',
        levelColumn: 'nivel',
        edgeKinds,
        levelBadge: (level) => `nivel ${level}`,
        initDescription:
            'Todos los vértices empiezan sin marcar: L[v] = 0, nivel[v] = 0 y padre[v] = nulo. El contador global t empieza en 0.',
        rootTitle: (vertex) => `Raíz de la búsqueda: ${vertex}`,
        newRootTitle: (vertex) => `Nueva raíz: ${vertex}`,
        rootDescription: (vertex, index) =>
            `${vertex} es la raíz de la búsqueda: recibe L = ${index}, nivel 0 y entra en la cola.`,
        newRootDescription: (vertex) =>
            `${vertex} sigue con L = 0 tras la búsqueda anterior, así que inicia un nuevo árbol de anchura con nivel 0.`,
        dequeueTitle: (vertex) => `Quita ${vertex} de la cola`,
        dequeueDescription: (vertex, level) =>
            `${vertex} sale de la cola (nivel ${level}) y su vecindad Γ(${vertex}) pasa a examinarse en orden alfabético.`,
        treeEdgeTitle: (from, to) => `Arista de árbol (padre) {${from}, ${to}}`,
        treeEdgeDescription: (from, to, level, index) =>
            `${to} tenía L = 0, por lo que se visita por primera vez: padre[${to}] = ${from}, nivel = nivel[${from}] + 1 = ${level} y L = ${index}. El vértice entra en la cola.`,
        uncleReason: (from, to) => `nivel[${to}] = nivel[${from}] + 1, pero padre[${to}] ≠ ${from}`,
        sameLevelReason: (from, to, sameParent) =>
            `nivel[${to}] = nivel[${from}] y padre[${from}] ${sameParent ? '=' : '≠'} padre[${to}]`,
        classifiedTitle: (kind) => `Arista de ${edgeKinds[kind].toLowerCase()}`,
        classifiedDescription: (from, to, reason, kind) =>
            `${to} ya estaba marcado, y ${reason}. Por lo tanto, {${from}, ${to}} es una arista de ${edgeKinds[kind].toLowerCase()} y no pertenece al árbol de anchura.`,
        exploredTitle: (vertex) => `${vertex} explorado`,
        exploredDescription: (vertex) =>
            `Todas las aristas incidentes a ${vertex} se han explorado, así que el vértice queda explorado.`,
        completeWithUnreachable: (count) =>
            `La cola está vacía. ${count} ${plural(count, 'vértice no fue alcanzado', 'vértices no fueron alcanzados')} desde la raíz, así que la búsqueda produjo más de un árbol de anchura.`,
        completeAll: 'La cola está vacía y todos los vértices fueron alcanzados desde la raíz.',
        visitOrderConclusion: (order) => `Orden de visita: ${order}.`,
        treeConclusion: (count) =>
            `El árbol de anchura está formado por todos los vértices y por las aristas de árbol (o padre), ${count} en total. nivel[v] es la distancia, en número de aristas, entre la raíz de la búsqueda y v.`,
        unreachableConclusion: (root, vertices) =>
            `No alcanzados desde ${root}: ${vertices}. Cada uno de ellos inició un nuevo árbol de anchura.`,
        singleTreeConclusion:
            'Todos los vértices fueron alcanzados desde la raíz: la búsqueda produjo un único árbol de anchura.',
    },
};
