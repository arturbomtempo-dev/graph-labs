import { AuthorAvatar } from '@/components/AuthorAvatar';
import { BrandIcon } from '@/components/BrandIcon';
import { Button } from '@/components/Button';
import { Card, CardHeader } from '@/components/Card';
import { useI18n } from '@/hooks/useI18n';
import { algorithms } from '@/lib/algorithms';
import { author } from '@/lib/author';
import { presets } from '@/lib/graph/presets';
import { ArrowRight, BookOpen, Code2, GraduationCap, ScrollText } from 'lucide-react';
import { Link } from 'react-router-dom';

const credentialIcons = [Code2, ScrollText, GraduationCap];

export function About() {
    const { t, path } = useI18n();
    const text = t.about;
    const categories = new Set(algorithms.map((algorithm) => algorithm.category)).size;

    const numbers = [
        { value: String(algorithms.length), label: text.why.numbers.methods },
        { value: String(categories), label: text.why.numbers.topics },
        { value: String(presets.length), label: text.why.numbers.presets },
    ];

    const credentials = text.credentials.map((credential, index) => ({
        ...credential,
        icon: credentialIcons[index],
    }));

    return (
        <div className="flex flex-col">
            <section className="border-line relative overflow-hidden border-b">
                <div
                    aria-hidden
                    className="from-brand/12 pointer-events-none absolute inset-0 bg-linear-to-br via-transparent to-transparent"
                />
                <div className="relative mx-auto w-full max-w-275 px-4 py-14 sm:px-6 sm:py-20">
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-8">
                        <AuthorAvatar
                            className="border-line shadow-soft size-24 shrink-0 rounded-2xl border sm:size-28"
                            fallbackClassName="text-2xl"
                        />

                        <div className="min-w-0">
                            <p className="text-ink-faint text-[11px] font-semibold tracking-wider uppercase">
                                {text.eyebrow}
                            </p>

                            <h1 className="text-ink mt-3 text-3xl leading-[1.1] font-semibold tracking-tight text-balance sm:text-4xl">
                                {author.name}
                            </h1>

                            <p className="text-ink-soft mt-2 text-sm leading-relaxed sm:text-base">
                                {text.summary(author.institution)}
                            </p>

                            <ul className="mt-6 flex flex-wrap gap-2">
                                {author.links.map((link) => (
                                    <li key={link.id}>
                                        <a
                                            href={link.url}
                                            target="_blank"
                                            rel="noreferrer noopener"
                                            className="border-line bg-surface text-ink-soft hover:border-brand hover:text-brand shadow-soft inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg border px-3 text-xs font-medium transition-all duration-150"
                                        >
                                            <BrandIcon name={link.id} size={14} />
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            <section className="mx-auto w-full max-w-275 px-4 py-14 sm:px-6">
                <div className="grid gap-4 lg:grid-cols-2">
                    <Card>
                        <CardHeader title={text.who.title} description={text.who.description} />
                        <div className="flex flex-col gap-4 p-5">
                            <p className="text-ink-soft text-[13px] leading-relaxed">
                                {text.who.text}
                            </p>

                            <ul className="flex flex-col gap-3">
                                {credentials.map((item) => (
                                    <li key={item.title} className="flex items-start gap-3">
                                        <span className="bg-brand/10 text-brand mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg">
                                            <item.icon size={15} />
                                        </span>
                                        <div className="min-w-0">
                                            <p className="text-ink text-[13px] font-semibold">
                                                {item.title}
                                            </p>
                                            <p className="text-ink-soft mt-0.5 text-xs leading-relaxed">
                                                {item.description}
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </Card>

                    <Card>
                        <CardHeader title={text.why.title} description={text.why.description} />
                        <div className="flex flex-col gap-4 p-5">
                            {text.why.paragraphs(author.institution).map((paragraph) => (
                                <p
                                    key={paragraph}
                                    className="text-ink-soft text-[13px] leading-relaxed"
                                >
                                    {paragraph}
                                </p>
                            ))}

                            <dl className="border-line grid grid-cols-3 gap-3 border-t pt-4">
                                {numbers.map((item) => (
                                    <div key={item.label}>
                                        <dt className="text-brand font-mono text-xl font-semibold">
                                            {item.value}
                                        </dt>
                                        <dd className="text-ink-soft mt-0.5 text-[11px] leading-snug">
                                            {item.label}
                                        </dd>
                                    </div>
                                ))}
                            </dl>
                        </div>
                    </Card>
                </div>

                <div className="border-line bg-surface-sunken/50 mt-4 flex flex-col gap-4 rounded-card border p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                        <h2 className="text-ink text-sm font-semibold tracking-tight">
                            {text.cta.title}
                        </h2>
                        <p className="text-ink-soft mt-1 text-xs leading-relaxed">
                            {text.cta.description}
                        </p>
                    </div>
                    <div className="flex shrink-0 flex-col gap-2.5 sm:flex-row">
                        <Link to={path('studio')} className="block w-full shrink-0 sm:w-auto">
                            <Button
                                variant="primary"
                                fullWidth
                                trailingIcon={<ArrowRight size={15} />}
                                className="sm:w-auto"
                            >
                                {text.cta.openStudio}
                            </Button>
                        </Link>
                        <Link to={path('algorithms')} className="block w-full shrink-0 sm:w-auto">
                            <Button fullWidth icon={<BookOpen size={15} />} className="sm:w-auto">
                                {text.cta.viewPseudocode}
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
