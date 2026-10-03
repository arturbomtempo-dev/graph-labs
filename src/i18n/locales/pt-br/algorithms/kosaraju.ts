import type { AlgorithmTexts } from '@/i18n/dictionaries';
import { plural } from '@/i18n/format';

export const kosaraju: AlgorithmTexts['kosaraju'] = {
    name: 'Método de Kosaraju',
    shortName: 'Kosaraju',
    tagline:
        'Encontra os componentes fortemente conexos (f-conexos) com duas buscas em profundidade: uma em G e outra no grafo reverso Gᴿ.',
    complexity: 'O(n + m)',
    constraints: ['Exige grafo direcionado', 'Ignora os pesos das arestas'],
    reference: {
        idea: 'Uma primeira busca em profundidade em G registra os tempos de término TT. A segunda busca, feita no grafo reverso Gᴿ e tomando os vértices em ordem decrescente de TT, produz uma floresta em que cada árvore é exatamente um componente fortemente conexo (f-conexo).',
        pseudocode: [
            'Método de Kosaraju',
            '  1. Fazer busca em profundidade em G',
            '       // salvar os tempos de término TT de cada vértice',
            '  2. Construir o grafo reverso (ou transposto) Gᴿ',
            '       // se (v, w) ∈ E(G) então (w, v) ∈ E(Gᴿ)',
            '  3. Fazer busca em profundidade em Gᴿ tomando os vértices',
            '     em ordem decrescente de TT',
            '',
            '  Cada árvore da floresta de profundidade obtida no passo 3',
            '  corresponde a um componente fortemente conexo de G.',
        ],
        invariant:
            'A ordem decrescente de tempo de término garante que a busca em Gᴿ iniciada em um vértice nunca escapa do componente f-conexo a que ele pertence.',
        pitfalls: [
            'Esquecer de construir o grafo reverso Gᴿ antes da segunda busca.',
            'Percorrer a segunda busca na ordem crescente de TT em vez da decrescente.',
            'Confundir os três níveis de conectividade de um grafo direcionado conexo: s-conexo (grafo subjacente conexo), sf-conexo (para todo par, um alcança o outro) e f-conexo (todos mutuamente alcançáveis).',
        ],
    },
    trace: {
        finishStackTitle: 'Pilha de finalização',
        componentsTitle: 'Componentes fortemente conexos',
        step1Title: 'Passo 1: busca em profundidade em G',
        step1Description:
            'A primeira busca em profundidade percorre G e empilha cada vértice no momento em que seu tempo de término TT é definido.',
        visitTitle: (vertex) => `Visita ${vertex}`,
        visitDescription: (vertex) => `${vertex} é marcado na primeira busca em profundidade.`,
        finishTitle: (vertex) => `Finaliza ${vertex}`,
        finishDescription: (vertex) =>
            `${vertex} não tem mais vizinhos a explorar: seu TT é definido e ele é empilhado. O topo da pilha é o vértice de maior TT.`,
        step2Title: 'Passo 2: construção do grafo reverso Gᴿ',
        step2Description: (order) =>
            `Todas as arestas são invertidas: se (v, w) ∈ E(G) então (w, v) ∈ E(Gᴿ). A segunda busca percorrerá Gᴿ em ordem decrescente de TT: ${order}.`,
        joinTitle: (vertex, component) => `${vertex} entra em ${component}`,
        joinDescription: (vertex) =>
            `Em Gᴿ, ${vertex} é alcançável a partir da raiz desta árvore de profundidade, portanto pertence ao mesmo componente fortemente conexo.`,
        newComponentTitle: (vertex) => `Novo componente a partir de ${vertex}`,
        newComponentDescription: (vertex, component) =>
            `${vertex} é o vértice ainda não marcado com maior TT, então ele é a raiz de uma nova árvore de profundidade em Gᴿ, que corresponde ao componente ${component}.`,
        step3Title: 'Passo 3: componentes identificados',
        step3Description: (count) =>
            `Cada árvore da floresta de profundidade obtida em Gᴿ é um componente fortemente conexo: G possui ${count} ${plural(count, 'componente f-conexo', 'componentes f-conexos')}. As arestas destacadas ligam vértices de um mesmo componente.`,
        countConclusion: (count) =>
            `${plural(count, 'Foi encontrado', 'Foram encontrados')} ${count} ${plural(count, 'componente fortemente conexo', 'componentes fortemente conexos')}.`,
        stronglyConnectedConclusion:
            'Todos os vértices são mutuamente alcançáveis, portanto G é fortemente conexo (f-conexo).',
        notStronglyConnectedConclusion:
            'Como há mais de um componente f-conexo, G não é fortemente conexo: existe par de vértices que não se alcançam mutuamente.',
    },
};
