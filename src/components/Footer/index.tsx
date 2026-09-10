import { author } from '@/lib/author';

export function Footer() {
    return (
        <footer className="border-line bg-surface-sunken/40 border-t">
            <div className="mx-auto flex w-full max-w-[1100px] flex-col items-center gap-1.5 px-4 py-6 sm:flex-row sm:justify-between sm:gap-4 sm:px-6">
                <p className="text-ink-faint text-xs">
                    © {new Date().getFullYear()} Graph Labs. Todos os direitos reservados.
                </p>

                <p className="text-ink-faint text-xs">
                    Desenvolvido por{' '}
                    <a
                        href={author.website}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="text-ink-soft hover:text-brand hover:decoration-brand cursor-pointer font-medium underline decoration-transparent decoration-1 underline-offset-4 transition-colors duration-150"
                    >
                        {author.name}
                    </a>
                </p>
            </div>
        </footer>
    );
}
