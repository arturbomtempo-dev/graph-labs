import type { AlgorithmTexts } from '@/i18n/dictionaries';
import { plural } from '@/i18n/format';

export const kruskal: AlgorithmTexts['kruskal'] = {
    name: 'Método de Kruskal',
    shortName: 'Kruskal',
    tagline:
        'Inclui arestas, e não vértices: ordena as arestas por peso não decrescente e aceita cada uma que não forme ciclo com as já inseridas em E(T).',
    complexity: 'O(m log m)',
    constraints: [
        'Exige grafo não direcionado',
        'Exige grafo ponderado com peso w(e) > 0',
        'Em grafo desconexo produz uma floresta geradora mínima',
    ],
    reference: {
        idea: 'Constrói a AGM incluindo arestas, e não vértices como em Prim. Ordena as arestas em ordem não decrescente de peso e aceita, a cada iteração, a aresta de menor peso que não forme ciclo com as já inseridas em E(T).',
        pseudocode: [
            'Método de Kruskal',
            '  1. Ordenar as arestas em ordem não decrescente de peso:',
            '     e₁, e₂, e₃, . . .',
            '  2. V(T) ← V(G)      // todos os vértices entram na AGM',
            '  3. E(T) ← { e₁ }',
            '  4. j ← 2            // aresta a ser analisada',
            '  5. enquanto | E(T) | < | V(T) | − 1 efetuar',
            '     a. se a aresta e  não forma ciclo com as arestas de E(T)',
            '                     j',
            '        então Acrescentar e  a E(T)',
            '                           j',
            '     b. j ← j + 1',
        ],
        invariant:
            'A cada iteração, T = (V(T), E(T)) é uma floresta geradora contida em alguma árvore geradora mínima de G.',
        pitfalls: [
            'Supor que bastam n − 1 iterações: são necessárias pelo menos n − 1, mas podem ser mais, pois arestas que formam ciclo precisam ser ignoradas.',
            'Aceitar uma aresta cujos extremos já estão ligados por arestas de E(T): ela fecharia um ciclo.',
            'Em grafo desconexo o resultado é uma floresta geradora mínima, não uma árvore geradora.',
        ],
    },
    trace: {
        edgesTitle: 'Arestas em ordem não decrescente de peso',
        decisions: {
            accepted: 'entra em E(T)',
            rejected: 'forma ciclo, ignorada',
            examining: 'em análise',
            waiting: 'aguardando',
        },
        setsTitle: 'Componentes da floresta parcial T',
        initDescription: (edges) =>
            `V(T) recebe todos os vértices de V(G) e E(T) começa vazio, portanto cada vértice é um componente isolado da floresta. ${plural(edges, `A ${edges} aresta foi ordenada`, `As ${edges} arestas foram ordenadas`)} em ordem não decrescente de peso.`,
        examineTitle: (edge, weight) => `Analisa ${edge} de peso ${weight}`,
        cycleDescription:
            'Os dois extremos já estão ligados por arestas de E(T), portanto essa aresta formaria um ciclo.',
        noCycleDescription:
            'Os extremos estão em componentes diferentes da floresta parcial, portanto a aresta não forma ciclo com as arestas de E(T).',
        rejectedTitle: 'Aresta ignorada (forma ciclo)',
        acceptedTitle: 'Aresta acrescentada a E(T)',
        rejectedDescription:
            'A aresta é ignorada e a floresta parcial permanece inalterada. Por isso podem ser necessárias mais de n − 1 iterações.',
        acceptedDescription: (from, to) =>
            `A aresta entra em E(T) e os componentes de ${from} e ${to} passam a ser um só.`,
        completeTitle: 'Execução concluída',
        completeDescription: (target, total) =>
            `| E(T) | = | V(T) | − 1 = ${target}: o laço termina com peso total C(T) = ${total}.`,
        incompleteDescription: (target, total) =>
            `Todas as arestas foram analisadas sem atingir | V(T) | − 1 = ${target} arestas, portanto o grafo é desconexo. Peso total C(T) = ${total}.`,
        weightConclusion: (total, accepted, rejected) =>
            `Peso total: C(T) = ${total}, com ${accepted} ${plural(accepted, 'aresta', 'arestas')} em E(T) e ${rejected} ${plural(rejected, 'aresta ignorada', 'arestas ignoradas')} por formarem ciclo.`,
        iterationsConclusion: (iterations, accepted) =>
            `${plural(iterations, 'Foi necessária', 'Foram necessárias')} ${iterations} ${plural(iterations, 'iteração', 'iterações')} para ${accepted} ${plural(accepted, 'aresta aceita', 'arestas aceitas')}: como as arestas que formam ciclo precisam ser ignoradas, n − 1 iterações podem não bastar.`,
        treeConclusion:
            'O grafo é conexo, portanto o resultado é uma árvore geradora mínima (AGM).',
        forestConclusion: (components) =>
            `O grafo possui ${components} componentes conexos, portanto o resultado é uma floresta geradora mínima.`,
    },
};
