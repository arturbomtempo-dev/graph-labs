import { Button } from '@/components/Button';
import { useI18n } from '@/hooks/useI18n';
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
import { docSections } from './sections';

function scrollToSection(id: string, behavior: ScrollBehavior) {
    document.getElementById(id)?.scrollIntoView({ behavior, block: 'start' });
}

export function Docs() {
    const { t, path } = useI18n();
    const { hash } = useLocation();
    const [activeId, setActiveId] = useState<string | null>(docSections[0].id);
    const text = t.docs.hero;

    const tocItems: TocItem[] = docSections.map((section) => ({
        id: section.id,
        title: t.docs.sections[section.key],
    }));

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
                        {text.eyebrow}
                    </p>
                    <h1 className="text-ink mt-3 max-w-3xl text-3xl leading-[1.1] font-semibold tracking-tight text-balance sm:text-4xl">
                        {text.title}
                    </h1>
                    <p className="text-ink-soft mt-4 max-w-2xl text-sm leading-relaxed text-pretty sm:text-base">
                        {text.description}
                    </p>
                    <div className="mt-8 flex flex-wrap gap-2.5">
                        <Link to={path('studio')}>
                            <Button variant="primary" trailingIcon={<ArrowRight size={15} />}>
                                {text.openStudio}
                            </Button>
                        </Link>
                        <Link to={path('algorithms')}>
                            <Button icon={<BookOpen size={15} />}>{text.viewPseudocode}</Button>
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
