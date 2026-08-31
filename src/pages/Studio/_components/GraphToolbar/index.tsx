import {
    ArrowRight,
    Eraser,
    Minus,
    MousePointer2,
    Plus,
    Redo2,
    Spline,
    Trash2,
    Undo2,
} from 'lucide-react';
import { IconButton } from '@/components/IconButton';
import { cn } from '@/lib/utils/cn';
import type { CanvasTool } from '../GraphCanvas';

interface GraphToolbarProps {
    tool: CanvasTool;
    onToolChange: (tool: CanvasTool) => void;
    canUndo: boolean;
    canRedo: boolean;
    onUndo: () => void;
    onRedo: () => void;
    onClear: () => void;
    defaultDirected: boolean;
    onDefaultDirectedChange: (directed: boolean) => void;
    hint: string;
}

const tools: { value: CanvasTool; label: string; icon: typeof Plus }[] = [
    { value: 'select', label: 'Selecionar e mover', icon: MousePointer2 },
    { value: 'node', label: 'Adicionar vértice', icon: Plus },
    { value: 'edge', label: 'Conectar vértices', icon: Spline },
    { value: 'erase', label: 'Remover elemento', icon: Eraser },
];

export function GraphToolbar({
    tool,
    onToolChange,
    canUndo,
    canRedo,
    onUndo,
    onRedo,
    onClear,
    defaultDirected,
    onDefaultDirectedChange,
    hint,
}: GraphToolbarProps) {
    return (
        <div className="pointer-events-none absolute inset-x-3 top-3 flex flex-wrap items-start gap-2">
            <div className="bg-surface/90 border-line shadow-soft pointer-events-auto flex items-center gap-0.5 rounded-xl border p-1 backdrop-blur-md">
                {tools.map((item) => (
                    <IconButton
                        key={item.value}
                        label={item.label}
                        size="sm"
                        icon={<item.icon size={15} />}
                        active={tool === item.value}
                        onClick={() => onToolChange(item.value)}
                    />
                ))}
            </div>

            <div className="bg-surface/90 border-line shadow-soft pointer-events-auto flex items-center gap-0.5 rounded-xl border p-1 backdrop-blur-md">
                <IconButton
                    label="Desfazer"
                    size="sm"
                    icon={<Undo2 size={15} />}
                    disabled={!canUndo}
                    onClick={onUndo}
                />
                <IconButton
                    label="Refazer"
                    size="sm"
                    icon={<Redo2 size={15} />}
                    disabled={!canRedo}
                    onClick={onRedo}
                />
                <IconButton
                    label="Limpar grafo"
                    size="sm"
                    variant="danger"
                    icon={<Trash2 size={15} />}
                    onClick={onClear}
                />
            </div>

            <div className="bg-surface/90 border-line shadow-soft pointer-events-auto flex items-center gap-0.5 rounded-xl border p-1 backdrop-blur-md">
                <IconButton
                    label="Novas arestas não direcionadas"
                    size="sm"
                    icon={<Minus size={15} />}
                    active={!defaultDirected}
                    onClick={() => onDefaultDirectedChange(false)}
                />
                <IconButton
                    label="Novas arestas direcionadas"
                    size="sm"
                    icon={<ArrowRight size={15} />}
                    active={defaultDirected}
                    onClick={() => onDefaultDirectedChange(true)}
                />
            </div>

            <p
                className={cn(
                    'bg-surface/90 border-line text-ink-soft shadow-soft pointer-events-none',
                    'hidden rounded-lg border px-2.5 py-1.5 text-[11px] backdrop-blur-md sm:block'
                )}
            >
                {hint}
            </p>
        </div>
    );
}
