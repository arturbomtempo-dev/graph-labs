import type { AlgorithmTexts } from '@/i18n/dictionaries';
import { plural } from '@/i18n/format';

export const dinic: AlgorithmTexts['dinic'] = {
    name: 'Método de Dinic',
    shortName: 'Dinic',
    tagline:
        'A cada iteração constrói a rede em níveis GL a partir de G′(f) e determina nela um fluxo de bloqueio.',
    complexity: 'O(n² · m)',
    constraints: [
        'Exige rede de fluxo: grafo direcionado com capacidade u(e) > 0',
        'Requer uma fonte s e um sumidouro t',
        'No máximo n − 1 fluxos de bloqueio',
    ],
    reference: {
        idea: 'Em vez de aumentar um caminho por vez, constrói a rede em níveis GL a partir de G′(f) e determina nela um fluxo de bloqueio inteiro. Como o número de níveis cresce pelo menos uma unidade a cada iteração, existem no máximo n − 1 fluxos de bloqueio.',
        pseudocode: [
            'Rede em níveis GL: V(GL) = V(G′) e, para (v, w) ∈ E(G′):',
            '  (v, w) ∈ E(GL) com capacidade u (e) se dist(w) = dist(v) + 1,',
            '                                 r',
            '  em que dist(v) é a menor distância geodésica de s até v',
            '',
            'Fluxo de bloqueio fb: fluxo em GL tal que, mantidas apenas as',
            '  arestas com capacidade maior que fb, não exista mais',
            '  caminho aumentante em GL',
            '',
            'Método de Dinic',
            '  1. para toda aresta e ∈ E(G) faça  f(e) ← 0',
            '  2. Construir a rede residual G′(f)',
            '  3. Construir a rede em níveis GL a partir de G′(f)',
            '  4. enquanto dist(t) < ∞ efetuar',
            '     a. Determinar um fluxo de bloqueio fb em GL',
            '     b. Atualizar o fluxo f usando fb',
            '     c. Atualizar a rede residual G′(f)',
            '     d. Construir a rede em níveis GL a partir de G′(f)',
        ],
        invariant:
            'dist(t) é estritamente crescente entre iterações, logo há no máximo n − 1 fluxos de bloqueio. Cada fluxo de bloqueio é obtido em O(n·m), donde O(n²·m).',
        pitfalls: [
            'Buscar caminhos fora de GL: só valem as arestas (v, w) com dist(w) = dist(v) + 1.',
            'Reconstruir a rede em níveis a cada caminho, e não a cada fluxo de bloqueio, pois é o fluxo de bloqueio completo que caracteriza uma iteração.',
            'Parar quando um caminho satura: o fluxo de bloqueio só termina quando não existir mais nenhum caminho de s a t em GL.',
        ],
    },
    trace: {
        levelsTitle: 'Rede em níveis GL',
        initTitle: 'Rede residual inicial G′(f)',
        initDescription: (source, sink) =>
            `f(e) = 0 para toda aresta, portanto u_r(e) = u(e). A fonte é s = ${source} e o sumidouro é t = ${sink}.`,
        endTitle: 'dist(t) = ∞, o laço termina',
        endDescription: (reachable) =>
            `O sumidouro não é mais alcançável em G′(f), portanto não existe caminho aumentante nem fluxo de bloqueio. O conjunto S = { ${reachable} } define o corte s-t mínimo.`,
        blockingFlowsMetric: 'Fluxos de bloqueio',
        blockingFlowsConclusion: (count, flows) =>
            `${plural(count, 'Foi necessário', 'Foram necessários')} ${count} ${plural(count, 'fluxo de bloqueio', 'fluxos de bloqueio')}: ${flows}.`,
        levelsConclusion:
            'O número de níveis aumenta pelo menos uma unidade a cada fluxo de bloqueio, portanto existem no máximo n − 1 iterações.',
        levelGraphTitle: (phase, distance) => `Rede em níveis ${phase}: dist(t) = ${distance}`,
        levelGraphDescription: (distance) =>
            `Uma busca em largura em G′(f) define dist(v) para cada vértice. GL contém apenas as arestas (v, w) de G′(f) com dist(w) = dist(v) + 1, destacadas em laranja. Todo caminho de s a t em GL tem exatamente ${distance} ${plural(distance, 'aresta', 'arestas')}.`,
        pathTitle: (phase, path, label) => `Fluxo de bloqueio ${phase}, caminho ${path}: ${label}`,
        pathDescription: (path, bottleneck) =>
            `Em GL há o caminho ${path}, com gargalo δ = ${bottleneck}. Após o envio, pelo menos uma de suas arestas satura e deixa de pertencer a GL, o que faz o fluxo de bloqueio avançar.`,
        blockingFlowMetric: 'Fluxo de bloqueio',
        phaseDoneTitle: (phase, value) => `Fluxo de bloqueio ${phase} determinado: fb = ${value}`,
        phaseDoneDescription: (paths, value) =>
            `Não há mais caminho de s a t em GL: o fluxo de bloqueio está completo, com ${paths} ${plural(paths, 'caminho', 'caminhos')} e valor ${value}. O fluxo f é atualizado, e uma nova rede residual e uma nova rede em níveis são construídas.`,
        limitConclusion: (value, phases) =>
            `Valor do fluxo alcançado: ${value} após ${phases} ${plural(phases, 'fluxo de bloqueio', 'fluxos de bloqueio')}.`,
    },
};
