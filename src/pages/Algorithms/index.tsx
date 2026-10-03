import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { SegmentedControl } from '@/components/SegmentedControl';
import { useI18n } from '@/hooks/useI18n';
import { algorithmCategories, algorithms } from '@/lib/algorithms';
import type { AlgorithmCategory } from '@/lib/graph/types';
import { AlgorithmArticle } from './_components/AlgorithmArticle';

type CategoryFilter = AlgorithmCategory | 'all';

export function Algorithms() {
    const { t } = useI18n();
    const [category, setCategory] = useState<CategoryFilter>('all');
    const { hash } = useLocation();

    useEffect(() => {
        if (hash) document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView();
    }, [hash]);

    const options = [
        { value: 'all' as const, label: t.algorithmsPage.all },
        ...algorithmCategories.map((item) => ({ value: item, label: t.categories[item] })),
    ];

    const visible = algorithms.filter(
        (algorithm) => category === 'all' || algorithm.category === category
    );

    return (
        <div className="mx-auto w-full max-w-275 px-4 py-10 sm:px-6 sm:py-14">
            <header className="flex flex-col gap-3">
                <h1 className="text-ink text-2xl font-semibold tracking-tight sm:text-3xl">
                    {t.algorithmsPage.title}
                </h1>
                <p className="text-ink-soft max-w-2xl text-sm leading-relaxed">
                    {t.algorithmsPage.description}
                </p>
            </header>

            <div className="no-scrollbar mt-6 overflow-x-auto">
                <SegmentedControl
                    options={options}
                    value={category}
                    onChange={setCategory}
                    className="w-max min-w-full"
                    size="sm"
                />
            </div>

            <div className="mt-6 flex flex-col gap-4">
                {visible.map((algorithm) => (
                    <AlgorithmArticle key={algorithm.id} algorithm={algorithm} />
                ))}
            </div>
        </div>
    );
}
