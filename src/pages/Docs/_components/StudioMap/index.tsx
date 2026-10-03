import {
    ArrowRight,
    Eraser,
    Hammer,
    ListChecks,
    Maximize2,
    Minus,
    MousePointer2,
    Play,
    Plus,
    Redo2,
    Sparkles,
    Spline,
    Trash2,
    Undo2,
    Wand2,
    type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';

const regions = [
    {
        title: 'Ferramentas de edição',
        description: 'Selecionar e mover, adicionar vértice, conectar vértices e remover elemento.',
    },
    { title: 'Histórico', description: 'Desfazer, refazer e limpar o grafo inteiro.' },
    {
        title: 'Direção das novas arestas',
        description: 'Define se as arestas criadas pelo canvas nascem simples ou direcionadas.',
    },
    {
        title: 'Posicionamento',
        description: 'Liga ou desliga a sugestão automática e reorganiza o desenho sob demanda.',
    },
    {
        title: 'Dica contextual',
        description: 'Explica como usar a ferramenta ativa. Aparece em telas a partir de 640 px.',
    },
    {
        title: 'Canvas',
        description: 'Área de desenho com grade pontilhada, arrasto, zoom e destaques da execução.',
    },
    {
        title: 'Legenda',
        description: 'Significado de cada cor aplicada a vértices e arestas durante a simulação.',
    },
    { title: 'Zoom', description: 'Aproximar, afastar e enquadrar o grafo inteiro na tela.' },
    {
        title: 'Abas do painel',
        description: 'Alterna entre Construir, Executar e Passos, as três etapas do fluxo.',
    },
    {
        title: 'Conteúdo da aba',
        description: 'Formulários do grafo, catálogo de algoritmos ou o traço passo a passo.',
    },
];

function Marker({ value, className }: { value: number; className?: string }) {
    return (
        <span
            className={cn(
                'bg-brand text-brand-ink ring-surface absolute z-10 flex size-[18px] items-center justify-center rounded-full font-mono text-[10px] font-semibold ring-2',
                className
            )}
        >
            {value}
        </span>
    );
}

function ToolGroup({ icons, marker }: { icons: LucideIcon[]; marker: number }) {
    return (
        <div className="bg-surface/90 border-line shadow-soft relative flex items-center gap-px rounded-lg border p-0.5">
            <Marker value={marker} className="-top-2 -left-2" />
            {icons.map((Icon, index) => (
                <span
                    key={index}
                    className={cn(
                        'text-ink-soft flex size-5 items-center justify-center rounded-[5px]',
                        index === 0 && marker === 1 && 'bg-brand/12 text-brand'
                    )}
                >
                    <Icon size={11} />
                </span>
            ))}
        </div>
    );
}

function MockLine({ width }: { width: string }) {
    return <span className={cn('bg-line block h-1.5 rounded-full', width)} />;
}

const NODE_RADIUS = 17;

function MiniGraph() {
    const nodes = [
        { id: 'A', x: 46, y: 92, state: 'fill-state-done/20 stroke-state-done' },
        { id: 'B', x: 132, y: 40, state: 'fill-state-done/20 stroke-state-done' },
        { id: 'C', x: 132, y: 142, state: 'fill-state-active/25 stroke-state-active' },
        { id: 'D', x: 222, y: 58, state: 'fill-state-frontier/20 stroke-state-frontier' },
        { id: 'E', x: 262, y: 138, state: 'fill-surface stroke-line-strong' },
    ];
    const position = new Map(nodes.map((node) => [node.id, node]));
    const edges = [
        { from: 'A', to: 'B', state: 'stroke-state-done', width: 3 },
        { from: 'A', to: 'C', state: 'stroke-state-done', width: 3 },
        { from: 'B', to: 'C', state: 'stroke-state-reject', width: 2.5, dashed: true },
        { from: 'B', to: 'D', state: 'stroke-state-frontier', width: 2.5 },
        { from: 'C', to: 'E', state: 'stroke-line-strong', width: 2 },
        { from: 'D', to: 'E', state: 'stroke-line-strong', width: 2 },
    ];

    return (
        <svg viewBox="0 0 300 180" className="h-full w-full max-w-[340px]">
            {edges.map((edge) => {
                const from = position.get(edge.from)!;
                const to = position.get(edge.to)!;
                const length = Math.hypot(to.x - from.x, to.y - from.y);
                const trimX = ((to.x - from.x) / length) * NODE_RADIUS;
                const trimY = ((to.y - from.y) / length) * NODE_RADIUS;
                return (
                    <line
                        key={`${edge.from}${edge.to}`}
                        x1={from.x + trimX}
                        y1={from.y + trimY}
                        x2={to.x - trimX}
                        y2={to.y - trimY}
                        className={edge.state}
                        strokeWidth={edge.width}
                        strokeLinecap="round"
                        strokeDasharray={edge.dashed ? '7 5' : undefined}
                    />
                );
            })}
            {nodes.map((node) => (
                <g key={node.id} transform={`translate(${node.x} ${node.y})`}>
                    <circle r={NODE_RADIUS} className={node.state} strokeWidth={2.5} />
                    <text
                        textAnchor="middle"
                        y={4.5}
                        className="fill-ink text-[12px] font-semibold"
                    >
                        {node.id}
                    </text>
                </g>
            ))}
        </svg>
    );
}

export function StudioMap() {
    return (
        <figure className="flex flex-col gap-5">
            <div
                aria-hidden
                className="border-line bg-surface shadow-soft rounded-card flex flex-col overflow-hidden border select-none sm:flex-row"
            >
                <div className="bg-canvas relative min-h-[300px] flex-1 bg-[radial-gradient(var(--color-line-strong)_1px,transparent_1px)] bg-[size:18px_18px]">
                    <div className="absolute inset-x-3 top-3 flex flex-wrap items-start gap-2.5">
                        <ToolGroup marker={1} icons={[MousePointer2, Plus, Spline, Eraser]} />
                        <ToolGroup marker={2} icons={[Undo2, Redo2, Trash2]} />
                        <ToolGroup marker={3} icons={[Minus, ArrowRight]} />
                        <ToolGroup marker={4} icons={[Wand2, Sparkles]} />
                        <div className="bg-surface/90 border-line text-ink-faint relative hidden h-[26px] items-center rounded-md border px-2 text-[9px] md:flex">
                            <Marker value={5} className="-top-2 -left-2" />
                            Arraste os vértices para reposicionar...
                        </div>
                    </div>

                    <div className="absolute inset-x-6 top-16 bottom-14 flex items-center justify-center">
                        <div className="relative h-full w-full max-w-[340px]">
                            <Marker value={6} className="top-0 right-0" />
                            <MiniGraph />
                        </div>
                    </div>

                    <div className="bg-surface/90 border-line absolute bottom-3 left-3 flex items-center gap-2 rounded-lg border px-2 py-1.5">
                        <Marker value={7} className="-top-2 -left-2" />
                        {[
                            'bg-line-strong',
                            'bg-state-frontier',
                            'bg-state-active',
                            'bg-state-done',
                            'bg-state-reject',
                            'bg-state-path',
                        ].map((dot) => (
                            <span key={dot} className={cn('size-1.5 rounded-full', dot)} />
                        ))}
                    </div>

                    <div className="absolute right-3 bottom-3 flex flex-col gap-0.5">
                        <Marker value={8} className="top-0 -left-6" />
                        {[Plus, Minus, Maximize2].map((Icon, index) => (
                            <span
                                key={index}
                                className="bg-surface border-line text-ink-soft flex size-5 items-center justify-center rounded-[5px] border"
                            >
                                <Icon size={10} />
                            </span>
                        ))}
                    </div>
                </div>

                <div className="border-line bg-surface-sunken/40 flex flex-col gap-2.5 border-t p-3 sm:w-[38%] sm:border-t-0 sm:border-l">
                    <div className="bg-surface-sunken border-line relative flex gap-px rounded-lg border p-0.5">
                        <Marker value={9} className="-top-2 -left-2" />
                        {[
                            { icon: Hammer, label: 'Construir' },
                            { icon: Play, label: 'Executar' },
                            { icon: ListChecks, label: 'Passos' },
                        ].map((tab, index) => (
                            <span
                                key={tab.label}
                                className={cn(
                                    'flex flex-1 items-center justify-center gap-1 rounded-[5px] py-1 text-[9px] font-medium',
                                    index === 0
                                        ? 'bg-surface text-ink shadow-soft'
                                        : 'text-ink-faint'
                                )}
                            >
                                <tab.icon size={9} />
                                {tab.label}
                            </span>
                        ))}
                    </div>

                    <div className="relative flex flex-1 flex-col gap-2">
                        <Marker value={10} className="-top-2 -left-2" />
                        {[0, 1, 2].map((card) => (
                            <div
                                key={card}
                                className="bg-surface border-line flex flex-col gap-1.5 rounded-lg border p-2.5"
                            >
                                <MockLine width="w-1/3" />
                                <MockLine width="w-4/5" />
                                <MockLine width="w-3/5" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <figcaption>
                <ol className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
                    {regions.map((region, index) => (
                        <li key={region.title} className="flex gap-2.5">
                            <span className="bg-brand/10 text-brand mt-px flex size-5 shrink-0 items-center justify-center rounded-full font-mono text-[10px] font-semibold">
                                {index + 1}
                            </span>
                            <div className="min-w-0">
                                <p className="text-ink text-[13px] font-semibold">{region.title}</p>
                                <p className="text-ink-soft mt-0.5 text-xs leading-relaxed">
                                    {region.description}
                                </p>
                            </div>
                        </li>
                    ))}
                </ol>
            </figcaption>
        </figure>
    );
}
