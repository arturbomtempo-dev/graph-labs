import { useState } from 'react';
import { SegmentedControl } from '@/components/SegmentedControl';
import { algorithms } from '@/lib/algorithms';
import { documentationById } from '@/lib/algorithms/documentation';
import type { AlgorithmCategory } from '@/lib/graph/types';
import { AlgorithmArticle } from './_components/AlgorithmArticle';

const categories: (AlgorithmCategory | 'Todos')[] = [
    'Todos',
    'Busca em grafos',
    'Conectividade',
    'Árvore geradora mínima',
    'Caminho mínimo',
    'Fluxo máximo',
];

export function Algorithms() {
    const [category, setCategory] = useState<AlgorithmCategory | 'Todos'>('Todos');

    const visible = algorithms.filter(
        (algorithm) => category === 'Todos' || algorithm.category === category
    );

    return (
        <div className="mx-auto w-full max-w-[1100px] px-4 py-10 sm:px-6 sm:py-14">
            <header className="flex flex-col gap-3">
                <h1 className="text-ink text-2xl font-semibold tracking-tight sm:text-3xl">
                    Referência dos algoritmos
                </h1>
                <p className="text-ink-soft max-w-2xl text-sm leading-relaxed">
                    Pseudocódigo, invariantes e erros comuns de cada método implementado no estúdio,
                    na mesma notação usada em sala. É exatamente essa formulação que a simulação
                    executa passo a passo.
                </p>
            </header>

            <div className="no-scrollbar mt-6 overflow-x-auto">
                <SegmentedControl
                    options={categories.map((item) => ({ value: item, label: item }))}
                    value={category}
                    onChange={setCategory}
                    className="w-max min-w-full"
                    size="sm"
                />
            </div>

            <div className="mt-6 flex flex-col gap-4">
                {visible.map((algorithm) => (
                    <AlgorithmArticle
                        key={algorithm.id}
                        algorithm={algorithm}
                        documentation={documentationById.get(algorithm.id)}
                    />
                ))}
            </div>
        </div>
    );
}
