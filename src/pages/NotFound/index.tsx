import { ArrowLeft, Unplug } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/Button';

export function NotFound() {
    return (
        <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 py-24 text-center">
            <span className="bg-surface-sunken text-ink-faint flex size-14 items-center justify-center rounded-2xl">
                <Unplug size={24} />
            </span>
            <div>
                <p className="text-ink text-lg font-semibold tracking-tight">
                    Este vértice não existe no grafo
                </p>
                <p className="text-ink-soft mt-1.5 max-w-sm text-sm leading-relaxed">
                    A rota que você tentou acessar não foi encontrada. Volte para o início e escolha
                    um caminho válido.
                </p>
            </div>
            <Link to="/">
                <Button variant="primary" icon={<ArrowLeft size={15} />}>
                    Voltar ao início
                </Button>
            </Link>
        </div>
    );
}
