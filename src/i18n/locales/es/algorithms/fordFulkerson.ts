import type { AlgorithmTexts } from '@/i18n/dictionaries';
import { plural } from '@/i18n/format';

export const fordFulkerson: AlgorithmTexts['ford-fulkerson'] = {
    name: 'Método de Ford-Fulkerson',
    shortName: 'Ford-Fulkerson',
    tagline:
        "Mientras exista algún camino aumentante en G'(f), envía por él el cuello de botella δ y actualiza la red residual.",
    complexity: 'O(m · f) con capacidades enteras',
    constraints: [
        'Requiere una red de flujo: grafo dirigido con capacidad u(e) > 0',
        'Requiere una fuente s y un sumidero t',
        'El camino aumentante se elige de forma arbitraria',
    ],
    reference: {
        idea: 'Mientras exista un camino aumentante de la fuente s al sumidero t en la red residual G′(f), se envía por él lo máximo posible, el cuello de botella δ, y se actualiza la red residual. Las aristas inversas permiten deshacer envíos anteriores.',
        pseudocode: [
            'Red residual G′(f): V(G′) = V(G) y, para e = (v, w) ∈ E:',
            '  si f(e) < u(e): arista directa (v, w) con u (e) = u(e) − f(e)',
            '                                             r',
            '  si f(e) > 0:    arista inversa (w, v) con capacidad f(e)',
            '',
            'Método de Ford-Fulkerson',
            '  1. para toda arista e ∈ E(G) hacer  f(e) ← 0',
            '  2. Construir la red residual G′(f)',
            '  3. mientras exista un camino aumentante P en G′(f) hacer',
            '     a. δ ← min { u (e) | e ∈ P }        // "cuello de botella" de P',
            '                   r',
            '     b. para cada arista (v, w) ∈ P hacer',
            '        i.  si (v, w) es una arista directa entonces',
            '              f(v, w) ← f(v, w) + δ      // aumentar el flujo',
            '        ii. si no',
            '              f(w, v) ← f(w, v) − δ      // reducir el flujo',
            '     c. Actualizar la red residual G′(f)',
        ],
        invariant:
            'El flujo f respeta siempre la restricción de capacidad, 0 ≤ f(e) ≤ u(e), y la conservación del flujo en todo nodo interno. Por el teorema de flujo máximo y corte mínimo, al final el valor del flujo es igual a la capacidad del corte s-t mínimo.',
        pitfalls: [
            'Olvidar crear la arista inversa en la red residual, lo que impide deshacer envíos hechos en iteraciones anteriores.',
            'Elegir caminos aumentantes arbitrarios: con capacidades irracionales el método puede no terminar. Elegir siempre el camino aumentante con menos aristas (búsqueda en anchura) es el algoritmo de Edmonds-Karp.',
            'Suponer que el corte mínimo es cualquier corte: en la solución óptima, S es el conjunto de vértices alcanzables desde la fuente s en la red residual final.',
        ],
    },
    trace: {
        methodName: 'El método de Ford-Fulkerson',
        explainChoice: (path, edges) =>
            `El método no impone ningún criterio de elección: basta con que exista un camino aumentante P en G'(f). Una búsqueda en profundidad encontró ${path}, con ${edges} ${plural(edges, 'arista', 'aristas')}.`,
    },
};
