import { History, Moon, Network, Wand2 } from 'lucide-react';
import { Callout } from '../Callout';
import { DocSection } from '../DocSection';

const items = [
    {
        icon: Network,
        title: 'Grafo atual',
        storage: 'Salvo no navegador',
        description:
            'Vértices, posições, arestas, pesos e direções são salvos a cada alteração. Ao voltar ao estúdio, o grafo reaparece exatamente como você deixou.',
    },
    {
        icon: Wand2,
        title: 'Sugestão de posicionamento',
        storage: 'Salvo no navegador',
        description: 'Fica lembrado se você prefere o ajuste automático ligado ou desligado.',
    },
    {
        icon: Moon,
        title: 'Tema claro ou escuro',
        storage: 'Salvo no navegador',
        description:
            'Na primeira visita segue a preferência do sistema operacional. Depois, vale a escolha feita no botão do cabeçalho.',
    },
    {
        icon: History,
        title: 'Histórico e execução',
        storage: 'Apenas nesta sessão',
        description:
            'O histórico de desfazer e refazer, o algoritmo escolhido e o traço da execução são descartados ao recarregar a página.',
    },
];

export function StorageSection() {
    return (
        <DocSection
            id="dados-e-preferencias"
            index={10}
            title="Dados e preferências"
            description="O Graph Labs não tem servidor, banco de dados nem cadastro. Todo o processamento acontece no seu navegador e nada do que você desenha é enviado para lugar algum."
        >
            <ul className="grid gap-2.5 sm:grid-cols-2">
                {items.map((item) => (
                    <li
                        key={item.title}
                        className="border-line bg-surface flex flex-col gap-2 rounded-lg border p-4"
                    >
                        <div className="flex items-center justify-between gap-2">
                            <span className="text-ink flex items-center gap-2 text-[13px] font-semibold">
                                <item.icon size={15} className="text-brand" />
                                {item.title}
                            </span>
                            <span className="text-ink-faint text-[10px] font-semibold tracking-wider whitespace-nowrap uppercase">
                                {item.storage}
                            </span>
                        </div>
                        <p className="text-ink-soft text-xs leading-relaxed">{item.description}</p>
                    </li>
                ))}
            </ul>

            <Callout tone="warning" title="Um grafo por navegador">
                O estúdio guarda apenas o grafo em edição, e só no navegador e dispositivo em que
                ele foi criado. Limpar os dados do site, usar uma janela anônima ou carregar um
                modelo pronto substitui o grafo salvo.
            </Callout>
        </DocSection>
    );
}
