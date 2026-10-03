import type { AlgorithmTexts } from '@/i18n/dictionaries';
import { plural } from '@/i18n/format';

export const welshPowell: AlgorithmTexts['welsh-powell'] = {
    name: 'Método de Welsh-Powell',
    shortName: 'Welsh-Powell',
    tagline:
        'Ordena os vértices em ordem não crescente de graus e colore, com uma mesma cor, todos os que não estiverem conectados a um vértice já colorido com ela.',
    complexity: 'O(n² )',
    constraints: [
        'Exige grafo não direcionado',
        'Coloração aproximada, não necessariamente mínima',
        'Costuma usar menos cores que o método guloso',
    ],
    reference: {
        idea: 'Refinamento do método guloso: os vértices são ordenados em ordem não crescente de graus e cada cor é distribuída em uma passagem completa pela lista, colorindo todos os vértices que não estejam conectados a um já colorido com aquela cor.',
        pseudocode: [
            'Método de Welsh-Powell',
            '  1. Ordenar os vértices em ordem não crescente de graus',
            '     v₁, v₂, . . ., vₙ',
            '  2. Identificar as cores com índices, adicionando mais cores',
            '     quando necessário',
            '  3. Colorir v₁ com a primeira cor',
            '  4. Seguir pela lista de vértices colorindo todos os vértices',
            '     não conectados a um vértice já colorido, usando sempre',
            '     a mesma cor',
            '  5. Repetir o passo 4 para todos os vértices não coloridos',
            '     usando uma nova cor, sempre respeitando a ordem não',
            '     crescente de graus, até que todos estejam coloridos',
        ],
        invariant:
            'Cada cor forma um conjunto independente: nenhum par de vértices que recebem a mesma cor é adjacente. O método termina porque cada passagem colore pelo menos um vértice.',
        pitfalls: [
            'Tomar o resultado como ótimo: existe contraexemplo em que Welsh-Powell usa 3 cores num grafo bipartido, para o qual χ(G) = 2.',
            'Abandonar a ordem por grau ao iniciar uma nova cor: a lista ordenada é percorrida do começo em cada passagem.',
            'Colorir um vértice adjacente a outro já colorido com a cor da passagem atual: a verificação é contra os vértices já coloridos com aquela cor.',
        ],
    },
    trace: {
        sortTitle: 'Passo 1: ordenação por grau',
        sortDescription: (order) =>
            `Os vértices são ordenados em ordem não crescente de graus: ${order}.`,
        passTitle: (color) => `Cor ${color}: nova passagem pela lista`,
        passDescription: (color) =>
            `Percorre-se a lista ordenada colorindo com a cor ${color} todo vértice ainda sem cor que não seja adjacente a nenhum vértice já colorido com ela.`,
        blockedTitle: (vertex, color) => `${vertex} não pode receber a cor ${color}`,
        blockedDescription: (vertex, color) =>
            `${vertex} é adjacente a um vértice já colorido com a cor ${color} nesta passagem, portanto fica para uma cor seguinte.`,
        colorDescription: (vertex, color) =>
            `${vertex} não é adjacente a nenhum vértice já colorido com a cor ${color}. Seus vizinhos ficam bloqueados para esta cor nesta passagem.`,
        passDoneTitle: (color) => `Cor ${color} encerrada`,
        passDoneDescription: (color, painted, remaining) =>
            `A cor ${color} foi atribuída a ${painted.length} ${plural(painted.length, 'vértice', 'vértices')}: ${painted.join(', ') || '-'}. ${remaining ? 'Ainda restam vértices sem cor, então uma nova cor é iniciada.' : 'Todos os vértices estão coloridos.'}`,
        completeDescription: (colors) =>
            `Todos os vértices foram coloridos com ${colors} ${plural(colors, 'cor', 'cores')}, sempre respeitando a ordem não crescente de graus.`,
        resultConclusion: (colors) =>
            `Welsh-Powell produziu uma ${colors}-coloração, logo χ(G) ≤ ${colors}.`,
        comparisonConclusion:
            'Ordenar por grau costuma dar um resultado melhor que o do método guloso, mas não garante a coloração mínima. Existem contraexemplos, como grafos bipartidos em que o método usa 3 cores embora χ(G) = 2.',
    },
};
