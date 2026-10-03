import { Button } from '@/components/Button';
import { useI18n } from '@/hooks/useI18n';
import { ArrowLeft, Unplug } from 'lucide-react';
import { Link } from 'react-router-dom';

export function NotFound() {
    const { t, path } = useI18n();
    const text = t.shell.notFound;

    return (
        <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 py-24 text-center">
            <span className="bg-surface-sunken text-ink-faint flex size-14 items-center justify-center rounded-2xl">
                <Unplug size={24} />
            </span>
            <div>
                <p className="text-ink text-lg font-semibold tracking-tight">{text.title}</p>
                <p className="text-ink-soft mt-1.5 max-w-sm text-sm leading-relaxed">
                    {text.description}
                </p>
            </div>
            <Link to={path('home')}>
                <Button variant="primary" icon={<ArrowLeft size={15} />}>
                    {text.back}
                </Button>
            </Link>
        </div>
    );
}
