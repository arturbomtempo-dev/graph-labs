import { Button } from '@/components/Button';
import { useI18n } from '@/hooks/useI18n';
import { ArrowRight, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

export function HeroSection() {
    const { t, path } = useI18n();
    const text = t.home.hero;

    return (
        <section className="border-line relative overflow-hidden border-b">
            <div
                aria-hidden
                className="from-brand/12 pointer-events-none absolute inset-0 bg-linear-to-br via-transparent to-transparent"
            />
            <div className="relative mx-auto w-full max-w-275 px-4 py-16 sm:px-6 sm:py-24">
                <h1 className="text-ink max-w-3xl text-3xl leading-[1.1] font-semibold tracking-tight text-balance sm:text-5xl">
                    {text.title}
                </h1>

                <p className="text-ink-soft mt-4 max-w-2xl text-sm leading-relaxed text-pretty sm:text-base">
                    {text.description}
                </p>

                <div className="mt-8 flex flex-wrap gap-2.5">
                    <Link to={path('studio')}>
                        <Button variant="primary" size="lg" trailingIcon={<ArrowRight size={16} />}>
                            {text.openStudio}
                        </Button>
                    </Link>
                    <Link to={path('algorithms')}>
                        <Button size="lg" icon={<BookOpen size={16} />}>
                            {text.viewPseudocode}
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
