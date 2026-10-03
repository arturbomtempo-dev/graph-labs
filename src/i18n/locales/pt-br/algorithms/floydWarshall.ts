import type { AlgorithmTexts } from '@/i18n/dictionaries';

export const floydWarshall: AlgorithmTexts['floyd-warshall'] = {
    name: 'Método de Floyd-Warshall',
    shortName: 'Floyd-Warshall',
    tagline:
        'Caminhos mínimos entre todos os pares por programação dinâmica: a rodada k libera o vértice k como intermediário.',
    complexity: 'O(n³)',
    constraints: [
        'Admite arestas de peso negativo',
        'Não admite ciclo de peso negativo',
        'Calcula todos os pares de vértices de uma só vez',
    ],
    reference: {
        idea: 'Programação dinâmica sobre o conjunto de vértices intermediários permitidos. Numerados os vértices de 1 a n, distᵏ[i, j] é a distância entre i e j usando como intermediários apenas os vértices de { 1, 2, . . ., k }.',
        pseudocode: [
            'Relaxação do comprimento dos caminhos',
            '  distᵏ[i, j] = min( distᵏ⁻¹[i, j],',
            '                     distᵏ⁻¹[i, k] + distᵏ⁻¹[k, j] )',
            '  com dist⁰[i, j] = d   se (i, j) ∈ E(G); ∞ caso contrário;',
            '                     ij',
            '  e dist⁰[i, i] = 0',
            '',
            'Método de Floyd-Warshall',
            '  1. para i = 1, . . ., n faça',
            '       para j = 1, . . ., n | j ≠ i faça',
            '         dist[i, j] ← ∞; pred[i, j] ← nulo',
            '       dist[i, i] ← 0;   pred[i, i] ← i',
            '  2. para toda aresta (i, j) ∈ E(G) faça',
            '       dist[i, j] ← d  ;  pred[i, j] ← i',
            '                     ij',
            '  3. para k = 1, . . ., n faça   // cada possível intermediário',
            '       para i = 1, . . ., n faça',
            '         para j = 1, . . ., n faça',
            '           se dist[i, j] > dist[i, k] + dist[k, j] então',
            '             dist[i, j] ← dist[i, k] + dist[k, j]',
            '             pred[i, j] ← pred[k, j]',
        ],
        invariant:
            'Ao final da rodada k, dist[i, j] é o peso do menor caminho de i a j que usa apenas { 1, . . ., k } como vértices intermediários; pred[i, j] guarda o penúltimo vértice desse caminho.',
        pitfalls: [
            'Trocar a ordem dos laços: k precisa ser o laço mais externo.',
            'Atualizar o predecessor com pred[i, k] em vez de pred[k, j]: pred[i, j] é o penúltimo vértice do caminho de i para j.',
            'Entrada negativa na diagonal, isto é, dist[i, i] < 0, indica ciclo de peso negativo.',
        ],
    },
    trace: {
        distMatrixTitle: 'Matriz dist',
        predMatrixTitle: 'Matriz pred',
        initTitle: 'Matrizes iniciais (k = 0)',
        initDescription:
            'dist⁰[i, i] = 0, dist⁰[i, j] = dij para toda aresta (i, j) ∈ E(G) e ∞ para os pares sem ligação direta. Em pred, cada par ligado por aresta recebe o próprio i, pois i é o penúltimo vértice do caminho direto de i para j.',
        pivotDescription: (allowed, pivot) =>
            `Agora os vértices { ${allowed} } podem ser usados como intermediários. Para todo par (i, j), testa-se se dist[i, j] > dist[i, ${pivot}] + dist[${pivot}, j].`,
        pivotMetric: 'Intermediário k',
        updateDescription: (values) =>
            `dist[${values.i}, ${values.k}] + dist[${values.k}, ${values.j}] = ${values.viaFirst} + ${values.viaSecond} = ${values.total}, menor que ${values.previous}. Atualiza-se também pred[${values.i}, ${values.j}] ← pred[${values.k}, ${values.j}] = ${values.predecessor}.`,
        noImprovementTitle: (pivot) => `Nenhuma melhoria com k = ${pivot}`,
        noImprovementDescription: (pivot) =>
            `Nenhum par (i, j) reduz sua distância passando por ${pivot}.`,
        negativeCycleBadge: 'ciclo −',
        negativeCycleConclusion: (vertices) =>
            `Ciclo de peso negativo detectado: dist[i, i] < 0 para ${vertices}. Nesse caso não há caminho mínimo bem definido entre os pares afetados.`,
        noNegativeCycleConclusion:
            'Nenhuma entrada da diagonal ficou negativa, portanto o grafo não possui ciclo de peso negativo.',
        pathConclusion: (start, end, path, weight) =>
            `Caminho mínimo de ${start} até ${end}, recuperado de trás para frente pela matriz pred: ${path} (peso ${weight}).`,
        finalTitle: 'Matrizes finais',
        finalDescription:
            'Após liberar todos os vértices como intermediários, dist[i, j] contém a distância mínima entre cada par de vértices e pred[i, j] permite recuperar os caminhos.',
    },
};
