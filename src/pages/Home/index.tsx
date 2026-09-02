import { MousePointerClick, Route, TableProperties } from 'lucide-react';
import { AlgorithmGrid } from './_components/AlgorithmGrid';
import { HeroSection } from './_components/HeroSection';

const capabilities = [
    {
        icon: MousePointerClick,
        title: 'Edição direta no canvas',
        description:
            'Crie vértices com um clique, conecte-os arrastando o olhar de um ao outro e ajuste custos e direção sem sair da tela.',
    },
    {
        icon: Route,
        title: 'Direcionado, não direcionado ou misto',
        description:
            'Cada aresta guarda sua própria orientação. Os algoritmos validam o tipo de grafo exigido antes de executar.',
    },
    {
        icon: TableProperties,
        title: 'Traço passo a passo',
        description:
            'Filas, pilhas, tabelas de dist e pred e matrizes de distância acompanham a animação em cada iteração.',
    },
];

export function Home() {
    return (
        <div className="flex flex-col">
            <HeroSection />

            <section className="border-line border-b">
                <div className="mx-auto grid w-full max-w-[1100px] gap-6 px-4 py-14 sm:grid-cols-3 sm:px-6">
                    {capabilities.map((capability) => (
                        <div key={capability.title} className="flex flex-col gap-2.5">
                            <span className="bg-brand/10 text-brand flex size-9 items-center justify-center rounded-lg">
                                <capability.icon size={17} />
                            </span>
                            <h3 className="text-ink text-sm font-semibold">{capability.title}</h3>
                            <p className="text-ink-soft text-xs leading-relaxed">
                                {capability.description}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            <AlgorithmGrid />
        </div>
    );
}
