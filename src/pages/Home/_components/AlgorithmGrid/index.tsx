import { Link } from 'react-router-dom';
import { Badge } from '@/components/Badge';
import { algorithms } from '@/lib/algorithms';

export function AlgorithmGrid() {
    return (
        <section className="mx-auto w-full max-w-[1100px] px-4 py-14 sm:px-6 sm:py-20">
            <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                    <h2 className="text-ink text-xl font-semibold tracking-tight sm:text-2xl">
                        Da busca em grafos à coloração, na ordem da disciplina
                    </h2>
                    <p className="text-ink-soft mt-1.5 max-w-2xl text-sm leading-relaxed">
                        Cada execução gera um traço completo: marcação dos vértices, tabelas
                        auxiliares e a justificativa de cada decisão.
                    </p>
                </div>
                <Badge tone="brand">{algorithms.length} algoritmos</Badge>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {algorithms.map((algorithm) => (
                    <Link
                        key={algorithm.id}
                        to="/algoritmos"
                        className="border-line bg-surface hover:border-brand shadow-soft hover:shadow-pop group rounded-card border p-4 transition-all duration-200"
                    >
                        <div className="flex items-start justify-between gap-2">
                            <h3 className="text-ink group-hover:text-brand text-sm font-semibold transition-colors">
                                {algorithm.name}
                            </h3>
                            <span className="text-ink-faint shrink-0 font-mono text-[10px]">
                                {algorithm.complexity}
                            </span>
                        </div>
                        <p className="text-ink-soft mt-2 text-xs leading-relaxed">
                            {algorithm.tagline}
                        </p>
                        <p className="text-ink-faint mt-3 text-[10px] font-semibold tracking-wider uppercase">
                            {algorithm.category}
                        </p>
                    </Link>
                ))}
            </div>
        </section>
    );
}
