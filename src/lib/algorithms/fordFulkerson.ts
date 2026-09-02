import type { AlgorithmDefinition, NodeId } from '../graph/types';
import { runAugmentingMethod } from './augmentingFlow';
import { augmentingPathByDepth, flowNetworkErrors } from './flowShared';

export const fordFulkerson: AlgorithmDefinition = {
    id: 'ford-fulkerson',
    name: 'Método de Ford-Fulkerson',
    shortName: 'Ford-Fulkerson',
    category: 'Fluxo máximo',
    tagline:
        "Enquanto existir algum caminho aumentante em G'(f), envia por ele o gargalo δ e atualiza a rede residual.",
    complexity: 'O(m · f) com capacidades inteiras',
    needsStart: true,
    needsEnd: true,
    constraints: [
        'Exige rede de fluxo: grafo direcionado com capacidade u(e) > 0',
        'Requer uma fonte s e um sumidouro t',
        'O caminho aumentante é escolhido de forma arbitrária',
    ],
    validate: (context) => flowNetworkErrors(context, 'o método de Ford-Fulkerson'),
    run: ({ graph, startId, endId }) =>
        runAugmentingMethod(graph, startId as NodeId, endId as NodeId, {
            methodName: 'O método de Ford-Fulkerson',
            findPath: augmentingPathByDepth,
            explainChoice: (pathLabel, edgeCount) =>
                `O método não impõe critério de escolha: basta existir um caminho aumentante P em G'(f). Uma busca em profundidade encontrou ${pathLabel}, com ${edgeCount} aresta(s).`,
        }),
};
