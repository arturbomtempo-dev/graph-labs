import { MousePointerClick, Route, TableProperties } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';
import { AlgorithmGrid } from './_components/AlgorithmGrid';
import { HeroSection } from './_components/HeroSection';

const capabilityIcons = [MousePointerClick, Route, TableProperties];

export function Home() {
    const { t } = useI18n();

    return (
        <div className="flex flex-col">
            <HeroSection />

            <section className="border-line border-b">
                <div className="mx-auto grid w-full max-w-275 gap-6 px-4 py-14 sm:grid-cols-3 sm:px-6">
                    {t.home.capabilities.map((capability, index) => {
                        const Icon = capabilityIcons[index];
                        return (
                            <div key={capability.title} className="flex flex-col gap-2.5">
                                <span className="bg-brand/10 text-brand flex size-9 items-center justify-center rounded-lg">
                                    <Icon size={17} />
                                </span>
                                <h3 className="text-ink text-sm font-semibold">
                                    {capability.title}
                                </h3>
                                <p className="text-ink-soft text-xs leading-relaxed">
                                    {capability.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </section>

            <AlgorithmGrid />
        </div>
    );
}
