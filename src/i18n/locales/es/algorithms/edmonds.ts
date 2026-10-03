import type { AlgorithmTexts } from '@/i18n/dictionaries';
import { plural } from '@/i18n/format';

export const edmonds: AlgorithmTexts['edmonds'] = {
    name: 'Algoritmo de Edmonds',
    shortName: 'Edmonds',
    tagline:
        'Busca caminos M-aumentantes entre vértices expuestos, contrayendo las flores (blossoms) que aparecen, hasta que no quede ninguno.',
    complexity: 'O(n² · m)',
    constraints: [
        'Requiere un grafo no dirigido',
        'Ignora los pesos de las aristas',
        'Trata grafos generales, no solo bipartitos',
    ],
    reference: {
        idea: 'Por el teorema de Berge, M tiene cardinalidad máxima si y solo si no existe ningún camino M-aumentante. El algoritmo busca esos caminos en un bosque M-alternante; cuando una arista une dos vértices a distancia par del mismo árbol, aparece un ciclo impar, la flor (blossom), que se contrae en un pseudovértice.',
        pseudocode: [
            'Emparejamiento_Máximo(G)',
            '  1. M ← ∅',
            '  2. P ← Buscar_Camino_Aumentante(G, M)',
            '  3. mientras (P ≠ ∅) hacer',
            '     a. M ← M ⊕ EP',
            '     b. P ← Buscar_Camino_Aumentante(G, M)',
            '',
            'Buscar_Camino_Aumentante(G, M)',
            '  1. F ← Inicializar_Bosque_Alternante(G, M)',
            '  2. para todo vértice sin marcar v ∈ F tal que',
            '     dist(v, F.raíz[v]) sea par hacer',
            '     a. mientras ∃ arista e = {v, w} sin marcar hacer',
            '        i.   si w ∉ F entonces Añadir_al_Bosque(M, F, v, w)',
            '        ii.  si no, si dist(w, F.raíz[w]) es par entonces',
            '               devolver Obtener_Nuevo_Camino(G, M, F, v, w)',
            '        iii. Marcar la arista e',
            '     b. Marcar el vértice v',
            '  3. devolver ∅',
            '',
            'Obtener_Nuevo_Camino(G, M, F, v, w)',
            '  1. si F.raíz[v] ≠ F.raíz[w] entonces',
            '       P ← ObtenerCamino(F, F.raíz[v], v)',
            '            + ObtenerCamino(F, w, F.raíz[w])',
            '  2. si no                          // flor (blossom)',
            '     a. B ← ObtenerCamino(F, v, w) + v',
            '     b. G′ ← Contraer_Flor_Grafo(G, B, z)',
            '     c. M′ ← Contraer_Flor_Emparejamiento(M, B, z)',
            '     d. P ← Buscar_Camino_Aumentante(G′, M′)',
            '     e. si z ∈ P entonces P ← Expandir_Flor(P, G, B, z)',
            '  3. devolver P',
        ],
        invariant:
            'M ⊕ EP es siempre un emparejamiento con una arista más que M. Por el teorema de Edmonds, M es máximo en G si y solo si M/B es máximo en G/B, lo que justifica la contracción de las flores.',
        pitfalls: [
            'Usar solo búsqueda en anchura o en profundidad en un grafo general: sin tratar las flores, caminos M-aumentantes existentes dejan de encontrarse.',
            'Ignorar la arista {v, w} cuando dist(w, F.raíz[w]) es impar: no genera un camino aumentante.',
            'Confundir emparejamiento maximal con máximo: maximal solo significa que no admite añadir más aristas; máximo es el de mayor cardinalidad. Y un emparejamiento máximo no implica un emparejamiento perfecto.',
        ],
    },
    issues: {
        undirectedOnly:
            'El emparejamiento está definido para grafos no dirigidos: convierte todas las aristas en no dirigidas.',
    },
    trace: {
        matchingTitle: 'Emparejamiento M',
        partnerColumn: 'Pareja en M',
        exposedStatus: 'expuesto',
        coveredStatus: 'cubierto',
        exposedMetric: 'Vértices expuestos',
        initTitle: 'Inicialización: M = ∅',
        initDescription:
            'El emparejamiento empieza vacío, así que todos los vértices están expuestos (libres). Mientras exista un camino M-aumentante, M puede crecer.',
        blossomBadge: (base) => `flor ${base}`,
        blossomTitle: (base) => `Flor detectada y contraída en ${base}`,
        blossomDescription: (edge, members, base) =>
            `La arista ${edge} une dos vértices a distancia par de la raíz del mismo árbol y forma un ciclo de longitud impar. La flor { ${members} } se contrae en un pseudovértice con base ${base}; todos sus vértices pasan a contar como pares.`,
        augmentingTitle: (vertex) => `Camino M-aumentante encontrado hasta ${vertex}`,
        augmentingDescription: (vertex, root) =>
            `${vertex} está expuesto y se alcanzó por un camino M-alternante que parte de la raíz expuesta ${root}. Como el camino empieza y termina en vértices expuestos, es M-aumentante, y todo camino M-aumentante tiene longitud impar.`,
        growTitle: (from, to, partner) =>
            `El bosque crece por {${from}, ${to}} y {${to}, ${partner}} ∈ M`,
        growDescription: (from, to, partner) =>
            `${to} todavía no estaba en el bosque. La arista {${from}, ${to}} entra en el árbol y, junto con ella, la arista {${to}, ${partner}} de M. ${to} queda a distancia impar de la raíz y ${partner} a distancia par, por lo que la búsqueda puede continuar desde él.`,
        rootBadge: 'raíz',
        treeTitle: (root) => `Árbol M-alternante con raíz en ${root}`,
        treeDescription: (root) =>
            `${root} está expuesto, así que se inicia en él un árbol M-alternante. La búsqueda procura un camino M-alternante que termine en otro vértice expuesto.`,
        noPathTitle: (root) => `Ningún camino M-aumentante desde ${root}`,
        noPathDescription: (root) =>
            `El árbol M-alternante con raíz en ${root} se exploró por completo sin alcanzar otro vértice expuesto. ${root} sigue expuesto en el emparejamiento final.`,
        augmentTitle: (size) => `M ← M ⊕ EP, con |M| = ${size}`,
        augmentDescription: (edges, root, endpoint) =>
            `La diferencia simétrica quita de M las aristas del camino que estaban en M y añade las que no estaban. Las aristas de M a lo largo del camino pasan a ser ${edges}, y ${root} y ${endpoint} dejan de estar expuestos. Por el teorema de Berge, M creció exactamente en una arista.`,
        maximumTitle: 'Emparejamiento máximo obtenido',
        maximumDescription: (size) =>
            `Ya no existe ningún camino M-aumentante en G, así que, por el teorema de Berge, M tiene cardinalidad máxima: |M| = ${size}.`,
        matchingConclusion: (size, pairs) => `Emparejamiento máximo con |M| = ${size}: ${pairs}.`,
        augmentationsConclusion: (count) =>
            `Se ${plural(count, 'realizó', 'realizaron')} ${count} ${plural(count, 'aumento', 'aumentos')} a partir de M = ∅. Cada camino M-aumentante encontrado aumenta |M| exactamente en una unidad.`,
        perfectConclusion:
            'Todos los vértices están cubiertos, así que M es un emparejamiento perfecto (o completo).',
        exposedConclusion: (count, vertices) =>
            `${plural(count, 'Queda', 'Quedan')} ${count} ${plural(count, 'vértice expuesto', 'vértices expuestos')} (${vertices}): un emparejamiento máximo no implica que todos los vértices estén saturados.`,
    },
};
