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
import { playbackSpeeds } from '@/hooks/useAlgorithmRunner';
import { cn } from '@/lib/utils/cn';
import { Callout } from '../Callout';
import { DocSection, DocSubsection } from '../DocSection';

const controls: { icon: LucideIcon; name: string; description: string }[] = [
    { icon: ChevronFirst, name: 'Primeiro passo', description: 'Volta ao estado inicial.' },
    { icon: ChevronLeft, name: 'Passo anterior', description: 'Recua uma iteração.' },
    {
        icon: Pause,
        name: 'Reproduzir / pausar',
        description: 'Avança sozinho no ritmo escolhido. No fim, recomeça do primeiro passo.',
    },
    { icon: ChevronRight, name: 'Próximo passo', description: 'Avança uma iteração.' },
    { icon: ChevronLast, name: 'Último passo', description: 'Pula para o resultado final.' },
    {
        icon: RotateCcw,
        name: 'Limpar',
        description: 'Descarta a execução e devolve o canvas às cores originais.',
    },
];

const structures = [
    {
        title: 'Fila',
        variant: 'queue',
        items: ['B', 'D', 'E'],
        description: 'O primeiro elemento, o próximo a sair, fica destacado.',
    },
    {
        title: 'Pilha',
        variant: 'stack',
        items: ['A', 'C', 'F'],
        description: 'O topo da pilha, o último elemento, fica destacado.',
    },
    {
        title: 'Conjunto',
        variant: 'set',
        items: ['C', 'D', 'E'],
        description: 'Elementos sem ordem de saída, como os vértices ainda não fechados.',
    },
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
    reject: 'bg-state-reject/10',
};

function formatInterval(ms: number) {
    return `${(ms / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 2 })} s`;
}

export function StepsSection() {
    return (
        <DocSection
            id="aba-passos"
            index={7}
            title="Aba Passos"
            description="Depois da execução, a aba Passos funciona como um player: você navega pela simulação enquanto o canvas e as estruturas auxiliares mostram o estado exato de cada iteração."
        >
            <DocSubsection title="Controles de reprodução">
                <p>
                    O cabeçalho indica o algoritmo e a posição atual (por exemplo, Passo 4 de 23),
                    com uma barra de progresso logo abaixo. Os controles são:
                </p>
                <ul className="grid gap-2 sm:grid-cols-2">
                    {controls.map((control) => (
                        <li
                            key={control.name}
                            className="border-line bg-surface flex items-start gap-3 rounded-lg border p-3"
                        >
                            <span className="border-line bg-surface-sunken text-ink-soft flex size-7 shrink-0 items-center justify-center rounded-lg border">
                                <control.icon size={14} />
                            </span>
                            <div className="min-w-0">
                                <p className="text-ink text-[13px] font-semibold">{control.name}</p>
                                <p className="text-ink-soft mt-0.5 text-xs leading-relaxed">
                                    {control.description}
                                </p>
                            </div>
                        </li>
                    ))}
                </ul>
                <p>
                    O controle deslizante salta direto para qualquer passo. Qualquer navegação
                    manual pausa a reprodução automática. As velocidades disponíveis são:
                </p>
                <div className="flex flex-wrap gap-2">
                    {playbackSpeeds.map((speed) => (
                        <span
                            key={speed.value}
                            className="border-line bg-surface flex items-baseline gap-1.5 rounded-lg border px-3 py-2"
                        >
                            <span className="text-ink font-mono text-xs font-semibold">
                                {speed.label}
                            </span>
                            <span className="text-ink-faint text-[11px]">
                                {formatInterval(speed.value)} por passo
                            </span>
                        </span>
                    ))}
                </div>
            </DocSubsection>

            <DocSubsection title="O que cada passo mostra">
                <p>
                    O card principal traz o <strong className="text-ink font-medium">título</strong>{' '}
                    da decisão tomada (por exemplo, “Aresta tensa (A, C): relaxada”), a{' '}
                    <strong className="text-ink font-medium">justificativa</strong> com os valores
                    envolvidos e, quando faz sentido,{' '}
                    <strong className="text-ink font-medium">métricas</strong> como a ordem de
                    visita, a iteração corrente ou o valor do fluxo. Abaixo dele aparecem as
                    estruturas auxiliares do algoritmo.
                </p>

                <div className="grid gap-2.5 sm:grid-cols-3">
                    {structures.map((structure) => (
                        <div
                            key={structure.title}
                            className="border-line bg-surface flex flex-col gap-2.5 rounded-lg border p-3"
                        >
                            <p className="text-ink text-xs font-semibold">{structure.title}</p>
                            <div className="flex flex-wrap gap-1.5">
                                {structure.items.map((item, index) => (
                                    <span
                                        key={item}
                                        className={cn(
                                            'border-line bg-surface-sunken text-ink rounded-md border px-2 py-1 font-mono text-[11px]',
                                            index === 0 &&
                                                structure.variant === 'queue' &&
                                                'border-brand text-brand',
                                            index === structure.items.length - 1 &&
                                                structure.variant === 'stack' &&
                                                'border-brand text-brand'
                                        )}
                                    >
                                        {item}
                                    </span>
                                ))}
                            </div>
                            <p className="text-ink-soft text-[11px] leading-relaxed">
                                {structure.description}
                            </p>
                        </div>
                    ))}
                </div>

                <p>
                    As <strong className="text-ink font-medium">tabelas</strong> reproduzem as do
                    quadro: dist e pred, tempos de descoberta e término, matrizes de Floyd-Warshall,
                    fluxo e capacidades residuais, entre outras. Linhas coloridas indicam o papel de
                    cada entrada no passo atual:
                </p>

                <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] sm:items-start">
                    <div className="border-line bg-surface overflow-hidden rounded-lg border">
                        <p className="border-line text-ink border-b px-3 py-2 text-xs font-semibold">
                            dist e pred
                        </p>
                        <table className="w-full border-collapse text-left">
                            <thead>
                                <tr className="border-line border-b">
                                    {['Vértice', 'dist', 'pred'].map((column) => (
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
                        <li className="flex items-center gap-2">
                            <span className="bg-state-active/25 size-3 rounded-sm" />
                            <span>
                                <strong className="text-ink font-medium">Azul:</strong> entrada
                                alterada ou examinada neste passo.
                            </span>
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="bg-state-done/25 size-3 rounded-sm" />
                            <span>
                                <strong className="text-ink font-medium">Verde:</strong> valor
                                definitivo ou elemento aceito.
                            </span>
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="bg-state-reject/25 size-3 rounded-sm" />
                            <span>
                                <strong className="text-ink font-medium">Vermelho:</strong> elemento
                                rejeitado.
                            </span>
                        </li>
                    </ul>
                </div>
            </DocSubsection>

            <DocSubsection title="Conclusões">
                <p>
                    No último passo surge o card{' '}
                    <strong className="text-ink font-medium">Conclusões</strong>, em verde, que
                    interpreta o resultado: distâncias finais e caminho recuperado, peso total da
                    árvore geradora, valor do fluxo máximo e o corte correspondente, componentes
                    encontrados, ordem topológica, número de cores usadas. É o resumo para conferir
                    com a sua resposta.
                </p>
                <div className="flex flex-wrap gap-1.5">
                    <Badge tone="success">dist final</Badge>
                    <Badge tone="success">caminho mínimo</Badge>
                    <Badge tone="success">peso da AGM</Badge>
                    <Badge tone="success">fluxo máximo</Badge>
                    <Badge tone="success">ordem topológica</Badge>
                    <Badge tone="success">número de cores</Badge>
                </div>
            </DocSubsection>

            <Callout tone="warning" title="Quando a execução é descartada">
                A execução fica vinculada ao grafo e ao algoritmo em que foi gerada. Criar, remover
                ou renomear vértices, mudar arestas, pesos ou direções, ou trocar de algoritmo
                descarta o traço automaticamente, e é preciso executar de novo. Arrastar vértices
                para reorganizar o desenho não afeta a execução.
            </Callout>
        </DocSection>
    );
}
