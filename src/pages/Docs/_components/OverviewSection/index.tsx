import { BookOpen, GraduationCap, Hammer, Info, MonitorSmartphone, Route } from 'lucide-react';
import { Link } from 'react-router-dom';
import { algorithms } from '@/lib/algorithms';
import { presets } from '@/lib/graph/presets';
import { DocSection, DocSubsection } from '../DocSection';

const pages = [
    {
        icon: Hammer,
        to: '/estudio',
        title: 'Estúdio',
        description:
            'O coração do projeto: editor de grafos, seleção do algoritmo e reprodução da execução passo a passo.',
    },
    {
        icon: BookOpen,
        to: '/algoritmos',
        title: 'Algoritmos',
        description:
            'Referência teórica de cada método: ideia central, invariante, requisitos, erros comuns e pseudocódigo.',
    },
    {
        icon: Info,
        to: '/sobre',
        title: 'Sobre',
        description: 'Origem do projeto na monitoria de Teoria dos Grafos e informações do autor.',
    },
];

const principles = [
    {
        icon: GraduationCap,
        title: 'Fiel à disciplina',
        description:
            'Nomes, notação, tabelas e ordem de visita seguem o que é ensinado e cobrado em sala, e não a versão genérica de uma biblioteca.',
    },
    {
        icon: Route,
        title: 'Cada decisão justificada',
        description:
            'Todo passo traz um título, a explicação do que aconteceu e o estado das estruturas auxiliares naquele instante.',
    },
    {
        icon: MonitorSmartphone,
        title: '100% no navegador',
        description:
            'Sem cadastro, sem servidor e sem banco de dados. Funciona no computador, no tablet e no celular.',
    },
];

export function OverviewSection() {
    const categories = new Set(algorithms.map((algorithm) => algorithm.category)).size;

    const numbers = [
        { value: algorithms.length, label: 'algoritmos implementados' },
        { value: categories, label: 'tópicos da disciplina' },
        { value: presets.length, label: 'grafos de exemplo' },
    ];

    return (
        <DocSection
            id="visao-geral"
            index={1}
            title="Visão geral"
            description="O Graph Labs é um laboratório visual de teoria dos grafos. Você desenha o grafo, escolhe um dos métodos clássicos e acompanha a execução iteração por iteração, com as mesmas tabelas, filas e notação usadas em sala."
        >
            <dl className="border-line bg-surface shadow-soft rounded-card grid grid-cols-3 divide-x divide-[var(--color-line)] border">
                {numbers.map((item) => (
                    <div key={item.label} className="px-4 py-4 sm:px-5">
                        <dt className="text-brand font-mono text-2xl font-semibold">
                            {item.value}
                        </dt>
                        <dd className="text-ink-soft mt-0.5 text-[11px] leading-snug sm:text-xs">
                            {item.label}
                        </dd>
                    </div>
                ))}
            </dl>

            <DocSubsection title="O problema que ele resolve">
                <p>
                    O pseudocódigo no papel esconde justamente a parte que mais importa para
                    aprender: o que acontece em cada iteração. Ler que o método de Dijkstra
                    “seleciona o vértice não fechado de menor rótulo” é bem diferente de ver esse
                    vértice ser escolhido, a tabela de distâncias ser atualizada e a aresta entrar
                    na solução.
                </p>
                <p>
                    No Graph Labs, você remonta o grafo de um exercício da lista, executa o método
                    sobre ele e compara cada passo com o que resolveu à mão. É útil em aulas e
                    monitorias, na correção de exercícios e no estudo individual antes da prova.
                </p>
            </DocSubsection>

            <div className="grid gap-3 sm:grid-cols-3">
                {principles.map((item) => (
                    <div
                        key={item.title}
                        className="border-line bg-surface rounded-card flex flex-col gap-2.5 border p-4"
                    >
                        <span className="bg-brand/10 text-brand flex size-8 items-center justify-center rounded-lg">
                            <item.icon size={15} />
                        </span>
                        <p className="text-ink text-[13px] font-semibold">{item.title}</p>
                        <p className="text-ink-soft text-xs leading-relaxed">{item.description}</p>
                    </div>
                ))}
            </div>

            <DocSubsection title="Páginas da aplicação">
                <ul className="border-line bg-surface rounded-card divide-y divide-[var(--color-line)] border">
                    {pages.map((page) => (
                        <li key={page.to}>
                            <Link
                                to={page.to}
                                className="group hover:bg-surface-sunken/60 flex items-start gap-3 px-4 py-3.5 transition-colors"
                            >
                                <page.icon
                                    size={16}
                                    className="text-ink-faint group-hover:text-brand mt-0.5 shrink-0 transition-colors"
                                />
                                <div className="min-w-0">
                                    <p className="text-ink group-hover:text-brand text-[13px] font-semibold transition-colors">
                                        {page.title}{' '}
                                        <span className="text-ink-faint font-mono text-[11px] font-normal">
                                            {page.to}
                                        </span>
                                    </p>
                                    <p className="text-ink-soft mt-0.5 text-xs leading-relaxed">
                                        {page.description}
                                    </p>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            </DocSubsection>
        </DocSection>
    );
}
