import type { AlgorithmTexts } from '@/i18n/dictionaries';

export const dijkstra: AlgorithmTexts['dijkstra'] = {
    name: 'Método de Dijkstra',
    shortName: 'Dijkstra',
    tagline:
        '"Fecha" um vértice por iteração, sempre o de menor dist, e relaxa as arestas tensas que saem dele.',
    complexity: 'O(n²)',
    constraints: [
        'Aceita arestas direcionadas e não direcionadas',
        'Exige pesos não negativos',
        'Baseia-se no princípio da relaxação',
    ],
    reference: {
        idea: 'Resolve o problema de caminho mínimo a partir de uma única raiz s. Baseia-se no princípio da relaxação e "fecha" um vértice por iteração: escolhe o vértice ainda não fechado com o menor valor de dist e relaxa as arestas tensas que saem dele.',
        pseudocode: [
            'Operação de relaxação',
            '  se dist[v] + d    < dist[w] então   // aresta (v, w) está tensa?',
            '                vw',
            '    dist[w] ← dist[v] + d',
            '                         vw',
            '    pred[w] ← v',
            '',
            'Método de Dijkstra',
            '  1. para todo vértice v ∈ V(G) faça',
            '       dist[v] ← ∞; pred[v] ← nulo',
            '  2. dist[s] ← 0        // s é a raiz da busca',
            '  3. S ← ∅              // conjunto dos vértices fechados',
            '  4. enquanto S ≠ V(G) efetuar',
            '     a. Escolher o vértice v ∉ S de menor dist[v]',
            '     b. S ← S ∪ { v }                  // "fechar" o vértice v',
            '     c. para todo vértice w ∈ Γ⁺(v) faça',
            '          se dist[w] > dist[v] + d    então   // aresta tensa?',
            '                                  vw',
            '            dist[w] ← dist[v] + d',
            '                                 vw',
            '            pred[w] ← v',
        ],
        invariant:
            'Para todo v ∈ S, dist[v] já é o peso do caminho mínimo da raiz até v. Ao final, dist[ ] guarda os pesos dos caminhos mínimos; os caminhos em si são recuperados pela lista de predecessores pred[ ].',
        pitfalls: [
            'Aplicar o método em grafo com aresta de peso negativo: ele falha. Reponderar, adicionando uma constante a todas as arestas, também pode falhar.',
            'Reabrir um vértice que já pertence a S: uma vez fechado, seu dist não muda mais.',
            'Achar que dist[ ] devolve os caminhos: sem pred[ ] obtêm-se apenas os pesos.',
        ],
    },
    issues: {
        negativeWeights:
            'O método de Dijkstra falha com arestas de peso negativo: use Bellman-Ford. Reponderar, adicionando uma constante a todas as arestas, também pode falhar.',
    },
    trace: {
        openSetTitle: 'Vértices ainda não fechados',
        initDescription: (root) =>
            `dist[${root}] = 0 na raiz e dist[v] = ∞ nos demais vértices, com pred[v] = nulo. Nenhum vértice foi fechado ainda, isto é, S = ∅.`,
        unreachableTitle: 'Vértices inalcançáveis',
        unreachableDescription:
            'Todos os vértices ainda não fechados têm dist = ∞: eles não são alcançáveis a partir da raiz e o algoritmo encerra.',
        closeTitle: (vertex, distance) => `Fecha ${vertex} com dist = ${distance}`,
        closeDescription: (vertex) =>
            `${vertex} é o vértice não fechado com o menor valor de dist, portanto entra em S. Como não há pesos negativos, dist[${vertex}] já é o peso definitivo do caminho mínimo desde a raiz.`,
        notTenseTitle: (from, to) => `Aresta (${from}, ${to}) não está tensa`,
        notTenseDescription: (values) =>
            `dist[${values.from}] + d = ${values.fromDistance} + ${values.weight} = ${values.candidate} não é menor que dist[${values.to}] = ${values.current}, então nada muda.`,
        pathHighlighted: (target) => `O caminho mínimo até ${target} está destacado em roxo.`,
        allClosedDescription:
            'Todos os vértices alcançáveis foram fechados com seu valor definitivo de dist.',
        predConclusion:
            'dist[ ] guarda apenas os pesos dos caminhos mínimos; os caminhos em si são recuperados percorrendo a lista de predecessores pred[ ].',
    },
};
