import { useCallback, useEffect, useMemo, useState } from 'react';
import type { AlgorithmContext, AlgorithmDefinition, AlgorithmTrace } from '@/lib/graph/types';

export const playbackSpeeds = [
    { label: '0,5×', value: 1600 },
    { label: '1×', value: 800 },
    { label: '2×', value: 400 },
    { label: '4×', value: 180 },
];

interface RunState {
    algorithmId: string;
    trace: AlgorithmTrace;
}

export function useAlgorithmRunner() {
    const [run, setRun] = useState<RunState | null>(null);
    const [stepIndex, setStepIndex] = useState(0);
    const [playRequested, setPlayRequested] = useState(false);
    const [interval, setIntervalValue] = useState(800);
    const [error, setError] = useState<string | null>(null);

    const totalSteps = run?.trace.steps.length ?? 0;
    const currentStep = run?.trace.steps[stepIndex] ?? null;
    const isFinished = totalSteps > 0 && stepIndex >= totalSteps - 1;
    const isPlaying = playRequested && totalSteps > 0 && !isFinished;

    useEffect(() => {
        if (!isPlaying) return;
        const timer = window.setTimeout(() => setStepIndex((current) => current + 1), interval);
        return () => window.clearTimeout(timer);
    }, [isPlaying, stepIndex, interval]);

    const execute = useCallback((algorithm: AlgorithmDefinition, context: AlgorithmContext) => {
        const issues = algorithm.validate(context);
        if (issues.length > 0) {
            setError(issues[0]);
            return false;
        }
        try {
            const trace = algorithm.run(context);
            setRun({ algorithmId: algorithm.id, trace });
            setStepIndex(0);
            setPlayRequested(false);
            setError(null);
            return true;
        } catch {
            setError('Não foi possível executar o algoritmo com este grafo.');
            return false;
        }
    }, []);

    const reset = useCallback(() => {
        setRun(null);
        setStepIndex(0);
        setPlayRequested(false);
        setError(null);
    }, []);

    const goTo = useCallback(
        (index: number) => {
            if (totalSteps === 0) return;
            setStepIndex(Math.min(Math.max(index, 0), totalSteps - 1));
        },
        [totalSteps]
    );

    const controls = useMemo(
        () => ({
            first: () => {
                setPlayRequested(false);
                setStepIndex(0);
            },
            previous: () => {
                setPlayRequested(false);
                setStepIndex((current) => Math.max(current - 1, 0));
            },
            next: () => {
                setPlayRequested(false);
                setStepIndex((current) => Math.min(current + 1, Math.max(totalSteps - 1, 0)));
            },
            last: () => {
                setPlayRequested(false);
                setStepIndex(Math.max(totalSteps - 1, 0));
            },
            togglePlay: () => {
                if (totalSteps === 0) return;
                if (isPlaying) {
                    setPlayRequested(false);
                    return;
                }
                if (isFinished) setStepIndex(0);
                setPlayRequested(true);
            },
        }),
        [totalSteps, isPlaying, isFinished]
    );

    return {
        run,
        trace: run?.trace ?? null,
        stepIndex,
        totalSteps,
        currentStep,
        isPlaying,
        isFinished,
        interval,
        error,
        setInterval: setIntervalValue,
        setError,
        execute,
        reset,
        goTo,
        controls,
    };
}
