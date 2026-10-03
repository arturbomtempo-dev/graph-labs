import type { AlgorithmTexts } from '@/i18n/dictionaries';
import { plural } from '@/i18n/format';

export const edmondsKarp: AlgorithmTexts['edmonds-karp'] = {
    name: 'Método de Edmonds-Karp',
    shortName: 'Edmonds-Karp',
    tagline:
        'Implementação eficiente de Ford-Fulkerson: a cada iteração escolhe o caminho aumentante mais curto, obtido por busca em largura.',
    complexity: 'O(n · m² )',
    constraints: [
        'Exige rede de fluxo: grafo direcionado com capacidade u(e) > 0',
        'Requer uma fonte s e um sumidouro t',
        'Escolhe sempre o caminho aumentante com menos arestas',
    ],
    reference: {
        idea: 'Implementação eficiente do método de Ford-Fulkerson: a cada iteração seleciona o caminho aumentante da rede residual que seja mais curto, isto é, que use o menor número de arestas. Esse caminho é encontrado por uma busca em largura.',
        pseudocode: [
            'Método de Edmonds-Karp',
            '  1. para toda aresta e ∈ E(G) faça  f(e) ← 0',
            '  2. Construir a rede residual G′(f)',
            '  3. enquanto existir algum caminho aumentante P em G′(f) efetuar',
            '     a. Seja P o caminho aumentante em G′(f) com menor número',
            '        de arestas   // obtido por busca em largura',
            '     b. δ ← min { u (e) | e ∈ P }',
            '                   r',
            '     c. para cada aresta (v, w) ∈ P faça',
            '        i.  se (v, w) for aresta direta então',
            '              f(v, w) ← f(v, w) + δ',
            '        ii. senão',
            '              f(w, v) ← f(w, v) − δ',
            '     d. Atualizar a rede residual G′(f)',
        ],
        invariant:
            'O comprimento do caminho aumentante escolhido nunca diminui de uma iteração para a seguinte. O número máximo de caminhos aumentantes é O(n·m) e cada um é encontrado em O(m), donde O(n·m²).',
        pitfalls: [
            'Usar busca em profundidade: volta-se ao método de Ford-Fulkerson genérico, que é apenas pseudopolinomial, O(m·f), com f igual ao valor do fluxo máximo.',
            'Na rede com duas arestas de capacidade 100 ligadas por uma de capacidade 1, a escolha arbitrária pode exigir 200 iterações; a escolha do caminho mais curto exige 2.',
            'Esquecer que o método foi publicado de forma independente por Dinitz (1970) e por Edmonds e Karp (1972).',
        ],
    },
    trace: {
        methodName: 'O método de Edmonds-Karp',
        explainChoice: (path, edges) =>
            `Uma busca em largura em G'(f) devolve o caminho aumentante com o menor número de arestas: ${path}, com ${edges} ${plural(edges, 'aresta', 'arestas')}. É essa escolha que torna o método polinomial.`,
    },
};
