import {
    ChevronFirst,
    ChevronLast,
    ChevronLeft,
    ChevronRight,
    Pause,
    RotateCcw,
    type LucideIcon,
} from 'lucide-react';
import { Badge } from '@/components/Badge';
import { RichText } from '@/components/RichText';
import { playbackSpeeds } from '@/hooks/useAlgorithmRunner';
import { useI18n } from '@/hooks/useI18n';
import { cn } from '@/lib/utils/cn';
import { Callout } from '../Callout';
import { DocSection, DocSubsection } from '../DocSection';

const controlIcons: Record<'first' | 'previous' | 'play' | 'next' | 'last' | 'clear', LucideIcon> =
    {
        first: ChevronFirst,
        previous: ChevronLeft,
        play: Pause,
        next: ChevronRight,
        last: ChevronLast,
        clear: RotateCcw,
    };

const structures = [
    { key: 'queue', items: ['B', 'D', 'E'] },
    { key: 'stack', items: ['A', 'C', 'F'] },
    { key: 'set', items: ['C', 'D', 'E'] },
] as const;

const tableRows = [
    { vertex: 'A', dist: '0', pred: '-', emphasis: 'done' },
    { vertex: 'B', dist: '7', pred: 'A', emphasis: 'active' },
    { vertex: 'C', dist: '3', pred: 'A', emphasis: 'done' },
    { vertex: 'D', dist: '∞', pred: '-', emphasis: undefined },
] as const;

const emphasisClasses = {
    active: 'bg-state-active/10',
    done: 'bg-state-done/10',
};

const emphasisSwatches = ['bg-state-active/25', 'bg-state-done/25', 'bg-state-reject/25'];

export function StepsSection() {
    const { t, formatNumber } = useI18n();
    const text = t.docs.steps;
    const controls = Object.keys(controlIcons) as (keyof typeof controlIcons)[];

    return (
        <DocSection section="steps" description={text.description}>
            <DocSubsection title={text.controlsTitle}>
                <p>{text.controlsIntro}</p>
                <ul className="grid gap-2 sm:grid-cols-2">
                    {controls.map((control) => {
                        const Icon = controlIcons[control];
                        return (
                            <li
                                key={control}
                                className="border-line bg-surface flex items-start gap-3 rounded-lg border p-3"
                            >
                                <span className="border-line bg-surface-sunken text-ink-soft flex size-7 shrink-0 items-center justify-center rounded-lg border">
                                    <Icon size={14} />
                                </span>
                                <div className="min-w-0">
                                    <p className="text-ink text-[13px] font-semibold">
                                        {text.controls[control].name}
                                    </p>
                                    <p className="text-ink-soft mt-0.5 text-xs leading-relaxed">
                                        {text.controls[control].description}
                                    </p>
                                </div>
                            </li>
                        );
                    })}
                </ul>
                <p>{text.speedText}</p>
                <div className="flex flex-wrap gap-2">
                    {playbackSpeeds.map((speed) => (
                        <span
                            key={speed.value}
                            className="border-line bg-surface flex items-baseline gap-1.5 rounded-lg border px-3 py-2"
                        >
                            <span className="text-ink font-mono text-xs font-semibold">
                                {formatNumber(speed.factor)}×
                            </span>
                            <span className="text-ink-faint text-[11px]">
                                {text.perStep(`${formatNumber(speed.value / 1000)} s`)}
                            </span>
                        </span>
                    ))}
                </div>
            </DocSubsection>

            <DocSubsection title={text.contentTitle}>
                <p>
                    <RichText text={text.contentText} />
                </p>

                <div className="grid gap-2.5 sm:grid-cols-3">
                    {structures.map((structure) => (
                        <div
                            key={structure.key}
                            className="border-line bg-surface flex flex-col gap-2.5 rounded-lg border p-3"
                        >
                            <p className="text-ink text-xs font-semibold">
                                {text.structures[structure.key].title}
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                                {structure.items.map((item, index) => (
                                    <span
                                        key={item}
                                        className={cn(
                                            'border-line bg-surface-sunken text-ink rounded-md border px-2 py-1 font-mono text-[11px]',
                                            index === 0 &&
                                                structure.key === 'queue' &&
                                                'border-brand text-brand',
                                            index === structure.items.length - 1 &&
                                                structure.key === 'stack' &&
                                                'border-brand text-brand'
                                        )}
                                    >
                                        {item}
                                    </span>
                                ))}
                            </div>
                            <p className="text-ink-soft text-[11px] leading-relaxed">
                                {text.structures[structure.key].description}
                            </p>
                        </div>
                    ))}
                </div>

                <p>
                    <RichText text={text.tablesText} />
                </p>

                <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] sm:items-start">
                    <div className="border-line bg-surface overflow-hidden rounded-lg border">
                        <p className="border-line text-ink border-b px-3 py-2 text-xs font-semibold">
                            {text.sampleTable.title}
                        </p>
                        <table className="w-full border-collapse text-left">
                            <thead>
                                <tr className="border-line border-b">
                                    {text.sampleTable.columns.map((column) => (
                                        <th
                                            key={column}
                                            className="text-ink-faint px-3 py-1.5 text-[10px] font-semibold tracking-wider uppercase"
                                        >
                                            {column}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {tableRows.map((row) => (
                                    <tr
                                        key={row.vertex}
                                        className={cn(
                                            'border-line/60 border-b last:border-0',
                                            row.emphasis && emphasisClasses[row.emphasis]
                                        )}
                                    >
                                        <td className="text-ink px-3 py-1.5 font-mono text-xs">
                                            {row.vertex}
                                        </td>
                                        <td className="text-ink px-3 py-1.5 font-mono text-xs">
                                            {row.dist}
                                        </td>
                                        <td className="text-ink px-3 py-1.5 font-mono text-xs">
                                            {row.pred}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <ul className="flex flex-col gap-2 text-xs">
                        {text.emphasis.map((item, index) => (
                            <li key={item.label} className="flex items-center gap-2">
                                <span
                                    className={cn('size-3 rounded-sm', emphasisSwatches[index])}
                                />
                                <span>
                                    <strong className="text-ink font-medium">{item.label}</strong>{' '}
                                    {item.description}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </DocSubsection>

            <DocSubsection title={text.conclusionsTitle}>
                <p>
                    <RichText text={text.conclusionsText} />
                </p>
                <div className="flex flex-wrap gap-1.5">
                    {text.conclusionBadges.map((badge) => (
                        <Badge key={badge} tone="success">
                            {badge}
                        </Badge>
                    ))}
                </div>
            </DocSubsection>

            <Callout tone="warning" title={text.discardedTitle}>
                {text.discardedText}
            </Callout>
        </DocSection>
    );
}
