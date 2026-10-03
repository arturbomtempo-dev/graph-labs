import type { AlgorithmTexts } from '@/i18n/dictionaries';
import { plural } from '@/i18n/format';

export const dinic: AlgorithmTexts['dinic'] = {
    name: 'Algoritmo de Dinic',
    shortName: 'Dinic',
    tagline:
        'En cada iteración construye la red de niveles GL a partir de G′(f) y determina en ella un flujo bloqueante.',
    complexity: 'O(n² · m)',
    constraints: [
        'Requiere una red de flujo: grafo dirigido con capacidad u(e) > 0',
        'Requiere una fuente s y un sumidero t',
        'Como máximo n − 1 flujos bloqueantes',
    ],
    reference: {
        idea: 'En lugar de aumentar un camino cada vez, construye la red de niveles GL a partir de G′(f) y determina en ella un flujo bloqueante completo. Como el número de niveles crece al menos en una unidad en cada iteración, hay como máximo n − 1 flujos bloqueantes.',
        pseudocode: [
            'Red de niveles GL: V(GL) = V(G′) y, para (v, w) ∈ E(G′):',
            '  (v, w) ∈ E(GL) con capacidad u (e) si dist(w) = dist(v) + 1,',
            '                                r',
            '  donde dist(v) es la menor distancia geodésica de s a v',
            '',
            'Flujo bloqueante fb: flujo en GL tal que, conservando solo las',
            '  aristas con capacidad mayor que fb, ya no exista ningún',
            '  camino aumentante en GL',
            '',
            'Algoritmo de Dinic',
            '  1. para toda arista e ∈ E(G) hacer  f(e) ← 0',
            '  2. Construir la red residual G′(f)',
            '  3. Construir la red de niveles GL a partir de G′(f)',
            '  4. mientras dist(t) < ∞ hacer',
            '     a. Determinar un flujo bloqueante fb en GL',
            '     b. Actualizar el flujo f usando fb',
            '     c. Actualizar la red residual G′(f)',
            '     d. Construir la red de niveles GL a partir de G′(f)',
        ],
        invariant:
            'dist(t) crece estrictamente entre iteraciones, así que hay como máximo n − 1 flujos bloqueantes. Cada flujo bloqueante se obtiene en O(n·m), de ahí O(n²·m).',
        pitfalls: [
            'Buscar caminos fuera de GL: solo valen las aristas (v, w) con dist(w) = dist(v) + 1.',
            'Reconstruir la red de niveles tras cada camino en lugar de tras cada flujo bloqueante: lo que caracteriza una iteración es el flujo bloqueante completo.',
            'Detenerse cuando un camino se satura: el flujo bloqueante solo termina cuando ya no existe ningún camino de s a t en GL.',
        ],
    },
    trace: {
        levelsTitle: 'Red de niveles GL',
        initTitle: 'Red residual inicial G′(f)',
        initDescription: (source, sink) =>
            `f(e) = 0 para toda arista, por lo que u_r(e) = u(e). La fuente es s = ${source} y el sumidero es t = ${sink}.`,
        endTitle: 'dist(t) = ∞, el bucle termina',
        endDescription: (reachable) =>
            `El sumidero ya no es alcanzable en G′(f), así que no existe camino aumentante ni flujo bloqueante. El conjunto S = { ${reachable} } define el corte s-t mínimo.`,
        blockingFlowsMetric: 'Flujos bloqueantes',
        blockingFlowsConclusion: (count, flows) =>
            `${plural(count, 'Fue necesario', 'Fueron necesarios')} ${count} ${plural(count, 'flujo bloqueante', 'flujos bloqueantes')}: ${flows}.`,
        levelsConclusion:
            'El número de niveles aumenta al menos en una unidad con cada flujo bloqueante, así que hay como máximo n − 1 iteraciones.',
        levelGraphTitle: (phase, distance) => `Red de niveles ${phase}: dist(t) = ${distance}`,
        levelGraphDescription: (distance) =>
            `Una búsqueda en anchura en G′(f) define dist(v) para cada vértice. GL contiene solo las aristas (v, w) de G′(f) con dist(w) = dist(v) + 1, resaltadas en naranja. Todo camino de s a t en GL tiene exactamente ${distance} ${plural(distance, 'arista', 'aristas')}.`,
        pathTitle: (phase, path, label) => `Flujo bloqueante ${phase}, camino ${path}: ${label}`,
        pathDescription: (path, bottleneck) =>
            `En GL está el camino ${path}, con cuello de botella δ = ${bottleneck}. Tras el envío, al menos una de sus aristas se satura y deja de pertenecer a GL, lo que hace avanzar el flujo bloqueante.`,
        blockingFlowMetric: 'Flujo bloqueante',
        phaseDoneTitle: (phase, value) => `Flujo bloqueante ${phase} determinado: fb = ${value}`,
        phaseDoneDescription: (paths, value) =>
            `Ya no hay camino de s a t en GL: el flujo bloqueante está completo, con ${paths} ${plural(paths, 'camino', 'caminos')} y valor ${value}. Se actualiza el flujo f y se construyen una nueva red residual y una nueva red de niveles.`,
        limitConclusion: (value, phases) =>
            `Valor del flujo alcanzado: ${value} tras ${phases} ${plural(phases, 'flujo bloqueante', 'flujos bloqueantes')}.`,
    },
};
