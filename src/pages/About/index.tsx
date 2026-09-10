import { AuthorAvatar } from '@/components/AuthorAvatar';
import { BrandIcon } from '@/components/BrandIcon';
import { Button } from '@/components/Button';
import { Card, CardHeader } from '@/components/Card';
import { algorithms } from '@/lib/algorithms';
import { author } from '@/lib/author';
import { presets } from '@/lib/graph/presets';
import { ArrowRight, BookOpen, Code2, GraduationCap, ScrollText, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const credentials = [
    {
        icon: Code2,
        title: 'Desenvolvedor de Software',
        description: 'Mais de 4 anos de experiência na área.',
    },
    {
        icon: ScrollText,
        title: 'Técnico em Informática',
        description: 'Formação técnica pelo Coemig.',
    },
    {
        icon: GraduationCap,
        title: 'Engenharia de Software',
        description: 'Graduando na PUC Minas.',
    },
];

export function About() {
    const categories = new Set(algorithms.map((algorithm) => algorithm.category)).size;

    const numbers = [
        { value: String(algorithms.length), label: 'métodos implementados' },
        { value: String(categories), label: 'frentes da disciplina' },
        { value: String(presets.length), label: 'grafos de exemplo' },
    ];

    return (
        <div className="flex flex-col">
            <section className="border-line relative overflow-hidden border-b">
                <div
                    aria-hidden
                    className="from-brand/12 pointer-events-none absolute inset-0 bg-gradient-to-br via-transparent to-transparent"
                />
                <div className="relative mx-auto w-full max-w-[1100px] px-4 py-14 sm:px-6 sm:py-20">
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-8">
                        <AuthorAvatar
                            className="border-line shadow-soft size-24 shrink-0 rounded-2xl border sm:size-28"
                            fallbackClassName="text-2xl"
                        />

                        <div className="min-w-0">
                            <span className="border-line bg-surface text-ink-soft inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-medium">
                                <Users size={12} className="text-brand" />
                                Sobre o autor
                            </span>

                            <h1 className="text-ink mt-4 text-3xl leading-[1.1] font-semibold tracking-tight text-balance sm:text-4xl">
                                {author.name}
                            </h1>

                            <p className="text-ink-soft mt-2 text-sm leading-relaxed sm:text-base">
                                {author.headline} · {author.role} na {author.institution} no{' '}
                                {author.term}.
                            </p>

                            <ul className="mt-6 flex flex-wrap gap-2">
                                {author.links.map((link) => (
                                    <li key={link.id}>
                                        <a
                                            href={link.url}
                                            target="_blank"
                                            rel="noreferrer noopener"
                                            className="border-line bg-surface text-ink-soft hover:border-brand hover:text-brand shadow-soft inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg border px-3 text-xs font-medium transition-all duration-150"
                                        >
                                            <BrandIcon name={link.id} size={14} />
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            <section className="mx-auto w-full max-w-[1100px] px-4 py-14 sm:px-6">
                <div className="grid gap-4 lg:grid-cols-2">
                    <Card>
                        <CardHeader
                            title="Quem escreve"
                            description="Um resumo rápido da minha formação e do que faço."
                        />
                        <div className="flex flex-col gap-4 p-5">
                            <p className="text-ink-soft text-[13px] leading-relaxed">
                                Trabalho com desenvolvimento há mais de 4 anos, construindo
                                aplicações web e ferramentas que tornam ideias abstratas mais fáceis
                                de enxergar. Gosto especialmente de projetos em que a interface é o
                                que faz o conceito finalmente fazer sentido.
                            </p>

                            <ul className="flex flex-col gap-3">
                                {credentials.map((item) => (
                                    <li key={item.title} className="flex items-start gap-3">
                                        <span className="bg-brand/10 text-brand mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg">
                                            <item.icon size={15} />
                                        </span>
                                        <div className="min-w-0">
                                            <p className="text-ink text-[13px] font-semibold">
                                                {item.title}
                                            </p>
                                            <p className="text-ink-soft mt-0.5 text-xs leading-relaxed">
                                                {item.description}
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </Card>

                    <Card>
                        <CardHeader
                            title="Por que o Graph Labs existe"
                            description="Para estudar os algoritmos e conferir exercícios."
                        />
                        <div className="flex flex-col gap-4 p-5">
                            <p className="text-ink-soft text-[13px] leading-relaxed">
                                Na monitoria de Teoria dos Grafos da {author.institution}, no{' '}
                                {author.term}, desenvolvi o Graph Labs para ajudar os alunos a
                                compreender e revisar os principais algoritmos de grafos vistos na
                                disciplina.
                            </p>

                            <p className="text-ink-soft text-[13px] leading-relaxed">
                                A ideia nasceu de uma dificuldade recorrente no atendimento: o
                                pseudocódigo no papel esconde o que de fato acontece a cada
                                iteração. Aqui cada método executa passo a passo sobre o grafo que o
                                próprio aluno desenhou, exibindo as mesmas tabelas, filas e notação
                                usadas em sala, com a justificativa de cada decisão.
                            </p>

                            <p className="text-ink-soft text-[13px] leading-relaxed">
                                Na prática, dá para remontar o grafo de um exercício da lista,
                                executar o método sobre ele e comparar cada passo com o que você
                                resolveu no papel.
                            </p>

                            <dl className="border-line grid grid-cols-3 gap-3 border-t pt-4">
                                {numbers.map((item) => (
                                    <div key={item.label}>
                                        <dt className="text-brand font-mono text-xl font-semibold">
                                            {item.value}
                                        </dt>
                                        <dd className="text-ink-soft mt-0.5 text-[11px] leading-snug">
                                            {item.label}
                                        </dd>
                                    </div>
                                ))}
                            </dl>
                        </div>
                    </Card>
                </div>

                <div className="border-line bg-surface-sunken/50 mt-4 flex flex-col gap-4 rounded-card border p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                        <h2 className="text-ink text-sm font-semibold tracking-tight">
                            Feito para estudar e conferir exercícios
                        </h2>
                        <p className="text-ink-soft mt-1 text-xs leading-relaxed">
                            Monte o grafo do seu exercício ou carregue um dos exemplos e confira
                            cada passo da execução.
                        </p>
                    </div>
                    <div className="flex shrink-0 flex-col gap-2.5 sm:flex-row">
                        <Link to="/estudio" className="block w-full shrink-0 sm:w-auto">
                            <Button
                                variant="primary"
                                fullWidth
                                trailingIcon={<ArrowRight size={15} />}
                                className="sm:w-auto"
                            >
                                Abrir o estúdio
                            </Button>
                        </Link>
                        <Link to="/algoritmos" className="block w-full shrink-0 sm:w-auto">
                            <Button fullWidth icon={<BookOpen size={15} />} className="sm:w-auto">
                                Ver pseudocódigos
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
