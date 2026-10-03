import type { AlgorithmTexts } from '@/i18n/dictionaries';
import { plural } from '@/i18n/format';

export const edmondsKarp: AlgorithmTexts['edmonds-karp'] = {
    name: 'Algoritmo de Edmonds-Karp',
    shortName: 'Edmonds-Karp',
    tagline:
        'Implementación eficiente de Ford-Fulkerson: en cada iteración elige el camino aumentante más corto, obtenido mediante una búsqueda en anchura.',
    complexity: 'O(n · m² )',
    constraints: [
        'Requiere una red de flujo: grafo dirigido con capacidad u(e) > 0',
        'Requiere una fuente s y un sumidero t',
        'Elige siempre el camino aumentante con menos aristas',
    ],
    reference: {
        idea: 'Implementación eficiente del método de Ford-Fulkerson: en cada iteración selecciona el camino aumentante más corto de la red residual, es decir, el que usa el menor número de aristas. Ese camino se encuentra con una búsqueda en anchura.',
        pseudocode: [
            'Algoritmo de Edmonds-Karp',
            '  1. para toda arista e ∈ E(G) hacer  f(e) ← 0',
            '  2. Construir la red residual G′(f)',
            '  3. mientras exista algún camino aumentante P en G′(f) hacer',
            '     a. Sea P el camino aumentante en G′(f) con menor número',
            '        de aristas   // obtenido por búsqueda en anchura',
            '     b. δ ← min { u (e) | e ∈ P }',
            '                   r',
            '     c. para cada arista (v, w) ∈ P hacer',
            '        i.  si (v, w) es una arista directa entonces',
            '              f(v, w) ← f(v, w) + δ',
            '        ii. si no',
            '              f(w, v) ← f(w, v) − δ',
            '     d. Actualizar la red residual G′(f)',
        ],
        invariant:
            'La longitud del camino aumentante elegido nunca disminuye de una iteración a la siguiente. Hay como máximo O(n·m) caminos aumentantes y cada uno se encuentra en O(m), de ahí O(n·m²).',
        pitfalls: [
            'Usar búsqueda en profundidad: se vuelve al método genérico de Ford-Fulkerson, que es solo pseudopolinomial, O(m·f), con f igual al valor del flujo máximo.',
            'En la red con dos aristas de capacidad 100 unidas por una de capacidad 1, la elección arbitraria puede requerir 200 iteraciones; la elección del camino más corto requiere 2.',
            'Olvidar que el algoritmo fue publicado de forma independiente por Dinitz (1970) y por Edmonds y Karp (1972).',
        ],
    },
    trace: {
        methodName: 'El algoritmo de Edmonds-Karp',
        explainChoice: (path, edges) =>
            `Una búsqueda en anchura en G'(f) devuelve el camino aumentante con el menor número de aristas: ${path}, con ${edges} ${plural(edges, 'arista', 'aristas')}. Es esta elección lo que hace que el algoritmo sea polinómico.`,
    },
};
