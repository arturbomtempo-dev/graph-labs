import type { AlgorithmTexts } from '@/i18n/dictionaries';
import { plural } from '@/i18n/format';

const edgeKinds = {
    tree: 'Árbol',
    back: 'Retroceso',
    forward: 'Avance',
    cross: 'Cruce',
};

export const dfs: AlgorithmTexts['dfs'] = {
    name: 'Búsqueda en profundidad',
    shortName: 'DFS',
    tagline:
        'Elige siempre el vértice marcado alcanzado más recientemente y registra un tiempo de descubrimiento TD y un tiempo de finalización TF.',
    complexity: 'O(n + m)',
    constraints: [
        'Acepta aristas dirigidas y no dirigidas',
        'Grafo no dirigido: aristas de árbol y de retroceso',
        'Grafo dirigido: árbol, retroceso, avance y cruce',
    ],
    reference: {
        idea: 'Búsqueda genérica en la que, entre todos los vértices marcados e incidentes a alguna arista aún no explorada, se elige siempre el alcanzado más recientemente. Cada vértice recibe un tiempo de descubrimiento TD[v] y un tiempo de finalización TF[v], marcados por un contador global t.',
        pseudocode: [
            'Inicialización / Llamada inicial',
            '  t ← 0',
            '  para todo vértice v ∈ V(G) hacer',
            '    TD[v] ← 0; TF[v] ← 0; padre[v] ← nulo',
            '  mientras exista algún vértice v tal que TD[v] = 0 hacer',
            '    Ejecutar Búsqueda_Profundidad(v)   // v es la raíz de la búsqueda',
            '',
            'Búsqueda_Profundidad(v)               // grafo no dirigido',
            '  t ← t + 1; TD[v] ← t',
            '  para todo vértice w ∈ Γ(v) hacer',
            '    si TD[w] = 0 entonces           // arista de árbol',
            '      padre[w] ← v; Ejecutar Búsqueda_Profundidad(w)',
            '    si no, si TF[w] = 0 y w ≠ padre[v] entonces',
            '      Visitar arista de retroceso {v, w}',
            '  t ← t + 1; TF[v] ← t',
            '',
            'Búsqueda_Profundidad(v)               // grafo dirigido',
            '  para todo vértice w ∈ Γ⁺(v) hacer',
            '    si TD[w] = 0 entonces  arista de árbol (v, w); padre[w] ← v; ...',
            '    si no, si TF[w] = 0 entonces       arista de retroceso (v, w)',
            '    si no, si TD[v] < TD[w] entonces   arista de avance (v, w)',
            '    si no                              arista de cruce (v, w)',
        ],
        invariant:
            'Los intervalos de vida I(v) = [TD[v], TF[v]] están anidados o son disjuntos; nunca se superponen parcialmente. El vértice w es descendiente de v si y solo si I(w) está contenido en I(v).',
        pitfalls: [
            'En un grafo no dirigido solo existen aristas de árbol y de retroceso; las de avance y de cruce solo aparecen en grafos dirigidos.',
            'Olvidar la condición w ≠ padre[v]: la arista usada para llegar a v no es una arista de retroceso.',
            'Toda arista de retroceso revela un ciclo en el grafo original. En un grafo dirigido, es la única evidencia necesaria.',
        ],
    },
    trace: {
        timesTitle: 'Tiempos de descubrimiento y de finalización',
        discoveryColumn: 'TD',
        finishColumn: 'TF',
        edgeKinds,
        stackTitle: 'Pila de recursión',
        initDescription:
            'Todos los vértices empiezan sin marcar (blancos): TD[v] = 0, TF[v] = 0 y padre[v] = nulo. El contador global t empieza en 0.',
        discoverTitle: (vertex) => `Descubre ${vertex}`,
        discoverDescription: (vertex, time) =>
            `${vertex} pasa a estar marcado (gris) con TD = ${time} y entra en la pila de recursión.`,
        treeEdgeTitle: (pair) => `Arista de árbol ${pair}`,
        treeEdgeDescription: (from, to) =>
            `TD[${to}] = 0, es decir, ${to} se visita por primera vez: padre[${to}] = ${from} y la búsqueda profundiza por esta arista.`,
        returnTitle: (vertex) => `Vuelve a ${vertex}`,
        returnDescription: (vertex) =>
            `La llamada recursiva terminó; la búsqueda vuelve a examinar los vecinos de ${vertex}.`,
        backReasonDirected: (from, to) => `TF[${to}] = 0, luego ${to} es ancestro de ${from}`,
        forwardReason: (from, to) =>
            `TD[${from}] < TD[${to}], luego ${to} es descendiente de ${from} sin ser su hijo`,
        crossReason: (from, to) => `${to} no es descendiente ni ancestro de ${from}`,
        backReasonUndirected: (from, to) =>
            `TF[${to}] = 0 y ${to} ≠ padre[${from}], luego ${to} es ancestro de ${from} sin ser su padre`,
        classifiedTitle: (kind) => `Arista de ${edgeKinds[kind].toLowerCase()}`,
        classifiedDescription: (reason, pair, kind) =>
            `${reason}. Por lo tanto, ${pair} se clasifica como arista de ${edgeKinds[kind].toLowerCase()}.`,
        exploredTitle: (vertex) => `${vertex} explorado`,
        exploredDescription: (vertex, discovery, finish) =>
            `Se examinó toda la vecindad de ${vertex}: el vértice pasa a explorado (negro) con TF = ${finish}. Su intervalo de vida es I(${vertex}) = [${discovery}, ${finish}].`,
        newRootTitle: (vertex) => `Nueva raíz: ${vertex}`,
        newRootDescription: (vertex) =>
            `TD[${vertex}] = 0 tras la búsqueda anterior, así que ${vertex} pasa a ser la raíz de un nuevo árbol de profundidad.`,
        completeDescription: (treeEdges) =>
            `Todos los vértices están explorados. ${plural(treeEdges, `La ${treeEdges} arista de árbol forma`, `Las ${treeEdges} aristas de árbol forman`)} el bosque de profundidad.`,
        visitOrderConclusion: (order) => `Orden de visita: ${order}.`,
        countsConclusion: (treeEdges, backEdges) =>
            `Aristas de árbol: ${treeEdges}. Aristas de retroceso: ${backEdges}.`,
        cycleConclusion:
            'Las aristas de retroceso siempre representan un ciclo en el grafo original.',
        acyclicConclusion: 'No hay aristas de retroceso, luego el grafo es acíclico.',
        intervalsConclusion:
            'Los intervalos de vida I(v) = [TD[v], TF[v]] están anidados: w es descendiente de v si y solo si I(w) está contenido en I(v).',
    },
};
