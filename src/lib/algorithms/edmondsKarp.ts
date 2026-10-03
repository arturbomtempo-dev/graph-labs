import { getDictionary } from '@/i18n/dictionaries';
import type { AlgorithmDefinition, NodeId } from '../graph/types';
import { runAugmentingMethod } from './augmentingFlow';
import { augmentingPathByBreadth, flowNetworkErrors } from './flowShared';

export const edmondsKarp: AlgorithmDefinition = {
    id: 'edmonds-karp',
    category: 'max-flow',
    needsStart: true,
    needsEnd: true,
    validate: flowNetworkErrors,
    run: ({ graph, startId, endId, order, locale }) => {
        const text = getDictionary(locale).algorithms['edmonds-karp'].trace;
        return runAugmentingMethod(
            graph,
            startId as NodeId,
            endId as NodeId,
            {
                methodName: text.methodName,
                findPath: augmentingPathByBreadth,
                explainChoice: text.explainChoice,
            },
            locale,
            order
        );
    },
};
