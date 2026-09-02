import { ArrowRight, BookOpen, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/Button';

export function HeroSection() {
    return (
        <section className="border-line relative overflow-hidden border-b">
            <div
                aria-hidden
                className="from-brand/12 pointer-events-none absolute inset-0 bg-gradient-to-br via-transparent to-transparent"
            />
            <div className="relative mx-auto w-full max-w-[1100px] px-4 py-16 sm:px-6 sm:py-24">
                <span className="border-line bg-surface text-ink-soft inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-medium">
                    <Sparkles size={12} className="text-brand" />
                    Teoria dos grafos e computabilidade
                </span>

                <h1 className="text-ink mt-5 max-w-3xl text-3xl leading-[1.1] font-semibold tracking-tight text-balance sm:text-5xl">
                    Monte o grafo, escolha o algoritmo e acompanhe cada passo da execução.
                </h1>

                <p className="text-ink-soft mt-4 max-w-2xl text-sm leading-relaxed text-pretty sm:text-base">
                    Um laboratório visual para aulas e monitorias. Desenhe vértices e arestas
                    direcionadas ou não direcionadas, defina custos e execute os métodos clássicos
                    da disciplina na mesma notação usada em sala, com tabelas, filas e a
                    justificativa de cada iteração.
                </p>

                <div className="mt-8 flex flex-wrap gap-2.5">
                    <Link to="/estudio">
                        <Button variant="primary" size="lg" trailingIcon={<ArrowRight size={16} />}>
                            Abrir o estúdio
                        </Button>
                    </Link>
                    <Link to="/algoritmos">
                        <Button size="lg" icon={<BookOpen size={16} />}>
                            Ver pseudocódigos
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
