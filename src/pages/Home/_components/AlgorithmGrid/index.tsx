import { Link } from 'react-router-dom';
import { Badge } from '@/components/Badge';
import { useI18n } from '@/hooks/useI18n';
import { algorithms } from '@/lib/algorithms';

export function AlgorithmGrid() {
    const { t, path } = useI18n();

    return (
        <section className="mx-auto w-full max-w-275 px-4 py-14 sm:px-6 sm:py-20">
            <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                    <h2 className="text-ink text-xl font-semibold tracking-tight sm:text-2xl">
                        {t.home.grid.title}
                    </h2>
                    <p className="text-ink-soft mt-1.5 max-w-2xl text-sm leading-relaxed">
                        {t.home.grid.description}
                    </p>
                </div>
                <Badge tone="brand">{t.home.grid.badge(algorithms.length)}</Badge>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {algorithms.map((algorithm) => (
                    <Link
                        key={algorithm.id}
                        to={path('algorithms', algorithm.id)}
                        className="border-line bg-surface hover:border-brand shadow-soft hover:shadow-pop group rounded-card border p-4 transition-all duration-200"
                    >
                        <div className="flex items-start justify-between gap-2">
                            <h3 className="text-ink group-hover:text-brand text-sm font-semibold transition-colors">
                                {t.algorithms[algorithm.id].name}
                            </h3>
                            <span className="text-ink-faint shrink-0 font-mono text-[10px]">
                                {t.algorithms[algorithm.id].complexity}
                            </span>
                        </div>
                        <p className="text-ink-soft mt-2 text-xs leading-relaxed">
                            {t.algorithms[algorithm.id].tagline}
                        </p>
                        <p className="text-ink-faint mt-3 text-[10px] font-semibold tracking-wider uppercase">
                            {t.categories[algorithm.category]}
                        </p>
                    </Link>
                ))}
            </div>
        </section>
    );
}
