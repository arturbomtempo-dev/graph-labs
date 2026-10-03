import { Button } from '@/components/Button';
import { ArrowRight, BookOpen } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnatomySection } from './_components/AnatomySection';
import { BuildSection } from './_components/BuildSection';
import { CanvasSection } from './_components/CanvasSection';
import { CatalogSection } from './_components/CatalogSection';
import { FaqSection } from './_components/FaqSection';
import { OverviewSection } from './_components/OverviewSection';
import { QuickStartSection } from './_components/QuickStartSection';
import { RunSection } from './_components/RunSection';
import { ShortcutsSection } from './_components/ShortcutsSection';
import { StepsSection } from './_components/StepsSection';
import { StorageSection } from './_components/StorageSection';
import {
    MobileTableOfContents,
    TableOfContents,
    type TocItem,
} from './_components/TableOfContents';

const tocItems: TocItem[] = [
    { id: 'visao-geral', title: 'Visão geral' },
    { id: 'primeiros-passos', title: 'Primeiros passos' },
    { id: 'anatomia-do-estudio', title: 'Anatomia do estúdio' },
    { id: 'canvas', title: 'Canvas e ferramentas' },
    { id: 'aba-construir', title: 'Aba Construir' },
    { id: 'aba-executar', title: 'Aba Executar' },
    { id: 'aba-passos', title: 'Aba Passos' },
    { id: 'algoritmos', title: 'Catálogo de algoritmos' },
    { id: 'atalhos', title: 'Atalhos de teclado' },
    { id: 'dados-e-preferencias', title: 'Dados e preferências' },
    { id: 'perguntas-frequentes', title: 'Perguntas frequentes' },
];

function scrollToSection(id: string, behavior: ScrollBehavior) {
    document.getElementById(id)?.scrollIntoView({ behavior, block: 'start' });
}

export function Docs() {
    const { hash } = useLocation();
    const [activeId, setActiveId] = useState<string | null>(tocItems[0].id);

    useEffect(() => {
        const sections = document.querySelectorAll<HTMLElement>('[data-doc-section]');
        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
                if (visible.length > 0) setActiveId(visible[0].target.id);
            },
            { rootMargin: '-72px 0px -60% 0px' }
        );
        sections.forEach((section) => observer.observe(section));
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (hash) scrollToSection(decodeURIComponent(hash.slice(1)), 'auto');
    }, [hash]);

    const handleNavigate = useCallback((id: string) => {
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        scrollToSection(id, reduceMotion ? 'auto' : 'smooth');
        window.history.replaceState(null, '', `#${id}`);
        setActiveId(id);
    }, []);

    return (
        <div className="flex flex-col">
            <section className="border-line relative overflow-hidden border-b">
                <div
                    aria-hidden
                    className="from-brand/12 pointer-events-none absolute inset-0 bg-linear-to-br via-transparent to-transparent"
                />
                <div className="relative mx-auto w-full max-w-300 px-4 py-14 sm:px-6 sm:py-20">
                    <p className="text-ink-faint text-[11px] font-semibold tracking-wider uppercase">
                        Documentação
                    </p>
                    <h1 className="text-ink mt-3 max-w-3xl text-3xl leading-[1.1] font-semibold tracking-tight text-balance sm:text-4xl">
                        Como o Graph Labs funciona
                    </h1>
                    <p className="text-ink-soft mt-4 max-w-2xl text-sm leading-relaxed text-pretty sm:text-base">
                        Um guia completo do estúdio: como montar o grafo, configurar e executar cada
                        algoritmo, ler o traço passo a passo e aproveitar os recursos que tornam a
                        conferência de exercícios mais rápida.
                    </p>
                    <div className="mt-8 flex flex-wrap gap-2.5">
                        <Link to="/estudio">
                            <Button variant="primary" trailingIcon={<ArrowRight size={15} />}>
                                Abrir o estúdio
                            </Button>
                        </Link>
                        <Link to="/algoritmos">
                            <Button icon={<BookOpen size={15} />}>Ver pseudocódigos</Button>
                        </Link>
                    </div>
                </div>
            </section>

            <div className="mx-auto grid w-full max-w-300 gap-10 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-14">
                <aside className="hidden lg:block">
                    <div className="sticky top-24">
                        <TableOfContents
                            items={tocItems}
                            activeId={activeId}
                            onNavigate={handleNavigate}
                        />
                    </div>
                </aside>

                <div className="flex max-w-205 min-w-0 flex-col gap-12">
                    <MobileTableOfContents items={tocItems} onNavigate={handleNavigate} />
                    <OverviewSection />
                    <QuickStartSection />
                    <AnatomySection />
                    <CanvasSection />
                    <BuildSection />
                    <RunSection />
                    <StepsSection />
                    <CatalogSection />
                    <ShortcutsSection />
                    <StorageSection />
                    <FaqSection />
                </div>
            </div>
        </div>
    );
}
