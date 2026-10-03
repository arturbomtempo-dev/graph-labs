import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/Badge';
import { algorithms } from '@/lib/algorithms';
import type { AlgorithmDefinition } from '@/lib/graph/types';
import { DocSection } from '../DocSection';

function parameterSummary(algorithm: AlgorithmDefinition): string {
    if (algorithm.category === 'Fluxo máximo') return 'Fonte s e sumidouro t';
    if (algorithm.category === 'Caminho mínimo') {
        return algorithm.needsStart ? 'Origem; destino opcional' : 'Origem e destino opcionais';
    }
    if (algorithm.needsStart) return 'Raiz';
    if (algorithm.id === 'fleury') return 'Vértice inicial opcional';
    return 'Nenhum';
}

export function CatalogSection() {
    const categories = [...new Set(algorithms.map((algorithm) => algorithm.category))];

    return (
        <DocSection
            id="algoritmos"
            index={8}
            title="Catálogo de algoritmos"
            description={`Os ${algorithms.length} métodos disponíveis no estúdio, na ordem da disciplina. Para a ideia central, o invariante, os erros comuns e o pseudocódigo de cada um, abra a página de referência.`}
        >
            {categories.map((category) => (
                <div key={category} className="flex flex-col gap-2">
                    <p className="text-ink-faint text-[10px] font-semibold tracking-wider uppercase">
                        {category}
                    </p>
                    <ul className="border-line bg-surface rounded-card divide-y divide-[var(--color-line)] border">
                        {algorithms
                            .filter((algorithm) => algorithm.category === category)
                            .map((algorithm) => (
                                <li key={algorithm.id} className="flex flex-col gap-2 px-4 py-3.5">
                                    <div className="flex flex-wrap items-start justify-between gap-2">
                                        <Link
                                            to={`/algoritmos#${algorithm.id}`}
                                            className="text-ink hover:text-brand group inline-flex items-center gap-1 text-[13px] font-semibold transition-colors"
                                        >
                                            {algorithm.name}
                                            <ArrowUpRight
                                                size={13}
                                                className="text-ink-faint group-hover:text-brand transition-colors"
                                            />
                                        </Link>
                                        <Badge tone="brand" className="font-mono">
                                            {algorithm.complexity}
                                        </Badge>
                                    </div>
                                    <p className="text-ink-soft text-xs leading-relaxed">
                                        {algorithm.tagline}
                                    </p>
                                    <p className="text-ink-faint text-[11px]">
                                        Parâmetros:{' '}
                                        <span className="text-ink-soft">
                                            {parameterSummary(algorithm)}
                                        </span>
                                    </p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {algorithm.constraints.map((constraint) => (
                                            <Badge key={constraint}>{constraint}</Badge>
                                        ))}
                                    </div>
                                </li>
                            ))}
                    </ul>
                </div>
            ))}
        </DocSection>
    );
}
