import type { AlgorithmTexts } from '@/i18n/dictionaries';
import { plural } from '@/i18n/format';

export const edmonds: AlgorithmTexts['edmonds'] = {
    name: 'Método de Edmonds',
    shortName: 'Edmonds',
    tagline:
        'Busca caminhos M-aumentantes entre vértices expostos, contraindo os botões (blossoms) que aparecem, até que não exista mais nenhum.',
    complexity: 'O(n² · m)',
    constraints: [
        'Exige grafo não direcionado',
        'Ignora os pesos das arestas',
        'Trata grafo genérico, não apenas bipartido',
    ],
    reference: {
        idea: 'Pelo teorema de Berge, M tem cardinalidade máxima se e somente se não existe caminho M-aumentante. O método busca esses caminhos em uma floresta M-alternante; quando uma aresta liga dois vértices a distância par da mesma árvore, surge um ciclo ímpar, o botão (blossom), que é contraído em um pseudovértice.',
        pseudocode: [
            'Emparelhamento_Máximo(G)',
            '  1. M ← ∅',
            '  2. P ← Encontra_Caminho_Aumentante(G, M)',
            '  3. enquanto (P ≠ ∅) efetuar',
            '     a. M ← M ⊕ EP',
            '     b. P ← Encontra_Caminho_Aumentante(G, M)',
            '',
            'Encontra_Caminho_Aumentante(G, M)',
            '  1. F ← Inicializa_Floresta_Alternante(G, M)',
            '  2. para todo vértice desmarcado v ∈ F tal que',
            '     dist(v, F.raiz[v]) for par faça',
            '     a. enquanto ∃ aresta e = {v, w} desmarcada efetuar',
            '        i.   se w ∉ F então Adicionar_a_Floresta(M, F, v, w)',
            '        ii.  senão se dist(w, F.raiz[w]) for par então',
            '               retornar Obter_Novo_Caminho(G, M, F, v, w)',
            '        iii. Marcar aresta e',
            '     b. Marcar vértice v',
            '  3. retornar ∅',
            '',
            'Obter_Novo_Caminho(G, M, F, v, w)',
            '  1. se F.raiz[v] ≠ F.raiz[w] então',
            '       P ← ObterCaminho(F, F.raiz[v], v)',
            '            + ObterCaminho(F, w, F.raiz[w])',
            '  2. senão                          // botão (blossom)',
            '     a. B ← ObterCaminho(F, v, w) + v',
            '     b. G′ ← Contrair_Blossom_Grafo(G, B, z)',
            '     c. M′ ← Contrair_Blossom_Emparelhamento(M, B, z)',
            '     d. P ← Encontra_Caminho_Aumentante(G′, M′)',
            '     e. se z ∈ P então P ← Expandir_Blossom(P, G, B, z)',
            '  3. retornar P',
        ],
        invariant:
            'M ⊕ EP é sempre um emparelhamento com uma aresta a mais que M. Pelo teorema de Edmonds, M é máximo em G se e somente se M/B é máximo em G/B, o que legitima a contração dos botões.',
        pitfalls: [
            'Usar apenas busca em largura ou profundidade em grafo genérico: sem tratar os botões, caminhos M-aumentantes existentes deixam de ser encontrados.',
            'Ignorar a aresta {v, w} quando dist(w, F.raiz[w]) for ímpar: ela não gera caminho aumentante.',
            'Confundir emparelhamento maximal com máximo: maximal apenas não admite acrescentar arestas; máximo é o de maior cardinalidade. E emparelhamento máximo não implica casamento perfeito.',
        ],
    },
    issues: {
        undirectedOnly:
            'Emparelhamento é definido para grafo não direcionado: converta todas as arestas para não direcionadas.',
    },
    trace: {
        matchingTitle: 'Emparelhamento M',
        partnerColumn: 'Parceiro em M',
        exposedStatus: 'exposto',
        coveredStatus: 'coberto',
        exposedMetric: 'Vértices expostos',
        initTitle: 'Inicialização: M = ∅',
        initDescription:
            'O emparelhamento começa vazio, portanto todos os vértices estão expostos (livres). Enquanto existir caminho M-aumentante, M pode crescer.',
        blossomBadge: (base) => `botão ${base}`,
        blossomTitle: (base) => `Botão detectado e contraído em ${base}`,
        blossomDescription: (edge, members, base) =>
            `A aresta ${edge} liga dois vértices a distância par da raiz da mesma árvore, formando um ciclo de tamanho ímpar. O botão { ${members} } é contraído em um pseudovértice com base ${base}; todos os seus vértices passam a contar como pares.`,
        augmentingTitle: (vertex) => `Caminho M-aumentante encontrado até ${vertex}`,
        augmentingDescription: (vertex, root) =>
            `${vertex} está exposto e foi alcançado por um caminho M-alternante que parte da raiz exposta ${root}. Como o caminho começa e termina em vértices expostos, ele é M-aumentante, e todo caminho M-aumentante tem tamanho ímpar.`,
        growTitle: (from, to, partner) =>
            `Floresta cresce por {${from}, ${to}} e {${to}, ${partner}} ∈ M`,
        growDescription: (from, to, partner) =>
            `${to} ainda não estava na floresta. A aresta {${from}, ${to}} entra na árvore e, junto com ela, a aresta {${to}, ${partner}} de M. ${to} fica a distância ímpar da raiz e ${partner} a distância par, podendo continuar a busca.`,
        rootBadge: 'raiz',
        treeTitle: (root) => `Árvore M-alternante com raiz em ${root}`,
        treeDescription: (root) =>
            `${root} está exposto, então uma árvore M-alternante é iniciada nele. A busca procura um caminho M-alternante que termine em outro vértice exposto.`,
        noPathTitle: (root) => `Nenhum caminho M-aumentante a partir de ${root}`,
        noPathDescription: (root) =>
            `A árvore M-alternante com raiz em ${root} foi totalmente explorada sem alcançar outro vértice exposto. ${root} permanece exposto no emparelhamento final.`,
        augmentTitle: (size) => `M ← M ⊕ EP, com |M| = ${size}`,
        augmentDescription: (edges, root, endpoint) =>
            `A diferença simétrica retira de M as arestas do caminho que estavam em M e acrescenta as que não estavam. As arestas de M ao longo do caminho passam a ser ${edges}, e ${root} e ${endpoint} deixam de estar expostos. Pelo teorema de Berge, M cresceu em exatamente uma aresta.`,
        maximumTitle: 'Emparelhamento máximo obtido',
        maximumDescription: (size) =>
            `Não existe mais caminho M-aumentante em G, portanto, pelo teorema de Berge, M tem cardinalidade máxima: |M| = ${size}.`,
        matchingConclusion: (size, pairs) => `Emparelhamento máximo com |M| = ${size}: ${pairs}.`,
        augmentationsConclusion: (count) =>
            `${plural(count, 'Foi realizado', 'Foram realizados')} ${count} ${plural(count, 'aumento', 'aumentos')} a partir de M = ∅. Cada caminho M-aumentante encontrado aumenta |M| em exatamente uma unidade.`,
        perfectConclusion:
            'Todos os vértices estão cobertos, portanto M é um casamento perfeito (ou completo).',
        exposedConclusion: (count, vertices) =>
            `${plural(count, 'Resta', 'Restam')} ${count} ${plural(count, 'vértice exposto', 'vértices expostos')} (${vertices}): emparelhamento máximo não implica em todos os vértices saturados.`,
    },
};
