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
import { cn } from '@/lib/utils/cn';
import { Callout } from '../Callout';
import { DocSection, DocSubsection } from '../DocSection';

interface ToolRow {
    icon: LucideIcon;
    name: string;
    description: string;
}

const editingTools: ToolRow[] = [
    {
        icon: MousePointer2,
        name: 'Selecionar e mover',
        description:
            'Ferramenta padrão. Clique em um vértice ou aresta para selecioná-lo, arraste vértices para reposicioná-los e arraste o fundo para mover a visão.',
    },
    {
        icon: Plus,
        name: 'Adicionar vértice',
        description:
            'Cada clique em um ponto vazio cria um vértice ali. Os rótulos seguem a sequência A, B, C, ..., Z, A1, B1, ..., sempre pulando os já usados.',
    },
    {
        icon: Spline,
        name: 'Conectar vértices',
        description:
            'Clique no vértice de origem e depois no de destino. Entre os dois cliques, uma linha tracejada acompanha o cursor. Esc cancela.',
    },
    {
        icon: Eraser,
        name: 'Remover elemento',
        description:
            'Clique em um vértice ou aresta para apagá-lo. Remover um vértice remove também todas as arestas ligadas a ele.',
    },
];

const actionTools: ToolRow[] = [
    {
        icon: Undo2,
        name: 'Desfazer',
        description: 'Volta a última alteração do grafo. Guarda até 60 alterações.',
    },
    { icon: Redo2, name: 'Refazer', description: 'Reaplica uma alteração desfeita.' },
    {
        icon: Trash2,
        name: 'Limpar grafo',
        description: 'Apaga todos os vértices e arestas. Pode ser desfeito com Desfazer.',
    },
    {
        icon: Minus,
        name: 'Novas arestas não direcionadas',
        description: 'As arestas criadas no canvas nascem simples (padrão).',
    },
    {
        icon: ArrowRight,
        name: 'Novas arestas direcionadas',
        description: 'As arestas criadas no canvas nascem com seta, da origem para o destino.',
    },
    {
        icon: Wand2,
        name: 'Sugestão de posicionamento',
        description:
            'Quando ligada, cada nova aresta dispara um ajuste fino do desenho. A preferência fica salva.',
    },
    {
        icon: Sparkles,
        name: 'Reorganizar agora',
        description: 'Aplica o ajuste de posicionamento imediatamente, uma única vez.',
    },
];

const viewTools: ToolRow[] = [
    { icon: Plus, name: 'Aproximar', description: 'Aumenta o zoom em 25%, mantendo o centro.' },
    { icon: Minus, name: 'Afastar', description: 'Reduz o zoom em 20%, mantendo o centro.' },
    {
        icon: Maximize2,
        name: 'Enquadrar grafo',
        description: 'Ajusta zoom e posição para que o grafo inteiro caiba na tela.',
    },
];

const states = [
    {
        label: 'Não explorado',
        dot: 'bg-line-strong',
        description: 'Estado inicial: o algoritmo ainda não alcançou o elemento.',
    },
    {
        label: 'Marcado',
        dot: 'bg-state-frontier',
        description: 'Alcançado, mas ainda não processado: está na fila, na pilha ou na fronteira.',
    },
    {
        label: 'Em análise',
        dot: 'bg-state-active',
        description:
            'Elemento examinado no passo atual. Vértices em análise pulsam para chamar a atenção.',
    },
    {
        label: 'Explorado / na solução',
        dot: 'bg-state-done',
        description:
            'Processamento concluído ou elemento aceito na solução (árvore, ordem, emparelhamento).',
    },
    {
        label: 'Descartado',
        dot: 'bg-state-reject',
        description:
            'Rejeitado pelo algoritmo, como uma aresta que formaria ciclo. Arestas descartadas ficam tracejadas.',
    },
    {
        label: 'Caminho',
        dot: 'bg-state-path',
        description:
            'Resultado destacado no fim: caminho mínimo, caminho aumentante ou trajeto euleriano.',
    },
];

const markers = [
    {
        preview: <span className="border-brand size-5 rounded-full border-[1.5px] border-dashed" />,
        title: 'Anel tracejado azul',
        description:
            'Vértice de partida. A etiqueta acima dele indica RAIZ ou, nos algoritmos de fluxo, FONTE.',
    },
    {
        preview: (
            <span className="border-state-path size-5 rounded-full border-[1.5px] border-dashed" />
        ),
        title: 'Anel tracejado roxo',
        description: 'Vértice de chegada: DESTINO, ou SUMIDOURO nos algoritmos de fluxo.',
    },
    {
        preview: (
            <span className="bg-brand text-brand-ink rounded-[4px] px-1 font-mono text-[9px] font-semibold">
                1/6
            </span>
        ),
        title: 'Etiqueta sob o vértice',
        description:
            'Valor do vértice no passo atual: TD/TT na busca em profundidade, nível na busca em largura, dist em Dijkstra, cor na coloração, s e t no fluxo.',
    },
    {
        preview: (
            <span className="border-line bg-surface text-ink-soft rounded-[4px] border px-1 font-mono text-[9px]">
                3/5
            </span>
        ),
        title: 'Rótulo da aresta',
        description:
            'Mostra o peso. Durante a execução pode dar lugar a outro valor, como fluxo/capacidade nos algoritmos de fluxo ou a ordem de travessia em Fleury.',
    },
    {
        preview: <span className="border-group-2 size-5 rounded-full border-[3px]" />,
        title: 'Contorno colorido',
        description:
            'Agrupa vértices do mesmo conjunto: componentes f-conexos em Kosaraju, árvores da floresta em Kruskal, classes de cor na coloração.',
    },
];

function ToolTable({ rows }: { rows: ToolRow[] }) {
    return (
        <ul className="border-line bg-surface rounded-card divide-y divide-[var(--color-line)] border">
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
    return (
        <DocSection
            id="canvas"
            index={4}
            title="Canvas e ferramentas"
            description="O canvas é a área de desenho do estúdio. É nele que você cria e organiza o grafo e, durante a simulação, acompanha visualmente o estado de cada vértice e aresta."
        >
            <DocSubsection title="Ferramentas de edição">
                <p>
                    Apenas uma ferramenta fica ativa por vez, destacada na barra superior. O cursor
                    muda de formato para indicar qual está em uso, e uma dica ao lado da barra
                    explica o que fazer.
                </p>
                <ToolTable rows={editingTools} />
            </DocSubsection>

            <DocSubsection title="Histórico, direção e posicionamento">
                <ToolTable rows={actionTools} />
                <Callout tone="info" title="Como funciona a sugestão de posicionamento">
                    O ajuste move os vértices aos poucos, sem perder o desenho original de vista,
                    para reduzir cruzamentos de arestas, vértices sobre arestas, sobreposições e
                    ângulos muito fechados. Ele atua em grafos de 3 a 40 vértices e até 90 arestas,
                    e não faz nada se o desenho já estiver limpo.
                </Callout>
            </DocSubsection>

            <DocSubsection title="Navegação e zoom">
                <p>
                    Arraste o fundo para mover a visão e use a roda do mouse (ou o gesto de pinça no
                    trackpad e no celular) para aproximar e afastar, sempre centrado no ponto sob o
                    cursor. O zoom vai de 30% a 260%. Os botões no canto inferior direito oferecem o
                    mesmo controle:
                </p>
                <ToolTable rows={viewTools} />
                <p>
                    Ao carregar um modelo pronto, o grafo é enquadrado automaticamente. Arestas
                    paralelas entre o mesmo par de vértices, como A → B e B → A, são desenhadas
                    curvas para não se sobreporem.
                </p>
            </DocSubsection>

            <DocSubsection title="Cores durante a execução">
                <p>
                    Depois que um algoritmo é executado, cada vértice e aresta recebe um estado a
                    cada passo. A legenda no canto inferior esquerdo do canvas resume o significado
                    das cores:
                </p>
                <ul className="grid gap-2 sm:grid-cols-2">
                    {states.map((state) => (
                        <li
                            key={state.label}
                            className="border-line bg-surface flex gap-3 rounded-lg border p-3"
                        >
                            <span
                                className={cn('mt-1 size-2.5 shrink-0 rounded-full', state.dot)}
                            />
                            <div className="min-w-0">
                                <p className="text-ink text-[13px] font-semibold">{state.label}</p>
                                <p className="text-ink-soft mt-0.5 text-xs leading-relaxed">
                                    {state.description}
                                </p>
                            </div>
                        </li>
                    ))}
                </ul>
            </DocSubsection>

            <DocSubsection title="Marcações adicionais">
                <ul className="border-line bg-surface rounded-card divide-y divide-[var(--color-line)] border">
                    {markers.map((marker) => (
                        <li key={marker.title} className="flex items-start gap-3 px-4 py-3">
                            <span className="flex h-7 w-9 shrink-0 items-center justify-center">
                                {marker.preview}
                            </span>
                            <div className="min-w-0">
                                <p className="text-ink text-[13px] font-semibold">{marker.title}</p>
                                <p className="text-ink-soft mt-0.5 text-xs leading-relaxed">
                                    {marker.description}
                                </p>
                            </div>
                        </li>
                    ))}
                </ul>
            </DocSubsection>
        </DocSection>
    );
}
