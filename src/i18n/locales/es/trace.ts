import type { Dictionary } from '@/i18n/dictionaries';
import { plural } from '@/i18n/format';

export const trace: Dictionary['trace'] = {
    columns: {
        vertex: 'Vértice',
        edge: 'Arista',
        type: 'Tipo',
        status: 'Estado',
        component: 'Componente',
        vertices: 'Vértices',
        weight: 'Peso',
        decision: 'Decisión',
        parent: 'padre',
    },
    initialization: 'Inicialización',
    visitOrder: 'Orden de visita',
    queue: 'Cola',
    edgeClassification: 'Clasificación de las aristas',
    searchComplete: 'Búsqueda completada',
    issues: {
        addVertex: 'Añade al menos un vértice al grafo.',
        addEdge: 'Añade al menos una arista al grafo.',
        selectRoot: 'Selecciona el vértice raíz.',
        directedOnly: (method) =>
            `${method} trabaja sobre grafos dirigidos: convierte todas las aristas en dirigidas.`,
        undirectedOnly: (method) =>
            `${method} trabaja sobre grafos no dirigidos: convierte todas las aristas en no dirigidas.`,
    },
    shortestPath: {
        tableTitle: 'dist y pred',
        relaxedTitle: (from, to) => `Arista tensa (${from}, ${to}): relajada`,
        relaxedDescription: (values) =>
            `dist[${values.to}] = ${values.current} > dist[${values.from}] + d = ${values.fromDistance} + ${values.weight} = ${values.candidate}. Por lo tanto, dist[${values.to}] ← ${values.candidate} y pred[${values.to}] ← ${values.from}.`,
        doneTitle: 'Caminos mínimos calculados',
        finalDistances: (root, distances) => `dist[ ] final desde ${root}: ${distances}.`,
        pathConclusion: (target, path, weight) =>
            `Camino mínimo hasta ${target}, obtenido con pred[ ]: ${path} (peso ${weight}).`,
    },
    spanningTree: {
        edgesMetric: 'Aristas en E(T)',
        totalWeightMetric: 'Peso total C(T)',
    },
    flow: {
        issues: {
            selectSource: 'Selecciona el vértice fuente s.',
            selectSink: 'Selecciona el vértice sumidero t.',
            distinctEndpoints: 'La fuente s y el sumidero t deben ser vértices distintos.',
            directedOnly:
                'Una red de flujo es un grafo dirigido: convierte todas las aristas en dirigidas.',
            positiveCapacity: 'En una red de flujo, toda arista tiene capacidad u(e) > 0.',
        },
        residualTable: { title: 'Flujo y capacidades residuales', edge: 'Arista e' },
        flowValue: 'Valor del flujo',
        cutCapacity: 'Capacidad del corte(S)',
        maxFlowConclusion: (source, sink, value) =>
            `Flujo máximo entre s = ${source} y t = ${sink}: ${value}.`,
        cutConclusion: (edges, capacity) =>
            `Corte s-t mínimo: corte(S) = { ${edges} }, de capacidad ${capacity}, igual al valor del flujo máximo, como afirma el teorema de flujo máximo y corte mínimo.`,
        limitHint: 'Se alcanzó el límite de iteraciones: revisa las capacidades de la red.',
        augmenting: {
            initialTitle: "Red residual inicial G'(f)",
            initialDescription: (source, sink) =>
                `f(e) = 0 para toda arista, así que la capacidad residual de cada arista directa es u_r(e) = u(e) − f(e) = u(e). La fuente es s = ${source}, el sumidero es t = ${sink} y los demás vértices son nodos internos.`,
            noPathTitle: "No existe camino aumentante en G'(f)",
            noPathDescription: (reachable) =>
                `En G'(f), desde s solo se alcanza S = { ${reachable} }. Ese es el conjunto S del corte s-t mínimo, y las aristas de corte(S), con un extremo en S y el otro fuera, están resaltadas en rojo.`,
            augmentingPaths: 'Caminos aumentantes',
            pathTitle: (iteration, path) => `Camino aumentante ${iteration}: ${path}`,
            bottleneckSentence: (value) =>
                `El cuello de botella es δ = min { u_r(e) | e ∈ P } = ${value}.`,
            bottleneck: 'Cuello de botella δ',
            edgesInPath: 'Aristas en P',
            augmentedTitle: (value) => `Flujo aumentado en δ = ${value}`,
            augmentedDescription: (value, total) =>
                `En las aristas directas de P se hace f(v, w) ← f(v, w) + δ; en las inversas, f(w, v) ← f(w, v) − δ. Cada arista directa pierde ${value} de capacidad residual y su inversa gana la misma cantidad, lo que permite deshacer el envío en iteraciones futuras. El valor del flujo pasa a ser ${total}.`,
            pathsConclusion: (method, count, paths) =>
                `${method} usó ${count} ${plural(count, 'camino aumentante', 'caminos aumentantes')}: ${paths}.`,
            limitConclusion: (value, iterations) =>
                `Valor del flujo alcanzado: ${value} tras ${iterations} ${plural(iterations, 'iteración', 'iteraciones')}.`,
        },
    },
    coloring: {
        tableTitle: 'Colores asignados',
        colorColumn: 'color(v)',
        colorsUsed: 'Colores usados',
        badge: (color) => `color ${color}`,
        colorTitle: (vertex, color) => `${vertex} recibe el color ${color}`,
        completeTitle: 'Coloración completada',
        undirectedOnly:
            'La coloración de vértices está definida para grafos no dirigidos: convierte todas las aristas en no dirigidas.',
        boundConclusion: (maxDegree) =>
            `Δ(G) = ${maxDegree}, y siempre se cumple χ(G) ≤ Δ(G) + 1 = ${maxDegree + 1}.`,
    },
    topological: {
        undirectedIssue:
            'No se puede establecer un orden topológico en un grafo no dirigido: convierte todas las aristas en dirigidas.',
        result: 'Orden_Top',
        completeTitle: 'Ordenación topológica completada',
        orderConclusion: (order) => `Orden topológico: ${order}.`,
        cycleConclusion:
            'Un grafo con un ciclo no admite orden topológico, porque no se puede establecer una relación de precedencia entre los vértices del ciclo.',
    },
};
