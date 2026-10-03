import { useHydrated } from '@/hooks/useHydrated';
import { useI18n } from '@/hooks/useI18n';
import { Workspace } from './_components/Workspace';

export function Studio() {
    const hydrated = useHydrated();
    const { t } = useI18n();

    if (hydrated) return <Workspace />;

    return (
        <div
            aria-busy
            className="flex flex-1 flex-col lg:h-[calc(100dvh-3.5rem-1px)] lg:flex-none lg:flex-row lg:overflow-hidden"
        >
            <section className="border-line bg-canvas relative flex h-[52dvh] shrink-0 items-center justify-center border-b lg:h-auto lg:flex-1 lg:border-r lg:border-b-0">
                <p className="text-ink-faint text-xs">{t.studio.loading}</p>
            </section>
            <aside className="bg-surface-sunken/40 w-full lg:w-[400px] lg:shrink-0" />
        </div>
    );
}
