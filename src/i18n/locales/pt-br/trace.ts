import type { Dictionary } from '@/i18n/dictionaries';
import { plural } from '@/i18n/format';

export const trace: Dictionary['trace'] = {
    columns: {
        vertex: 'Vértice',
        edge: 'Aresta',
        type: 'Tipo',
        status: 'Situação',
        component: 'Componente',
        vertices: 'Vértices',
        weight: 'Peso',
        decision: 'Decisão',
        parent: 'pai',
    },
    initialization: 'Inicialização',
    visitOrder: 'Ordem de visita',
    queue: 'Fila',
    edgeClassification: 'Classificação das arestas',
    searchComplete: 'Busca concluída',
    issues: {
        addVertex: 'Adicione pelo menos um vértice ao grafo.',
        addEdge: 'Adicione pelo menos uma aresta ao grafo.',
        selectRoot: 'Selecione o vértice raiz.',
        directedOnly: (method) =>
            `${method} opera sobre grafos direcionados: converta todas as arestas para direcionadas.`,
        undirectedOnly: (method) =>
            `${method} opera sobre grafos não direcionados: converta todas as arestas para não direcionadas.`,
    },
    shortestPath: {
        tableTitle: 'dist e pred',
        relaxedTitle: (from, to) => `Aresta tensa (${from}, ${to}): relaxada`,
        relaxedDescription: (values) =>
            `dist[${values.to}] = ${values.current} > dist[${values.from}] + d = ${values.fromDistance} + ${values.weight} = ${values.candidate}. Logo dist[${values.to}] ← ${values.candidate} e pred[${values.to}] ← ${values.from}.`,
        doneTitle: 'Caminhos mínimos calculados',
        finalDistances: (root, distances) => `dist[ ] final a partir de ${root}: ${distances}.`,
        pathConclusion: (target, path, weight) =>
            `Caminho mínimo até ${target}, obtido por pred[ ]: ${path} (peso ${weight}).`,
    },
    spanningTree: {
        edgesMetric: 'Arestas em E(T)',
        totalWeightMetric: 'Peso total C(T)',
    },
    flow: {
        issues: {
            selectSource: 'Selecione o vértice fonte s.',
            selectSink: 'Selecione o vértice sumidouro t.',
            distinctEndpoints: 'A fonte s e o sumidouro t precisam ser vértices diferentes.',
            directedOnly:
                'Uma rede de fluxo é um grafo direcionado: converta todas as arestas para direcionadas.',
            positiveCapacity: 'Em uma rede de fluxo, toda aresta tem capacidade u(e) > 0.',
        },
        residualTable: { title: 'Fluxo e capacidades residuais', edge: 'Aresta e' },
        flowValue: 'Valor do fluxo',
        cutCapacity: 'Capacidade do corte(S)',
        maxFlowConclusion: (source, sink, value) =>
            `Fluxo máximo entre s = ${source} e t = ${sink}: ${value}.`,
        cutConclusion: (edges, capacity) =>
            `Corte s-t mínimo: corte(S) = { ${edges} }, de capacidade ${capacity}, igual ao valor do fluxo máximo, como afirma o teorema do fluxo máximo e corte mínimo.`,
        limitHint: 'O limite de iterações foi atingido: revise as capacidades da rede.',
        augmenting: {
            initialTitle: "Rede residual inicial G'(f)",
            initialDescription: (source, sink) =>
                `f(e) = 0 para toda aresta, portanto a capacidade residual de cada aresta direta é u_r(e) = u(e) − f(e) = u(e). A fonte é s = ${source}, o sumidouro é t = ${sink} e os demais são nós internos.`,
            noPathTitle: "Não existe caminho aumentante em G'(f)",
            noPathDescription: (reachable) =>
                `Em G'(f), a partir de s alcança-se apenas S = { ${reachable} }. Esse é o conjunto S do corte s-t mínimo, e as arestas de corte(S), com uma extremidade em S e a outra fora, estão destacadas em vermelho.`,
            augmentingPaths: 'Caminhos aumentantes',
            pathTitle: (iteration, path) => `Caminho aumentante ${iteration}: ${path}`,
            bottleneckSentence: (value) => `O gargalo é δ = min { u_r(e) | e ∈ P } = ${value}.`,
            bottleneck: 'Gargalo δ',
            edgesInPath: 'Arestas em P',
            augmentedTitle: (value) => `Fluxo aumentado em δ = ${value}`,
            augmentedDescription: (value, total) =>
                `Nas arestas diretas de P faz-se f(v, w) ← f(v, w) + δ; nas reversas, f(w, v) ← f(w, v) − δ. Cada aresta direta perde ${value} de capacidade residual e a reversa correspondente ganha a mesma quantia, o que permite desfazer o envio em iterações futuras. O valor do fluxo passa a ser ${total}.`,
            pathsConclusion: (method, count, paths) =>
                `${method} usou ${count} ${plural(count, 'caminho aumentante', 'caminhos aumentantes')}: ${paths}.`,
            limitConclusion: (value, iterations) =>
                `Valor do fluxo alcançado: ${value} após ${iterations} ${plural(iterations, 'iteração', 'iterações')}.`,
        },
    },
    coloring: {
        tableTitle: 'Cores atribuídas',
        colorColumn: 'cor(v)',
        colorsUsed: 'Cores utilizadas',
        badge: (color) => `cor ${color}`,
        colorTitle: (vertex, color) => `${vertex} recebe a cor ${color}`,
        completeTitle: 'Coloração concluída',
        undirectedOnly:
            'A coloração de vértices é definida para grafo não direcionado: converta todas as arestas para não direcionadas.',
        boundConclusion: (maxDegree) =>
            `Δ(G) = ${maxDegree}, e vale sempre χ(G) ≤ Δ(G) + 1 = ${maxDegree + 1}.`,
    },
    topological: {
        undirectedIssue:
            'Não é possível estabelecer uma ordenação topológica em grafo não direcionado: converta todas as arestas para direcionadas.',
        result: 'Ordena_Top',
        completeTitle: 'Ordenação topológica concluída',
        orderConclusion: (order) => `Ordenação topológica: ${order}.`,
        cycleConclusion:
            'Um grafo com ciclo não admite ordenação topológica, pois não é possível estabelecer uma relação de precedência entre os vértices do ciclo.',
    },
};
