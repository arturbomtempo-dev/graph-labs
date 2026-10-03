import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/Button';
import { Callout } from '../Callout';
import { DocSection, DocSubsection } from '../DocSection';

const steps = [
    {
        title: 'Monte o grafo',
        description:
            'Na aba Construir, carregue um modelo pronto ou desenhe do zero: crie vértices clicando no canvas e conecte-os com a ferramenta de arestas.',
    },
    {
        title: 'Ajuste pesos e direções',
        description:
            'Defina o peso de cada aresta (ou deixe sem peso) e escolha se ela é simples ou direcionada, pelo canvas ou pela lista de arestas.',
    },
    {
        title: 'Escolha o algoritmo',
        description:
            'Na aba Executar, selecione o método e preencha os parâmetros que aparecerem: raiz, destino, fonte, sumidouro ou sequência de visita.',
    },
    {
        title: 'Execute e acompanhe',
        description:
            'Clique em Executar. A aba Passos abre sozinha com o primeiro passo; avance manualmente ou use a reprodução automática.',
    },
];

const example = [
    <>
        Na aba <strong className="text-ink font-medium">Construir</strong>, clique em{' '}
        <strong className="text-ink font-medium">Rede ponderada</strong>. O grafo é carregado e
        enquadrado automaticamente.
    </>,
    <>
        Vá para <strong className="text-ink font-medium">Executar</strong> e escolha{' '}
        <strong className="text-ink font-medium">Método de Dijkstra</strong>, em Caminho mínimo.
    </>,
    <>
        Em Raiz / origem, selecione <code className="font-mono text-[12px]">A</code>; em Vértice de
        destino, selecione <code className="font-mono text-[12px]">F</code>.
    </>,
    <>
        Clique em <strong className="text-ink font-medium">Executar Dijkstra</strong> e use{' '}
        <strong className="text-ink font-medium">Próximo passo</strong> para ver cada vértice ser
        fechado e cada aresta tensa ser relaxada na tabela <em>dist e pred</em>.
    </>,
    <>
        No último passo, o caminho mínimo <code className="font-mono text-[12px]">A → C → F</code>,
        de peso 11, aparece em roxo, e o card de Conclusões resume as distâncias finais.
    </>,
];

export function QuickStartSection() {
    return (
        <DocSection
            id="primeiros-passos"
            index={2}
            title="Primeiros passos"
            description="Todo uso do estúdio segue o mesmo ciclo de quatro etapas, refletido nas três abas do painel lateral: Construir, Executar e Passos."
        >
            <ol className="grid gap-3 sm:grid-cols-2">
                {steps.map((step, index) => (
                    <li
                        key={step.title}
                        className="border-line bg-surface rounded-card relative flex flex-col gap-2 border p-4"
                    >
                        <span className="bg-brand text-brand-ink flex size-6 items-center justify-center rounded-full font-mono text-[11px] font-semibold">
                            {index + 1}
                        </span>
                        <p className="text-ink text-[13px] font-semibold">{step.title}</p>
                        <p className="text-ink-soft text-xs leading-relaxed">{step.description}</p>
                    </li>
                ))}
            </ol>

            <DocSubsection title="Exemplo guiado: caminho mínimo com Dijkstra">
                <p>Um roteiro de dois minutos para conhecer o estúdio usando um grafo pronto:</p>
                <ol className="flex flex-col gap-2">
                    {example.map((item, index) => (
                        <li key={index} className="flex gap-3">
                            <span className="text-brand w-4 shrink-0 font-mono text-xs font-semibold leading-5">
                                {index + 1}.
                            </span>
                            <span>{item}</span>
                        </li>
                    ))}
                </ol>
                <div>
                    <Link to="/estudio" className="inline-block">
                        <Button size="sm" variant="primary" trailingIcon={<ArrowRight size={14} />}>
                            Testar no estúdio
                        </Button>
                    </Link>
                </div>
            </DocSubsection>

            <Callout tone="tip">
                Na primeira visita o estúdio já abre com a Rede ponderada carregada. Depois disso,
                ele sempre reabre com o último grafo em que você trabalhou.
            </Callout>
        </DocSection>
    );
}
