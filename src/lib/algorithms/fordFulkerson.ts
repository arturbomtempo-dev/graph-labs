import { getDictionary } from '@/i18n/dictionaries';
import type { AlgorithmDefinition, NodeId } from '../graph/types';
import { runAugmentingMethod } from './augmentingFlow';
import { augmentingPathByDepth, flowNetworkErrors } from './flowShared';

export const fordFulkerson: AlgorithmDefinition = {
    id: 'ford-fulkerson',
    category: 'max-flow',
    needsStart: true,
    needsEnd: true,
    validate: flowNetworkErrors,
    run: ({ graph, startId, endId, order, locale }) => {
        const text = getDictionary(locale).algorithms['ford-fulkerson'].trace;
        return runAugmentingMethod(
            graph,
            startId as NodeId,
            endId as NodeId,
            {
                methodName: text.methodName,
                findPath: augmentingPathByDepth,
                explainChoice: text.explainChoice,
            },
            locale,
            order
        );
    },
};
