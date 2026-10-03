import type { AlgorithmTexts } from '@/i18n/dictionaries';
import { joinList, plural } from '@/i18n/format';

export const fleury: AlgorithmTexts['fleury'] = {
    name: 'Algoritmo de Fleury',
    shortName: 'Fleury',
    tagline:
        'Construye un camino euleriano recorriendo el grafo y evitando cruzar un puente mientras haya otra arista disponible.',
    complexity: 'O(m² )',
    constraints: [
        'Requiere un grafo no dirigido y conexo',
        'Como máximo 2 vértices de grado impar',
        'Ignora los pesos de las aristas',
    ],
    reference: {
        idea: 'Un grafo conexo es euleriano si y solo si todos sus vértices tienen grado par (teorema de Euler), y semieuleriano si existen exactamente dos vértices de grado impar. El algoritmo recorre el grafo eliminando las aristas recorridas y evita cruzar un puente mientras haya otra opción.',
        pseudocode: [
            'Algoritmo de Fleury',
            '  1. si V(G) tiene 3 o más vértices de grado impar entonces PARAR',
            "  2. Sea G' = (V', E') tal que V' ← V(G) y E' ← E(G)",
            "  3. Seleccionar un vértice inicial v ∈ V'",
            '       (elegir un v de grado impar, si lo hay)',
            "  4. mientras E' ≠ ∅ hacer",
            '     a. si d(v) > 1 entonces',
            "          Seleccionar una arista {v, w} que no sea puente en G'",
            '        si no',
            "          Seleccionar la única arista {v, w} disponible en G'",
            "     c. v ← w;   E' ← E' − {v, w}",
            '',
            '  // Caminar de v a w y eliminar la arista recorrida',
        ],
        invariant:
            "El camino construido nunca repite aristas y, al evitar puentes, mantiene conexas las aristas restantes de G', lo que garantiza que el recorrido solo termine cuando todas hayan sido recorridas.",
        pitfalls: [
            'Cruzar un puente mientras existe otra arista disponible: las aristas del otro lado quedan inalcanzables y el camino termina antes de tiempo.',
            'Empezar por un vértice de grado par en un grafo semieuleriano: el camino debe partir de uno de los dos vértices de grado impar.',
            'Confundirlo con un grafo hamiltoniano: un camino euleriano pasa una vez por cada arista; uno hamiltoniano, una vez por cada vértice.',
        ],
    },
    issues: {
        undirectedOnly:
            'El algoritmo de Fleury está definido para grafos no dirigidos: convierte todas las aristas en no dirigidas.',
        tooManyOdd: (vertices) =>
            `El grafo tiene ${vertices.length} vértices de grado impar (${vertices.join(', ')}). Un grafo conexo es euleriano si todos los grados son pares y semieuleriano si hay exactamente dos vértices de grado impar.`,
        disconnected:
            'El grafo no es conexo: el teorema de Euler exige un grafo conexo para que exista un camino o circuito euleriano.',
        mustStartAtOdd: (vertices) =>
            `Con vértices de grado impar, el camino euleriano debe empezar en uno de ellos: ${joinList(vertices, 'o')}.`,
    },
    trace: {
        remainingTitle: "Aristas restantes en E'",
        traversedStatus: (position) => `recorrida (${position}.ª)`,
        pendingStatus: "en E'",
        degreesTitle: "Grados en G'",
        degreeInRemaining: "d(v) en G'",
        degreeInOriginal: 'd(v) en G',
        trailLabel: 'Camino',
        startBadge: 'inicio',
        endBadge: 'fin',
        initTitle: (vertex) => `Inicialización: vértice inicial ${vertex}`,
        initEulerian: (vertex) =>
            `Todos los vértices tienen grado par, así que el grafo es euleriano y existe un circuito euleriano. G' empieza igual a G y el recorrido parte de ${vertex}, elegido libremente.`,
        initSemiEulerian: (oddVertices, start) =>
            `Hay exactamente ${oddVertices.length} vértices de grado impar (${oddVertices.join(', ')}), así que el grafo es semieuleriano. El recorrido debe partir de uno de ellos: ${start}.`,
        onlyEdgeReason: (vertex) =>
            `${vertex} tiene una sola arista disponible en G', así que se recorre aunque sea un puente.`,
        avoidBridgesReason: (available, bridges, chosen) =>
            `Entre las ${available} aristas disponibles, ${bridges.join(', ')} ${plural(bridges.length, 'es puente', 'son puentes')} en G' y ${plural(bridges.length, 'se evita', 'se evitan')}. Se elige ${chosen}, que no es puente.`,
        noBridgesReason: (available, chosen) =>
            `Ninguna de las ${available} aristas disponibles es puente en G', así que cualquiera sirve. Se elige ${chosen}.`,
        allBridgesReason:
            "Todas las aristas disponibles son puentes en G', así que hay que recorrer una de ellas.",
        analyzeTitle: (vertex) => `Analiza las aristas incidentes a ${vertex}`,
        walkTitle: (vertex) => `Camina hacia ${vertex}`,
        walkDescription: (vertex, remaining) =>
            `La arista se recorre y se elimina de E': v ← ${vertex}. ${plural(remaining, 'Queda', 'Quedan')} ${remaining} ${plural(remaining, 'arista', 'aristas')} en G'.`,
        circuitTitle: 'Circuito euleriano obtenido',
        trailTitle: 'Camino euleriano obtenido',
        interruptedTitle: 'Recorrido interrumpido',
        completeDescription: (total) =>
            `E' quedó vacío: las ${total} aristas se recorrieron exactamente una vez.`,
        interruptedDescription: (remaining) =>
            `El recorrido terminó con ${remaining} ${plural(remaining, 'arista', 'aristas')} aún en E'.`,
        trailConclusion: (closed, trail) =>
            `${closed ? 'Circuito' : 'Camino'} euleriano: ${trail}.`,
        countConclusion: (used, total) =>
            `Se ${plural(used, 'recorrió', 'recorrieron')} ${used} de ${total} ${plural(total, 'arista', 'aristas')}, cada una exactamente una vez.`,
        eulerianConclusion:
            'Todos los vértices tienen grado par, así que el grafo es euleriano: el camino es cerrado y empieza y termina en el mismo vértice.',
        semiEulerianConclusion: (oddVertices) =>
            `El grafo tiene exactamente dos vértices de grado impar (${joinList(oddVertices, 'y')}), así que es semieuleriano: el camino es abierto y empieza y termina en ellos.`,
    },
};
