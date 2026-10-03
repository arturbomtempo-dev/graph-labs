import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/Badge';
import { useI18n } from '@/hooks/useI18n';
import { algorithmCategories, algorithms } from '@/lib/algorithms';
import type { AlgorithmDefinition } from '@/lib/graph/types';
import { DocSection } from '../DocSection';

type ParameterSummary =
    | 'flow'
    | 'originWithOptionalTarget'
    | 'optionalOriginAndTarget'
    | 'root'
    | 'optionalStart'
    | 'none';

function parameterSummary(algorithm: AlgorithmDefinition): ParameterSummary {
    if (algorithm.category === 'max-flow') return 'flow';
    if (algorithm.category === 'shortest-path') {
        return algorithm.needsStart ? 'originWithOptionalTarget' : 'optionalOriginAndTarget';
    }
    if (algorithm.needsStart) return 'root';
    if (algorithm.id === 'fleury') return 'optionalStart';
    return 'none';
}

export function CatalogSection() {
    const { t, path } = useI18n();
    const text = t.docs.catalog;

    return (
        <DocSection section="catalog" description={text.description(algorithms.length)}>
            {algorithmCategories.map((category) => (
                <div key={category} className="flex flex-col gap-2">
                    <p className="text-ink-faint text-[10px] font-semibold tracking-wider uppercase">
                        {t.categories[category]}
                    </p>
                    <ul className="border-line bg-surface rounded-card divide-line divide-y border">
                        {algorithms
                            .filter((algorithm) => algorithm.category === category)
                            .map((algorithm) => {
                                const algorithmText = t.algorithms[algorithm.id];
                                return (
                                    <li
                                        key={algorithm.id}
                                        className="flex flex-col gap-2 px-4 py-3.5"
                                    >
                                        <div className="flex flex-wrap items-start justify-between gap-2">
                                            <Link
                                                to={path('algorithms', algorithm.id)}
                                                className="text-ink hover:text-brand group inline-flex items-center gap-1 text-[13px] font-semibold transition-colors"
                                            >
                                                {algorithmText.name}
                                                <ArrowUpRight
                                                    size={13}
                                                    className="text-ink-faint group-hover:text-brand transition-colors"
                                                />
                                            </Link>
                                            <Badge tone="brand" className="font-mono">
                                                {algorithmText.complexity}
                                            </Badge>
                                        </div>
                                        <p className="text-ink-soft text-xs leading-relaxed">
                                            {algorithmText.tagline}
                                        </p>
                                        <p className="text-ink-faint text-[11px]">
                                            {text.parameters}{' '}
                                            <span className="text-ink-soft">
                                                {text.summaries[parameterSummary(algorithm)]}
                                            </span>
                                        </p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {algorithmText.constraints.map((constraint) => (
                                                <Badge key={constraint}>{constraint}</Badge>
                                            ))}
                                        </div>
                                    </li>
                                );
                            })}
                    </ul>
                </div>
            ))}
        </DocSection>
    );
}
