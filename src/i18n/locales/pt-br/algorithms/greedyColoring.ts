import type { AlgorithmTexts } from '@/i18n/dictionaries';
import { plural } from '@/i18n/format';

export const greedyColoring: AlgorithmTexts['greedy-coloring'] = {
    name: 'Método guloso',
    shortName: 'Coloração gulosa',
    tagline:
        'Percorre os vértices em uma ordem qualquer e atribui a cada um a cor de menor índice não utilizada por nenhum de seus vizinhos.',
    complexity: 'O(n + m)',
    constraints: [
        'Exige grafo não direcionado',
        'Coloração aproximada, não necessariamente mínima',
        'O resultado depende da ordem dos vértices',
    ],
    reference: {
        idea: 'Não há método eficiente para obter a coloração mínima de um grafo, mas é possível obter rapidamente uma coloração aproximada: percorrem-se os vértices em uma ordem qualquer, atribuindo a cada um a cor de menor índice não utilizada por seus vizinhos.',
        pseudocode: [
            'Método Guloso',
            '  1. Considerar os vértices do grafo em uma ordem qualquer',
            '     v₁, v₂, . . ., vₙ',
            '  2. Identificar as cores com índices, adicionando mais cores',
            '     quando necessário',
            '  3. Colorir v₁ com a primeira cor',
            '  4. A cada iteração, atribuir ao vértice corrente a cor de',
            '     menor índice não utilizada por nenhum de seus vizinhos',
        ],
        invariant:
            'A cada passo a coloração parcial é válida: cor(v) ≠ cor(w) para todo par de vértices adjacentes já coloridos. Como um vértice tem no máximo Δ(G) vizinhos, o método nunca usa mais que Δ(G) + 1 cores.',
        pitfalls: [
            'Tomar o número de cores obtido como o número cromático: o resultado depende da ordem dos vértices e em geral χ(G) é menor.',
            'Esquecer os limites conhecidos: ω(G) ≤ χ(G) ≤ Δ(G) + 1 e, pelo Teorema de Brooks, χ(G) ≤ Δ(G) se G for simples, não completo e não for ciclo ímpar.',
            'Aplicar a grafo direcionado: a coloração de vértices é definida para grafo não direcionado.',
        ],
    },
    trace: {
        initDescription: (order) =>
            `Nenhum vértice está colorido. Os vértices serão considerados na ordem ${order}. Qualquer ordem é válida, mas o resultado depende dela.`,
        neighborsDescription: (vertex, colors, chosen) =>
            `Os vizinhos já coloridos de ${vertex} usam ${plural(colors.length, 'a cor', 'as cores')} ${colors.join(', ')}. A cor de menor índice ainda livre é a ${chosen}.`,
        freeDescription: (vertex, chosen) =>
            `Nenhum vizinho de ${vertex} está colorido, então ele recebe a cor de menor índice: a ${chosen}.`,
        completeDescription: (used) =>
            `Todos os vértices foram coloridos usando ${used} ${plural(used, 'cor', 'cores')}. Vértices adjacentes têm cores diferentes, portanto a coloração é válida.`,
        resultConclusion: (used) =>
            `O método guloso produziu uma ${used}-coloração, logo χ(G) ≤ ${used}.`,
        orderConclusion:
            'O resultado do método guloso depende da ordem em que os vértices são considerados: outra ordem pode produzir menos cores.',
    },
};
