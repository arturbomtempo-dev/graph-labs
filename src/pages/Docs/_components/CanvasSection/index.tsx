import {
    ArrowRight,
    Eraser,
    Maximize2,
    Minus,
    MousePointer2,
    Plus,
    Redo2,
    Sparkles,
    Spline,
    Trash2,
    Undo2,
    Wand2,
    type LucideIcon,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { useI18n } from '@/hooks/useI18n';
import type { ElementState } from '@/lib/graph/types';
import { cn } from '@/lib/utils/cn';
import { Callout } from '../Callout';
import { DocSection, DocSubsection } from '../DocSection';

interface ToolRow {
    icon: LucideIcon;
    name: string;
    description: string;
}

const editingIcons = {
    select: MousePointer2,
    node: Plus,
    edge: Spline,
    erase: Eraser,
};

const actionIcons = {
    undo: Undo2,
    redo: Redo2,
    clear: Trash2,
    undirected: Minus,
    directed: ArrowRight,
    autoArrange: Wand2,
    arrangeNow: Sparkles,
};

const viewIcons = {
    zoomIn: Plus,
    zoomOut: Minus,
    fit: Maximize2,
};

const stateDots: Record<ElementState, string> = {
    idle: 'bg-line-strong',
    frontier: 'bg-state-frontier',
    active: 'bg-state-active',
    done: 'bg-state-done',
    reject: 'bg-state-reject',
    path: 'bg-state-path',
};

const markerPreviews: Record<'start' | 'end' | 'nodeBadge' | 'edgeLabel' | 'group', ReactNode> = {
    start: <span className="border-brand size-5 rounded-full border-[1.5px] border-dashed" />,
    end: <span className="border-state-path size-5 rounded-full border-[1.5px] border-dashed" />,
    nodeBadge: (
        <span className="bg-brand text-brand-ink rounded-[4px] px-1 font-mono text-[9px] font-semibold">
            1/6
        </span>
    ),
    edgeLabel: (
        <span className="border-line bg-surface text-ink-soft rounded-[4px] border px-1 font-mono text-[9px]">
            3/5
        </span>
    ),
    group: <span className="border-group-2 size-5 rounded-full border-[3px]" />,
};

function toolRows<K extends string>(
    icons: Record<K, LucideIcon>,
    texts: Record<K, { name: string; description: string }>
): ToolRow[] {
    return (Object.keys(icons) as K[]).map((key) => ({ icon: icons[key], ...texts[key] }));
}

function ToolTable({ rows }: { rows: ToolRow[] }) {
    return (
        <ul className="border-line bg-surface rounded-card divide-line divide-y border">
            {rows.map((row) => (
                <li key={row.name} className="flex items-start gap-3 px-4 py-3">
                    <span className="border-line bg-surface-sunken text-ink-soft flex size-7 shrink-0 items-center justify-center rounded-lg border">
                        <row.icon size={14} />
                    </span>
                    <div className="min-w-0">
                        <p className="text-ink text-[13px] font-semibold">{row.name}</p>
                        <p className="text-ink-soft mt-0.5 text-xs leading-relaxed">
                            {row.description}
                        </p>
                    </div>
                </li>
            ))}
        </ul>
    );
}

export function CanvasSection() {
    const { t } = useI18n();
    const text = t.docs.canvas;
    const states = Object.keys(stateDots) as ElementState[];
    const markers = Object.keys(markerPreviews) as (keyof typeof markerPreviews)[];

    return (
        <DocSection section="canvas" description={text.description}>
            <DocSubsection title={text.editingTitle}>
                <p>{text.editingIntro}</p>
                <ToolTable rows={toolRows(editingIcons, text.editingTools)} />
            </DocSubsection>

            <DocSubsection title={text.actionsTitle}>
                <ToolTable rows={toolRows(actionIcons, text.actionTools)} />
                <Callout tone="info" title={text.autoArrangeTitle}>
                    {text.autoArrangeText}
                </Callout>
            </DocSubsection>

            <DocSubsection title={text.navigationTitle}>
                <p>{text.navigationText}</p>
                <ToolTable rows={toolRows(viewIcons, text.viewTools)} />
                <p>{text.navigationNote}</p>
            </DocSubsection>

            <DocSubsection title={text.colorsTitle}>
                <p>{text.colorsIntro}</p>
                <ul className="grid gap-2 sm:grid-cols-2">
                    {states.map((state) => (
                        <li
                            key={state}
                            className="border-line bg-surface flex gap-3 rounded-lg border p-3"
                        >
                            <span
                                className={cn(
                                    'mt-1 size-2.5 shrink-0 rounded-full',
                                    stateDots[state]
                                )}
                            />
                            <div className="min-w-0">
                                <p className="text-ink text-[13px] font-semibold">
                                    {text.states[state].label}
                                </p>
                                <p className="text-ink-soft mt-0.5 text-xs leading-relaxed">
                                    {text.states[state].description}
                                </p>
                            </div>
                        </li>
                    ))}
                </ul>
            </DocSubsection>

            <DocSubsection title={text.markersTitle}>
                <ul className="border-line bg-surface rounded-card divide-line divide-y border">
                    {markers.map((marker) => (
                        <li key={marker} className="flex items-start gap-3 px-4 py-3">
                            <span className="flex h-7 w-9 shrink-0 items-center justify-center">
                                {markerPreviews[marker]}
                            </span>
                            <div className="min-w-0">
                                <p className="text-ink text-[13px] font-semibold">
                                    {text.markers[marker].title}
                                </p>
                                <p className="text-ink-soft mt-0.5 text-xs leading-relaxed">
                                    {text.markers[marker].description}
                                </p>
                            </div>
                        </li>
                    ))}
                </ul>
            </DocSubsection>
        </DocSection>
    );
}
