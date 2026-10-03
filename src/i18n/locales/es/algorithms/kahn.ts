import type { AlgorithmTexts } from '@/i18n/dictionaries';
import { plural } from '@/i18n/format';

export const kahn: AlgorithmTexts['kahn'] = {
    name: 'Algoritmo de Kahn',
    shortName: 'Kahn',
    tagline:
        'En cada paso toma un vértice con grado de entrada cero, lo añade al final del resultado y reduce el grado de entrada de sus sucesores.',
    complexity: 'O(n + m)',
    constraints: [
        'Requiere un grafo dirigido',
        'Solo existe un orden topológico en un grafo acíclico',
        'Detecta la existencia de un ciclo',
    ],
    reference: {
        idea: 'En cada paso determina un vértice sin aristas de entrada, es decir, con d⁻(v) = 0, y lo inserta al final del resultado. En lugar de eliminar las aristas, mantiene y actualiza un mapa M con el grado de entrada de cada vértice.',
        pseudocode: [
            'Algoritmo de Kahn',
            '  1. para todo vértice v hacer M[v] ← d⁻(v)',
            '  2. Cola ← ∅; Orden_Top ← ∅',
            '  3. para todo vértice v tal que d⁻(v) = 0 hacer',
            '       Cola.Insertar(v)',
            '  4. mientras not Cola.Vacía() hacer',
            '     a. v ← Cola.Quitar()',
            '     b. Orden_Top.InsertarAlFinal(v)',
            '     c. para todo vértice w ∈ Γ⁺(v) hacer',
            '        i.  M[w] ← M[w] − 1',
            '        ii. si M[w] = 0 entonces Cola.Insertar(w)',
            '  5. Si se procesaron todos los vértices, ÉXITO;',
            '     en otro caso, existe un CICLO',
        ],
        invariant:
            'Un vértice solo entra en la cola cuando todos sus predecesores ya están en Orden_Top, así que ord(v) < ord(w) para toda arista (v, w) ∈ E(G).',
        pitfalls: [
            'Aplicarlo a un grafo no dirigido o con ciclos: no se puede establecer una relación de precedencia y el orden topológico no existe.',
            'Interpretar la cola vacía con vértices pendientes como un error: es exactamente así como el algoritmo detecta la existencia de un ciclo.',
            'Suponer que el orden es único: un grafo acíclico dirigido puede tener varios órdenes topológicos válidos.',
        ],
    },
    trace: {
        degreesTitle: 'Mapa de grados de entrada M',
        positionStatus: (position) => `posición ${position}`,
        queuedStatus: 'en la cola',
        waitingStatus: 'en espera',
        initDescription:
            'M[v] recibe el grado de entrada d⁻(v) de cada vértice. La cola y el resultado Orden_Top empiezan vacíos.',
        sourcesTitle: 'Vértices sin aristas de entrada',
        sourcesDescription: (vertices) =>
            `Los vértices con d⁻(v) = 0 entran en la cola: ${vertices}. No dependen de ningún otro.`,
        noSourcesDescription:
            'Ningún vértice tiene d⁻(v) = 0. Como todo grafo acíclico dirigido tiene al menos un vértice sin aristas de entrada, el grafo contiene un ciclo.',
        insertTitle: (vertex, position) =>
            `${vertex} entra en Orden_Top en la posición ${position}`,
        insertDescription: (vertex, position) =>
            `${vertex} sale de la cola y se inserta al final del resultado. Su numeración topológica es ${position}, ya que todos los vértices que lo preceden ya se procesaron.`,
        zeroTitle: (vertex) => `M[${vertex}] llega a 0, entra en la cola`,
        zeroDescription: (from, to, before) =>
            `Eliminada la arista (${from}, ${to}), el grado de entrada de ${to} baja de ${before} a 0: todas sus dependencias ya están en el resultado, así que entra en la cola.`,
        decreasedDescription: (from, to, before) =>
            `Eliminada la arista (${from}, ${to}), el grado de entrada de ${to} baja de ${before} a ${before - 1}. Todavía depende de ${before - 1} ${plural(before - 1, 'vértice', 'vértices')} y se queda fuera de la cola.`,
        cycleTitle: 'Ciclo detectado',
        cycleDescription: (count, vertices) =>
            `La cola se vació con ${count} ${plural(count, 'vértice aún sin procesar', 'vértices aún sin procesar')}: ${vertices}. Todos siguen con M[v] > 0, lo que solo es posible si hay un ciclo entre ellos.`,
        pendingConclusion: (vertices) =>
            `No se procesaron todos los vértices: el grafo tiene un ciclo que involucra a ${vertices}.`,
        completeDescription: (count, order) => `Se procesaron los ${count} vértices: ${order}.`,
        numberingConclusion:
            'La numeración topológica ord(v) corresponde al orden de inserción en el resultado y cumple ord(v) < ord(w) para toda arista (v, w) ∈ E(G).',
        acyclicConclusion:
            'Se procesaron todos los vértices, así que el grafo es acíclico. Ten en cuenta que el orden topológico puede no ser único.',
    },
};
