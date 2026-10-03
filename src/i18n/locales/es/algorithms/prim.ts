import type { AlgorithmTexts } from '@/i18n/dictionaries';
import { plural } from '@/i18n/format';

export const prim: AlgorithmTexts['prim'] = {
    name: 'Algoritmo de Prim',
    shortName: 'Prim',
    tagline:
        'Incluye vértices uno a uno: en cada paso añade la arista de menor peso entre V(T) y los vértices aún no seleccionados.',
    complexity: 'O(m log n)',
    constraints: [
        'Requiere un grafo no dirigido',
        'Requiere un grafo ponderado con peso w(e) > 0',
        'Solo existe árbol de expansión si el grafo es conexo',
    ],
    reference: {
        idea: 'Construye el árbol de expansión mínima (AEM) de forma voraz, incluyendo los vértices uno a uno. Partiendo de una raíz r, en cada paso añade la arista de menor peso con un extremo en V(T) (ya seleccionados) y el otro fuera de V(T).',
        pseudocode: [
            'Algoritmo de Prim',
            '  1. Elegir un vértice cualquiera r ∈ V(G)   // raíz',
            '  2. V(T) ← { r }        // conj. de vértices seleccionados',
            '  3. E(T) ← ∅            // conj. de aristas del AEM',
            '  4. mientras V(T) ≠ V(G) hacer',
            '     a. Encontrar la arista {v, w} de menor peso tal que',
            '        v ∈ V(T) y w ∉ V(T)',
            '     b. Añadir w a V(T)',
            '     c. Añadir {v, w} a E(T)',
            '',
            '  Peso total: C(T) = Σ  w  , para e ∈ E(T)',
            '                         e',
        ],
        invariant:
            'En cada iteración, T = (V(T), E(T)) es un árbol y está contenido en algún árbol de expansión mínima de G.',
        pitfalls: [
            'Comparar el peso de la arista con la distancia acumulada desde la raíz en lugar del peso de la propia arista, lo que convertiría a Prim en Dijkstra.',
            'Aplicar Prim a un grafo dirigido: el problema correcto pasa a ser el de la arborescencia de peso mínimo.',
            'Un grafo no conexo no tiene árbol de expansión: un grafo G tiene árbol de expansión si y solo si G es conexo.',
        ],
    },
    trace: {
        keysTitle: 'Menor peso hasta V(T)',
        vertexColumn: 'Vértice w',
        minWeightColumn: 'menor peso',
        inTreeStatus: 'en V(T)',
        outsideTreeStatus: 'fuera de V(T)',
        initDescription: (root) =>
            `Se eligió la raíz ${root}: V(T) = { ${root} } y E(T) = ∅. Ningún otro vértice tiene aún una arista conocida hasta V(T), por eso su menor peso es ∞.`,
        disconnectedTitle: 'Grafo no conexo',
        disconnectedDescription:
            'No existe ninguna arista entre V(T) y los vértices restantes: el grafo no es conexo. Como un grafo solo tiene árbol de expansión si es conexo, el resultado cubre solo la componente conexa de la raíz.',
        addTitle: (vertex) => `Añade ${vertex} a V(T)`,
        addDescription: (from, to, weight) =>
            `La arista de menor peso con un extremo en V(T) y el otro fuera es {${from}, ${to}}, de peso ${weight}. Se añade a E(T) y ${to} pasa a pertenecer a V(T).`,
        rootDescription: (vertex) =>
            `${vertex} es la raíz r e inicia V(T), todavía sin ninguna arista en E(T).`,
        candidateTitle: (vertex) => `Nueva arista candidata para ${vertex}`,
        candidateDescription: (from, to, weight, previous) =>
            `La arista {${from}, ${to}} tiene peso ${weight}, menor que el menor peso conocido hasta ahora (${previous}). Pasa a ser la candidata para unir ${to} a V(T).`,
        keepTitle: (vertex) => `Mantiene la candidata de ${vertex}`,
        keepDescription: (from, to, weight, previous) =>
            `La arista {${from}, ${to}} tiene peso ${weight}, que no es menor que el menor peso ya conocido (${previous}).`,
        completeTitle: 'AEM completado',
        completeDescription: (edges, total) =>
            `V(T) = V(G) y el árbol tiene ${edges} ${plural(edges, 'arista', 'aristas')}, con peso total C(T) = ${total}.`,
        totalConclusion: (total) => `Peso total del árbol de expansión mínima: C(T) = ${total}.`,
        edgesConclusion: (edges, vertices) =>
            `|E(T)| = ${edges}. Un árbol de expansión de ${vertices} ${plural(vertices, 'vértice', 'vértices')} tiene exactamente |V| − 1 = ${Math.max(vertices - 1, 0)} ${plural(Math.max(vertices - 1, 0), 'arista', 'aristas')}.`,
        disconnectedConclusion:
            'El grafo no es conexo, así que el resultado es el AEM solo de la componente conexa que contiene a la raíz.',
        spanningConclusion:
            'Todos los vértices fueron seleccionados: T es un árbol de expansión de G.',
    },
};
