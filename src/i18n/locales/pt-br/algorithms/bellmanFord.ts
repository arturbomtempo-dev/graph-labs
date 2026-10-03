import type { AlgorithmTexts } from '@/i18n/dictionaries';
import { plural } from '@/i18n/format';

export const bellmanFord: AlgorithmTexts['bellman-ford'] = {
    name: 'Método de Bellman-Ford',
    shortName: 'Bellman-Ford',
    tagline:
        'Programação dinâmica: examina todas as arestas a cada iteração, relaxando as que estiverem tensas, por |V(G)| − 1 iterações.',
    complexity: 'O(n · m)',
    constraints: [
        'Admite arestas de peso negativo',
        'Não admite ciclo de peso negativo',
        'Detecta ciclo de peso negativo alcançável a partir da origem',
    ],
    reference: {
        idea: 'Calcula caminhos mínimos por programação dinâmica. Em vez de "fechar" um vértice por iteração, como Dijkstra, examina todas as arestas a cada iteração. Como qualquer caminho em um grafo com n vértices possui no máximo n − 1 arestas, n − 1 iterações bastam.',
        pseudocode: [
            'Operação de relaxação',
            '  se dist[v] + d    < dist[w] então   // aresta (v, w) está tensa?',
            '                vw',
            '    dist[w] ← dist[v] + d',
            '                         vw',
            '    pred[w] ← v',
            '',
            'Método de Bellman-Ford',
            '  1. para todo vértice v ∈ V(G) faça',
            '       dist[v] ← ∞; pred[v] ← nulo',
            '  2. dist[s] ← 0',
            '  3. para i = 1, . . ., | V(G) | − 1 faça',
            '       para cada (v, w) ∈ E(G) faça',
            '         se dist[w] > dist[v] + d    então   // aresta tensa?',
            '                                 vw',
            '           dist[w] ← dist[v] + d',
            '                                vw',
            '           pred[w] ← v',
            '',
            '  Se ainda houver aresta tensa após a última iteração,',
            '  então existe um ciclo de peso negativo no grafo.',
        ],
        invariant:
            'Após a i-ésima iteração, dist[w] é no máximo o peso do menor caminho de s a w que usa até i arestas.',
        pitfalls: [
            'Se, em alguma iteração, nenhuma aresta estiver tensa, o algoritmo pode terminar: as iterações seguintes não trariam atualizações.',
            'Havendo ciclo de peso negativo entre s e t, não existe caminho mínimo entre eles; sem esse ciclo, o caminho mínimo é simples (não repete vértices).',
            'Aresta não direcionada com peso negativo já é, por si só, um ciclo de peso negativo.',
        ],
    },
    trace: {
        arcsTitle: 'Lista de arestas (ordem fixa de exame)',
        initDescription: (source) =>
            `dist[${source}] = 0 na origem, dist[v] = ∞ e pred[v] = nulo nos demais vértices. Cada aresta não direcionada é examinada nos dois sentidos.`,
        iterationTitle: (round, rounds) => `Iteração ${round} de ${rounds}`,
        iterationDescription: (arcs, rounds) =>
            `Nesta iteração todas as ${arcs} arestas são examinadas, sempre na mesma ordem, e as que estiverem tensas são relaxadas. Como qualquer caminho tem no máximo n − 1 arestas, ${rounds} ${plural(rounds, 'iteração basta', 'iterações bastam')}.`,
        iterationMetric: 'Iteração',
        noTenseTitle: (round) => `Iteração ${round} sem arestas tensas`,
        noTenseDescription:
            'Nenhuma aresta estava tensa nesta iteração, portanto não haverá atualizações nas próximas e o algoritmo pode terminar.',
        checkTitle: 'Verificação de ciclo de peso negativo',
        checkDescription:
            'Uma iteração adicional é executada: se alguma aresta ainda estiver tensa, algum caminho teria n arestas ou mais, o que só é possível na presença de ciclo de peso negativo alcançável a partir da origem.',
        negativeCycleTitle: (from, to) => `Ciclo de peso negativo detectado em (${from}, ${to})`,
        negativeCycleDescription: (fromDistance, weight, current) =>
            `A aresta continua tensa (${fromDistance} + ${weight} < ${current}), o que só é possível se houver ciclo de peso negativo alcançável a partir da origem.`,
        invalidTitle: 'Resultado inválido por ciclo de peso negativo',
        invalidDescription: (edges, rounds) =>
            `${edges} ${plural(edges, 'aresta continua tensa', 'arestas continuam tensas')} após ${rounds} ${plural(rounds, 'iteração', 'iterações')}.`,
        negativeCycleConclusion:
            'Existe ciclo de peso negativo alcançável a partir da origem: para os vértices afetados não há caminho mínimo, pois é sempre possível reduzir o peso dando mais uma volta no ciclo.',
        lastRoundConclusion: (last, rounds) =>
            `A última iteração com aresta tensa foi a de número ${last}, de um total de ${rounds}. Sem ciclo de peso negativo, todo caminho mínimo é simples (não repete vértices).`,
        doneDescription:
            'Nenhuma aresta está tensa, portanto o valor ótimo foi atingido e não há ciclo de peso negativo alcançável.',
    },
};
