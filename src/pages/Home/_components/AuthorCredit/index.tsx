import { AuthorAvatar } from '@/components/AuthorAvatar';
import { BrandIcon } from '@/components/BrandIcon';
import { Button } from '@/components/Button';
import { author } from '@/lib/author';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function AuthorCredit() {
    return (
        <section className="border-line bg-surface-sunken/40 border-t">
            <div className="mx-auto flex w-full max-w-[1100px] flex-col gap-5 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <div className="flex items-center gap-3">
                    <AuthorAvatar
                        className="border-line size-11 shrink-0 rounded-full border"
                        fallbackClassName="text-xs"
                    />
                    <div className="min-w-0">
                        <p className="text-ink text-xs font-semibold">
                            Desenvolvido por {author.name}
                        </p>
                        <p className="text-ink-soft mt-0.5 text-[11px] leading-relaxed">
                            {author.role} na {author.institution} no {author.term}.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {author.links.map((link) => (
                        <a
                            key={link.id}
                            href={link.url}
                            target="_blank"
                            rel="noreferrer noopener"
                            title={link.label}
                            aria-label={link.label}
                            className="border-line bg-surface text-ink-soft hover:border-brand hover:text-brand inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg border transition-all duration-150"
                        >
                            <BrandIcon name={link.id} size={14} />
                        </a>
                    ))}

                    <Link to="/sobre" className="ml-1">
                        <Button size="sm" trailingIcon={<ArrowRight size={14} />}>
                            Sobre
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
