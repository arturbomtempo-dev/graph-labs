import { BookOpen, GraduationCap, Hammer, Info, MonitorSmartphone, Route } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useI18n } from '@/hooks/useI18n';
import type { RouteKey } from '@/i18n/config';
import { algorithms } from '@/lib/algorithms';
import { presets } from '@/lib/graph/presets';
import { DocSection, DocSubsection } from '../DocSection';

const pageEntries: {
    route: Extract<RouteKey, 'studio' | 'algorithms' | 'about'>;
    icon: typeof Info;
}[] = [
    { route: 'studio', icon: Hammer },
    { route: 'algorithms', icon: BookOpen },
    { route: 'about', icon: Info },
];

const principleIcons = [GraduationCap, Route, MonitorSmartphone];

export function OverviewSection() {
    const { t, path } = useI18n();
    const text = t.docs.overview;
    const categories = new Set(algorithms.map((algorithm) => algorithm.category)).size;

    const numbers = [
        { value: algorithms.length, label: text.numbers.algorithms },
        { value: categories, label: text.numbers.topics },
        { value: presets.length, label: text.numbers.presets },
    ];

    return (
        <DocSection section="overview" description={text.description}>
            <dl className="border-line bg-surface shadow-soft rounded-card grid grid-cols-3 divide-x divide-line border">
                {numbers.map((item) => (
                    <div key={item.label} className="px-4 py-4 sm:px-5">
                        <dt className="text-brand font-mono text-2xl font-semibold">
                            {item.value}
                        </dt>
                        <dd className="text-ink-soft mt-0.5 text-[11px] leading-snug sm:text-xs">
                            {item.label}
                        </dd>
                    </div>
                ))}
            </dl>

            <DocSubsection title={text.problemTitle}>
                {text.problemParagraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                ))}
            </DocSubsection>

            <div className="grid gap-3 sm:grid-cols-3">
                {text.principles.map((item, index) => {
                    const Icon = principleIcons[index];
                    return (
                        <div
                            key={item.title}
                            className="border-line bg-surface rounded-card flex flex-col gap-2.5 border p-4"
                        >
                            <span className="bg-brand/10 text-brand flex size-8 items-center justify-center rounded-lg">
                                <Icon size={15} />
                            </span>
                            <p className="text-ink text-[13px] font-semibold">{item.title}</p>
                            <p className="text-ink-soft text-xs leading-relaxed">
                                {item.description}
                            </p>
                        </div>
                    );
                })}
            </div>

            <DocSubsection title={text.pagesTitle}>
                <ul className="border-line bg-surface rounded-card divide-y divide-line border">
                    {pageEntries.map((page) => (
                        <li key={page.route}>
                            <Link
                                to={path(page.route)}
                                className="group hover:bg-surface-sunken/60 flex items-start gap-3 px-4 py-3.5 transition-colors"
                            >
                                <page.icon
                                    size={16}
                                    className="text-ink-faint group-hover:text-brand mt-0.5 shrink-0 transition-colors"
                                />
                                <div className="min-w-0">
                                    <p className="text-ink group-hover:text-brand text-[13px] font-semibold transition-colors">
                                        {t.shell.nav[page.route]}{' '}
                                        <span className="text-ink-faint font-mono text-[11px] font-normal">
                                            {path(page.route)}
                                        </span>
                                    </p>
                                    <p className="text-ink-soft mt-0.5 text-xs leading-relaxed">
                                        {text.pages[page.route]}
                                    </p>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            </DocSubsection>
        </DocSection>
    );
}
