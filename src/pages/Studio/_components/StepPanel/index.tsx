import {
    ChevronFirst,
    ChevronLast,
    ChevronLeft,
    ChevronRight,
    Gauge,
    ListChecks,
    Pause,
    Play,
    RotateCcw,
} from 'lucide-react';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { Card, CardHeader } from '@/components/Card';
import { EmptyState } from '@/components/EmptyState';
import { IconButton } from '@/components/IconButton';
import { playbackSpeeds } from '@/hooks/useAlgorithmRunner';
import type { AlgorithmDefinition, AlgorithmStep, AlgorithmTrace } from '@/lib/graph/types';
import { cn } from '@/lib/utils/cn';

interface StepPanelProps {
    algorithm: AlgorithmDefinition;
    trace: AlgorithmTrace | null;
    currentStep: AlgorithmStep | null;
    stepIndex: number;
    totalSteps: number;
    isPlaying: boolean;
    interval: number;
    onIntervalChange: (value: number) => void;
    onGoTo: (index: number) => void;
    onReset: () => void;
    controls: {
        first: () => void;
        previous: () => void;
        next: () => void;
        last: () => void;
        togglePlay: () => void;
    };
}

const emphasisClasses = {
    active: 'bg-state-active/10 text-ink',
    done: 'bg-state-done/10 text-ink',
    reject: 'bg-state-reject/10 text-ink',
};

export function StepPanel({
    algorithm,
    trace,
    currentStep,
    stepIndex,
    totalSteps,
    isPlaying,
    interval,
    onIntervalChange,
    onGoTo,
    onReset,
    controls,
}: StepPanelProps) {
    if (!trace || !currentStep) {
        return (
            <Card>
                <EmptyState
                    icon={<ListChecks size={18} />}
                    title="Nenhuma execução ainda"
                    description="Escolha um algoritmo na aba Executar e inicie a simulação para acompanhar cada passo."
                />
            </Card>
        );
    }

    const progress = totalSteps > 1 ? (stepIndex / (totalSteps - 1)) * 100 : 100;
    const isLastStep = stepIndex === totalSteps - 1;

    return (
        <div className="flex flex-col gap-3">
            <Card className="overflow-hidden">
                <div className="border-line flex items-center justify-between gap-2 border-b px-4 py-3">
                    <div className="min-w-0">
                        <p className="text-ink text-sm font-semibold tracking-tight">
                            {algorithm.name}
                        </p>
                        <p className="text-ink-soft text-xs">
                            Passo {stepIndex + 1} de {totalSteps}
                        </p>
                    </div>
                    <Button
                        size="sm"
                        variant="ghost"
                        icon={<RotateCcw size={14} />}
                        onClick={onReset}
                    >
                        Limpar
                    </Button>
                </div>

                <div className="bg-surface-sunken h-1 w-full">
                    <div
                        className="bg-brand h-full transition-[width] duration-200"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                <div className="flex flex-col gap-3 p-3">
                    <div className="flex items-center justify-center gap-1">
                        <IconButton
                            label="Primeiro passo"
                            size="sm"
                            icon={<ChevronFirst size={16} />}
                            onClick={controls.first}
                            disabled={stepIndex === 0}
                        />
                        <IconButton
                            label="Passo anterior"
                            size="sm"
                            icon={<ChevronLeft size={16} />}
                            onClick={controls.previous}
                            disabled={stepIndex === 0}
                        />
                        <IconButton
                            label={isPlaying ? 'Pausar' : 'Reproduzir'}
                            variant="solid"
                            icon={isPlaying ? <Pause size={17} /> : <Play size={17} />}
                            onClick={controls.togglePlay}
                        />
                        <IconButton
                            label="Próximo passo"
                            size="sm"
                            icon={<ChevronRight size={16} />}
                            onClick={controls.next}
                            disabled={isLastStep}
                        />
                        <IconButton
                            label="Último passo"
                            size="sm"
                            icon={<ChevronLast size={16} />}
                            onClick={controls.last}
                            disabled={isLastStep}
                        />
                    </div>

                    <input
                        type="range"
                        min={0}
                        max={Math.max(totalSteps - 1, 0)}
                        value={stepIndex}
                        onChange={(event) => onGoTo(Number(event.target.value))}
                        aria-label="Navegar entre os passos"
                        className="accent-brand h-1 w-full cursor-pointer"
                    />

                    <div className="flex items-center gap-2">
                        <Gauge size={14} className="text-ink-faint shrink-0" />
                        <div className="bg-surface-sunken border-line flex flex-1 gap-0.5 rounded-lg border p-0.5">
                            {playbackSpeeds.map((speed) => (
                                <button
                                    key={speed.value}
                                    onClick={() => onIntervalChange(speed.value)}
                                    className={cn(
                                        'flex-1 rounded-[6px] py-1 text-[11px] font-medium transition-all',
                                        interval === speed.value
                                            ? 'bg-surface text-ink shadow-soft'
                                            : 'text-ink-soft hover:text-ink'
                                    )}
                                >
                                    {speed.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </Card>

            <Card key={`step-${stepIndex}`} className="animate-rise">
                <div className="flex flex-col gap-2 p-4">
                    <p className="text-brand text-xs font-semibold tracking-tight">
                        {currentStep.title}
                    </p>
                    <p className="text-ink-soft text-[13px] leading-relaxed">
                        {currentStep.description}
                    </p>
                    {currentStep.metrics && currentStep.metrics.length > 0 ? (
                        <div className="mt-1 flex flex-wrap gap-1.5">
                            {currentStep.metrics.map((metric) => (
                                <Badge key={metric.label} tone="brand">
                                    {metric.label}: {metric.value}
                                </Badge>
                            ))}
                        </div>
                    ) : null}
                </div>
            </Card>

            {currentStep.lists?.map((list) => (
                <Card key={list.id}>
                    <CardHeader title={list.title} />
                    <div className="p-3">
                        {list.items.length === 0 ? (
                            <p className="text-ink-faint text-xs italic">vazio</p>
                        ) : (
                            <div className="flex flex-wrap gap-1.5">
                                {list.items.map((item, index) => (
                                    <span
                                        key={`${list.id}-${item}-${index}`}
                                        className={cn(
                                            'border-line bg-surface-sunken text-ink rounded-md border px-2 py-1 font-mono text-[11px]',
                                            index === 0 &&
                                                list.variant === 'queue' &&
                                                'border-brand text-brand',
                                            index === list.items.length - 1 &&
                                                list.variant === 'stack' &&
                                                'border-brand text-brand'
                                        )}
                                    >
                                        {item}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </Card>
            ))}

            {currentStep.tables?.map((table) => (
                <Card key={table.id} className="overflow-hidden">
                    <CardHeader title={table.title} />
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left">
                            <thead>
                                <tr className="border-line border-b">
                                    {table.columns.map((column) => (
                                        <th
                                            key={column.key}
                                            className="text-ink-faint px-3 py-2 text-[10px] font-semibold tracking-wider whitespace-nowrap uppercase"
                                        >
                                            {column.label}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {table.rows.map((row) => (
                                    <tr
                                        key={row.key}
                                        className={cn(
                                            'border-line/60 border-b last:border-0',
                                            row.emphasis && emphasisClasses[row.emphasis]
                                        )}
                                    >
                                        {table.columns.map((column) => (
                                            <td
                                                key={column.key}
                                                className="text-ink px-3 py-1.5 font-mono text-xs whitespace-nowrap"
                                            >
                                                {row.cells[column.key] ?? '-'}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            ))}

            {isLastStep && trace.conclusions.length > 0 ? (
                <Card className="border-state-done/30 bg-state-done/5">
                    <CardHeader title="Conclusões" />
                    <ul className="flex flex-col gap-2 p-4 pt-3">
                        {trace.conclusions.map((conclusion) => (
                            <li
                                key={conclusion}
                                className="text-ink-soft flex gap-2 text-[13px] leading-relaxed"
                            >
                                <span className="bg-state-done mt-1.5 size-1.5 shrink-0 rounded-full" />
                                {conclusion}
                            </li>
                        ))}
                    </ul>
                </Card>
            ) : null}
        </div>
    );
}
