import type { AlgorithmTexts } from '@/i18n/dictionaries';

export const topologicalDfs: AlgorithmTexts['topological-dfs'] = {
    name: 'Ordenação topológica por busca em profundidade',
    shortName: 'Ord. topológica (BP)',
    tagline:
        'Descrito por Tarjan em 1976: insere cada vértice no início do resultado somente depois de visitar todos os que dependem dele.',
    complexity: 'O(n + m)',
    constraints: [
        'Exige grafo direcionado',
        'Só existe ordenação topológica em grafo acíclico',
        'Marca temporária reencontrada evidencia ciclo',
    ],
    reference: {
        idea: 'Alternativa baseada na busca em profundidade, descrita por Tarjan em 1976. Cada vértice é inserido no resultado somente após todos os que dependem dele, e a inserção é feita no início da lista, daí a ordem reversa.',
        pseudocode: [
            'Método por Busca em Profundidade',
            '  1. para todo vértice v faça Marca[v] ← 0',
            '  2. Ordena_Top ← ∅',
            '  3. enquanto existir algum vértice v tal que Marca[v] = 0',
            '     efetuar Visita(v)',
            '',
            'Visita(v)',
            '  1. se Marca[v] ≠ 2 então      // se v não for permanente',
            '     a. se Marca[v] = 1 então CICLO   // marca temporária',
            '     b. Marca[v] ← 1                  // marca temporária',
            '     c. para todo vértice w ∈ Γ⁺(v) faça Visita(w)',
            '     d. Marca[v] ← 2                  // marca permanente',
            '     e. Ordena_Top.InsereNoInicio(v)',
        ],
        invariant:
            'Quando v recebe marca permanente, todos os vértices alcançáveis a partir de v já estão em Ordena_Top. Como v é inserido no início, ele precede todos eles na ordenação.',
        pitfalls: [
            'Inserir no fim em vez do início: a ordenação sai invertida. A ordem correta é a reversa da ordem de inserção, equivalente à ordem decrescente de tempo de término.',
            'Não distinguir marca temporária de permanente: só a marca temporária reencontrada evidencia ciclo; a permanente indica um vértice já resolvido.',
            'Confundir com a floresta de profundidade comum: aqui o que importa é a ordem de término, não a árvore.',
        ],
    },
    trace: {
        marksTitle: 'Marcas dos vértices',
        markColumn: 'Marca[v]',
        markLabels: ['0 (desmarcado)', '1 (temporária)', '2 (permanente)'],
        callsTitle: 'Chamadas de Visita( )',
        initDescription:
            'Todos os vértices começam desmarcados, isto é, Marca[v] = 0, e o resultado Ordena_Top começa vazio.',
        cycleTitle: (vertex) => `Ciclo: ${vertex} já tem marca temporária`,
        cycleDescription: (vertex) =>
            `Visita(${vertex}) foi chamada enquanto Marca[${vertex}] = 1, ou seja, o vértice ainda está na cadeia de chamadas atual. Isso significa que existe um caminho de ${vertex} de volta a ele mesmo: o grafo possui ciclo e não admite ordenação topológica.`,
        temporaryBadge: 'temp',
        visitTitle: (vertex) => `Visita(${vertex})`,
        visitDescription: (vertex) =>
            `${vertex} recebe marca temporária (Marca = 1) e sua vizinhança Γ⁺(${vertex}) passa a ser visitada.`,
        prependTitle: (vertex) => `${vertex} entra no início de Ordena_Top`,
        prependDescription: (vertex) =>
            `Todos os vértices que dependem de ${vertex} já foram visitados, então ele recebe marca permanente (Marca = 2) e é inserido no início do resultado, daí a ordem reversa de inserção.`,
        impossibleTitle: 'Ordenação topológica impossível',
        impossibleDescription: (from, to) =>
            `A aresta (${from}, ${to}) fecha um ciclo, pois ${to} ainda tinha marca temporária quando foi alcançado novamente.`,
        cycleConclusion: (from, to) =>
            `O grafo possui ciclo: ${to} foi alcançado de novo com marca temporária, a partir de ${from}.`,
        completeDescription: (order) =>
            `Todos os vértices receberam marca permanente. Lendo Ordena_Top do início ao fim: ${order}.`,
        reverseConclusion:
            'Cada vértice foi inserido no início do resultado, portanto a ordenação corresponde à ordem reversa de inserção, equivalente à ordem decrescente de tempo de término da busca em profundidade.',
        acyclicConclusion:
            'Nenhuma marca temporária foi reencontrada, logo o grafo é acíclico. A ordenação topológica pode não ser única.',
    },
};
