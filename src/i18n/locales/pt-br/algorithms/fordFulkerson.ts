import type { AlgorithmTexts } from '@/i18n/dictionaries';
import { plural } from '@/i18n/format';

export const fordFulkerson: AlgorithmTexts['ford-fulkerson'] = {
    name: 'Método de Ford-Fulkerson',
    shortName: 'Ford-Fulkerson',
    tagline:
        "Enquanto existir algum caminho aumentante em G'(f), envia por ele o gargalo δ e atualiza a rede residual.",
    complexity: 'O(m · f) com capacidades inteiras',
    constraints: [
        'Exige rede de fluxo: grafo direcionado com capacidade u(e) > 0',
        'Requer uma fonte s e um sumidouro t',
        'O caminho aumentante é escolhido de forma arbitrária',
    ],
    reference: {
        idea: 'Enquanto existir caminho aumentante da fonte s ao sumidouro t na rede residual G′(f), envia-se por ele o máximo possível, o gargalo δ, e a rede residual é atualizada. As arestas reversas permitem desfazer envios anteriores.',
        pseudocode: [
            'Rede residual G′(f): V(G′) = V(G) e, para e = (v, w) ∈ E:',
            '  se f(e) < u(e): aresta direta (v, w) com u (e) = u(e) − f(e)',
            '                                            r',
            '  se f(e) > 0:    aresta reversa (w, v) com capacidade f(e)',
            '',
            'Método de Ford-Fulkerson',
            '  1. para toda aresta e ∈ E(G) faça  f(e) ← 0',
            '  2. Construir a rede residual G′(f)',
            '  3. enquanto existir caminho aumentante P em G′(f) efetuar',
            '     a. δ ← min { u (e) | e ∈ P }        // "gargalo" de P',
            '                   r',
            '     b. para cada aresta (v, w) ∈ P faça',
            '        i.  se (v, w) for aresta direta então',
            '              f(v, w) ← f(v, w) + δ      // aumentar fluxo',
            '        ii. senão',
            '              f(w, v) ← f(w, v) − δ      // reduzir fluxo',
            '     c. Atualizar a rede residual G′(f)',
        ],
        invariant:
            'O fluxo f respeita sempre a condição de capacidade, 0 ≤ f(e) ≤ u(e), e a condição de conservação em todo nó interno. Pelo teorema do fluxo máximo e corte mínimo, ao final o valor do fluxo iguala a capacidade do corte s-t mínimo.',
        pitfalls: [
            'Esquecer de criar a aresta reversa na rede residual, o que impede desfazer envios feitos em iterações anteriores.',
            'Escolher caminhos aumentantes arbitrários: com capacidades irracionais o método pode não terminar. Escolher sempre o caminho aumentante com menos arestas (busca em largura) é o método de Edmonds-Karp.',
            'Assumir que o corte mínimo é qualquer corte: na solução ótima, S é o conjunto dos vértices alcançáveis a partir da fonte s na rede residual final.',
        ],
    },
    trace: {
        methodName: 'O método de Ford-Fulkerson',
        explainChoice: (path, edges) =>
            `O método não impõe critério de escolha: basta existir um caminho aumentante P em G'(f). Uma busca em profundidade encontrou ${path}, com ${edges} ${plural(edges, 'aresta', 'arestas')}.`,
    },
};
