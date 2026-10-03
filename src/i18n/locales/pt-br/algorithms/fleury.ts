import type { AlgorithmTexts } from '@/i18n/dictionaries';
import { joinList, plural } from '@/i18n/format';

export const fleury: AlgorithmTexts['fleury'] = {
    name: 'Método de Fleury',
    shortName: 'Fleury',
    tagline:
        'Constrói um trajeto euleriano caminhando pelo grafo e evitando atravessar uma ponte enquanto houver outra aresta disponível.',
    complexity: 'O(m² )',
    constraints: [
        'Exige grafo não direcionado e conexo',
        'No máximo 2 vértices de grau ímpar',
        'Ignora os pesos das arestas',
    ],
    reference: {
        idea: 'Um grafo conexo é euleriano se e somente se todos os seus vértices tiverem grau par (Teorema de Euler), e semi-euleriano se existirem exatamente dois vértices de grau ímpar. O método caminha pelo grafo removendo as arestas percorridas e evita atravessar uma ponte enquanto houver outra opção.',
        pseudocode: [
            'Método de Fleury',
            '  1. se V(G) possuir 3 ou mais vértices de grau ímpar então PARE',
            "  2. Seja G' = (V', E') tal que V' ← V(G) e E' ← E(G)",
            "  3. Selecionar vértice inicial v ∈ V'",
            '       (escolher v cujo grau seja ímpar, se houver)',
            "  4. enquanto E' ≠ ∅ efetuar",
            '     a. se d(v) > 1 então',
            "          Selecionar aresta {v, w} que não seja ponte em G'",
            '        senão',
            "          Selecionar a única aresta {v, w} disponível em G'",
            "     c. v ← w;   E' ← E' − {v, w}",
            '',
            '  // Caminhar de v para w e eliminar a aresta percorrida',
        ],
        invariant:
            "O trajeto construído nunca repete arestas e, ao evitar pontes, mantém as arestas restantes de G' conexas, garantindo que a caminhada só termine quando todas tiverem sido percorridas.",
        pitfalls: [
            'Atravessar uma ponte enquanto existe outra aresta disponível: as arestas do outro lado ficam inalcançáveis e o trajeto termina cedo.',
            'Começar por um vértice de grau par em grafo semi-euleriano: o trajeto precisa partir de um dos dois vértices de grau ímpar.',
            'Confundir com grafo hamiltoniano: euleriano passa por cada aresta uma vez (trajeto), hamiltoniano por cada vértice uma vez (caminho).',
        ],
    },
    issues: {
        undirectedOnly:
            'O método de Fleury é definido para grafo não direcionado: converta todas as arestas para não direcionadas.',
        tooManyOdd: (vertices) =>
            `O grafo possui ${vertices.length} vértices de grau ímpar (${vertices.join(', ')}). Um grafo conexo é euleriano se todos os graus forem pares e semi-euleriano se houver exatamente dois vértices de grau ímpar.`,
        disconnected:
            'O grafo não é conexo: o teorema de Euler exige um grafo conexo para que exista trajeto ou ciclo euleriano.',
        mustStartAtOdd: (vertices) =>
            `Com vértices de grau ímpar, o trajeto euleriano precisa começar em um deles: ${joinList(vertices, 'ou')}.`,
    },
    trace: {
        remainingTitle: "Arestas restantes em E'",
        traversedStatus: (position) => `percorrida (${position}ª)`,
        pendingStatus: "em E'",
        degreesTitle: "Graus em G'",
        degreeInRemaining: "d(v) em G'",
        degreeInOriginal: 'd(v) em G',
        trailLabel: 'Trajeto',
        startBadge: 'início',
        endBadge: 'fim',
        initTitle: (vertex) => `Inicialização: vértice inicial ${vertex}`,
        initEulerian: (vertex) =>
            `Todos os vértices têm grau par, portanto o grafo é euleriano e existe ciclo euleriano. G' começa igual a G e a caminhada parte de ${vertex}, escolhido livremente.`,
        initSemiEulerian: (oddVertices, start) =>
            `Há exatamente ${oddVertices.length} vértices de grau ímpar (${oddVertices.join(', ')}), portanto o grafo é semi-euleriano. A caminhada precisa partir de um deles: ${start}.`,
        onlyEdgeReason: (vertex) =>
            `${vertex} tem apenas uma aresta disponível em G', então ela é percorrida mesmo sendo ponte.`,
        avoidBridgesReason: (available, bridges, chosen) =>
            `Entre as ${available} arestas disponíveis, ${bridges.join(', ')} ${plural(bridges.length, 'é ponte', 'são pontes')} em G' e ${plural(bridges.length, 'é evitada', 'são evitadas')}. Escolhe-se ${chosen}, que não é ponte.`,
        noBridgesReason: (available, chosen) =>
            `Nenhuma das ${available} arestas disponíveis é ponte em G', então qualquer uma serve. Escolhe-se ${chosen}.`,
        allBridgesReason:
            "Todas as arestas disponíveis são pontes em G', então uma delas precisa ser percorrida.",
        analyzeTitle: (vertex) => `Analisa as arestas incidentes a ${vertex}`,
        walkTitle: (vertex) => `Caminha para ${vertex}`,
        walkDescription: (vertex, remaining) =>
            `A aresta é percorrida e removida de E': v ← ${vertex}. ${plural(remaining, 'Resta', 'Restam')} ${remaining} ${plural(remaining, 'aresta', 'arestas')} em G'.`,
        circuitTitle: 'Ciclo euleriano obtido',
        trailTitle: 'Trajeto euleriano obtido',
        interruptedTitle: 'Caminhada interrompida',
        completeDescription: (total) =>
            `E' ficou vazio: todas as ${total} arestas foram percorridas exatamente uma vez.`,
        interruptedDescription: (remaining) =>
            `A caminhada terminou com ${remaining} ${plural(remaining, 'aresta', 'arestas')} ainda em E'.`,
        trailConclusion: (closed, trail) => `${closed ? 'Ciclo' : 'Trajeto'} euleriano: ${trail}.`,
        countConclusion: (used, total) =>
            `${plural(used, 'Foi percorrida', 'Foram percorridas')} ${used} de ${total} ${plural(total, 'aresta', 'arestas')}, cada uma exatamente uma vez.`,
        eulerianConclusion:
            'Todos os vértices têm grau par, portanto o grafo é euleriano: o trajeto é fechado e começa e termina no mesmo vértice.',
        semiEulerianConclusion: (oddVertices) =>
            `O grafo tem exatamente dois vértices de grau ímpar (${joinList(oddVertices, 'e')}), portanto é semi-euleriano: o trajeto é aberto e começa e termina neles.`,
    },
};
