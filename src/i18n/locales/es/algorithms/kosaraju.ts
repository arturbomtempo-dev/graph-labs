import type { AlgorithmTexts } from '@/i18n/dictionaries';
import { plural } from '@/i18n/format';

export const kosaraju: AlgorithmTexts['kosaraju'] = {
    name: 'Algoritmo de Kosaraju',
    shortName: 'Kosaraju',
    tagline:
        'Encuentra las componentes fuertemente conexas con dos búsquedas en profundidad: una en G y otra en el grafo inverso Gᴿ.',
    complexity: 'O(n + m)',
    constraints: ['Requiere un grafo dirigido', 'Ignora los pesos de las aristas'],
    reference: {
        idea: 'Una primera búsqueda en profundidad en G registra los tiempos de finalización TF. La segunda búsqueda, hecha en el grafo inverso Gᴿ y tomando los vértices en orden decreciente de TF, produce un bosque en el que cada árbol es exactamente una componente fuertemente conexa.',
        pseudocode: [
            'Algoritmo de Kosaraju',
            '  1. Hacer una búsqueda en profundidad en G',
            '       // guardar el tiempo de finalización TF de cada vértice',
            '  2. Construir el grafo inverso (o traspuesto) Gᴿ',
            '       // si (v, w) ∈ E(G) entonces (w, v) ∈ E(Gᴿ)',
            '  3. Hacer una búsqueda en profundidad en Gᴿ tomando los',
            '     vértices en orden decreciente de TF',
            '',
            '  Cada árbol del bosque de profundidad obtenido en el paso 3',
            '  corresponde a una componente fuertemente conexa de G.',
        ],
        invariant:
            'El orden decreciente de tiempo de finalización garantiza que la búsqueda en Gᴿ iniciada en un vértice nunca escapa de la componente fuertemente conexa a la que pertenece.',
        pitfalls: [
            'Olvidar construir el grafo inverso Gᴿ antes de la segunda búsqueda.',
            'Recorrer la segunda búsqueda en orden creciente de TF en lugar de decreciente.',
            'Confundir los tres niveles de conectividad de un grafo dirigido conexo: débilmente conexo (el grafo subyacente es conexo), unilateralmente conexo (para todo par, uno alcanza al otro) y fuertemente conexo (todos mutuamente alcanzables).',
        ],
    },
    trace: {
        finishStackTitle: 'Pila de finalización',
        componentsTitle: 'Componentes fuertemente conexas',
        step1Title: 'Paso 1: búsqueda en profundidad en G',
        step1Description:
            'La primera búsqueda en profundidad recorre G y apila cada vértice en el momento en que se define su tiempo de finalización TF.',
        visitTitle: (vertex) => `Visita ${vertex}`,
        visitDescription: (vertex) => `${vertex} se marca en la primera búsqueda en profundidad.`,
        finishTitle: (vertex) => `Finaliza ${vertex}`,
        finishDescription: (vertex) =>
            `${vertex} no tiene más vecinos por explorar: se define su TF y se apila. La cima de la pila es el vértice con mayor TF.`,
        step2Title: 'Paso 2: construcción del grafo inverso Gᴿ',
        step2Description: (order) =>
            `Todas las aristas se invierten: si (v, w) ∈ E(G) entonces (w, v) ∈ E(Gᴿ). La segunda búsqueda recorrerá Gᴿ en orden decreciente de TF: ${order}.`,
        joinTitle: (vertex, component) => `${vertex} entra en ${component}`,
        joinDescription: (vertex) =>
            `En Gᴿ, ${vertex} es alcanzable desde la raíz de este árbol de profundidad, por lo que pertenece a la misma componente fuertemente conexa.`,
        newComponentTitle: (vertex) => `Nueva componente a partir de ${vertex}`,
        newComponentDescription: (vertex, component) =>
            `${vertex} es el vértice aún sin marcar con mayor TF, así que es la raíz de un nuevo árbol de profundidad en Gᴿ, que corresponde a la componente ${component}.`,
        step3Title: 'Paso 3: componentes identificadas',
        step3Description: (count) =>
            `Cada árbol del bosque de profundidad obtenido en Gᴿ es una componente fuertemente conexa: G tiene ${count} ${plural(count, 'componente fuertemente conexa', 'componentes fuertemente conexas')}. Las aristas resaltadas unen vértices de una misma componente.`,
        countConclusion: (count) =>
            `Se ${plural(count, 'encontró', 'encontraron')} ${count} ${plural(count, 'componente fuertemente conexa', 'componentes fuertemente conexas')}.`,
        stronglyConnectedConclusion:
            'Todos los vértices son mutuamente alcanzables, por lo que G es fuertemente conexo.',
        notStronglyConnectedConclusion:
            'Como hay más de una componente fuertemente conexa, G no es fuertemente conexo: existe un par de vértices que no se alcanzan mutuamente.',
    },
};
