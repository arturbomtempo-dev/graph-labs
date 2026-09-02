import type { AlgorithmDefinition, NodeId } from '../graph/types';
import { runAugmentingMethod } from './augmentingFlow';
import { augmentingPathByBreadth, flowNetworkErrors } from './flowShared';

export const edmondsKarp: AlgorithmDefinition = {
    id: 'edmonds-karp',
    name: 'Método de Edmonds-Karp',
    shortName: 'Edmonds-Karp',
    category: 'Fluxo máximo',
    tagline:
        'Implementação eficiente de Ford-Fulkerson: a cada iteração escolhe o caminho aumentante mais curto, obtido por busca em largura.',
    complexity: 'O(n · m² )',
    needsStart: true,
    needsEnd: true,
    constraints: [
        'Exige rede de fluxo: grafo direcionado com capacidade u(e) > 0',
        'Requer uma fonte s e um sumidouro t',
        'Escolhe sempre o caminho aumentante com menos arestas',
    ],
    validate: (context) => flowNetworkErrors(context, 'o método de Edmonds-Karp'),
    run: ({ graph, startId, endId, order }) =>
        runAugmentingMethod(
            graph,
            startId as NodeId,
            endId as NodeId,
            {
                methodName: 'O método de Edmonds-Karp',
                findPath: augmentingPathByBreadth,
                explainChoice: (pathLabel, edgeCount) =>
                    `Uma busca em largura em G'(f) devolve o caminho aumentante com o menor número de arestas: ${pathLabel}, com ${edgeCount} aresta(s). É essa escolha que torna o método polinomial.`,
            },
            order
        ),
};
