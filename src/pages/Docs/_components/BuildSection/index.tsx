import { Badge } from '@/components/Badge';
import { findAlgorithm } from '@/lib/algorithms';
import { presets } from '@/lib/graph/presets';
import { Callout } from '../Callout';
import { DocSection, DocSubsection } from '../DocSection';

const edgeRules = [
    {
        title: 'Peso opcional',
        description:
            'Campo vazio cria uma aresta sem peso, que conta como 1 nos algoritmos ponderados. Aceita negativos e decimais com vírgula ou ponto.',
    },
    {
        title: 'Sem laços',
        description: 'Uma aresta precisa ligar dois vértices diferentes.',
    },
    {
        title: 'Sem arestas repetidas',
        description:
            'Não é possível criar duas arestas iguais. Uma aresta simples A - B já conecta B a A, mas duas direcionadas opostas, A → B e B → A, são permitidas.',
    },
];

export function BuildSection() {
    return (
        <DocSection
            id="aba-construir"
            index={5}
            title="Aba Construir"
            description="Tudo o que diz respeito à estrutura do grafo: modelos prontos, lista de vértices e lista de arestas. Qualquer alteração feita aqui aparece no canvas na hora, e vice-versa."
        >
            <DocSubsection title="Modelos prontos">
                <p>
                    Os modelos reproduzem exemplos usados em aula, cada um pensado para destacar o
                    comportamento de determinados algoritmos. Carregar um modelo substitui o grafo
                    atual (é possível desfazer), limpa a raiz e o destino escolhidos e enquadra o
                    desenho.
                </p>
                <ul className="grid gap-2.5 sm:grid-cols-2">
                    {presets.map((preset) => (
                        <li
                            key={preset.id}
                            className="border-line bg-surface flex flex-col gap-2 rounded-lg border p-3.5"
                        >
                            <p className="text-ink text-[13px] font-semibold">{preset.name}</p>
                            <p className="text-ink-soft text-xs leading-relaxed">
                                {preset.description}
                            </p>
                            <div className="mt-auto flex flex-wrap gap-1 pt-1">
                                {preset.suggestedAlgorithms.map((id) => (
                                    <Badge key={id} tone="brand">
                                        {findAlgorithm(id)?.shortName ?? id}
                                    </Badge>
                                ))}
                            </div>
                        </li>
                    ))}
                </ul>
            </DocSubsection>

            <DocSubsection title="Vértices">
                <p>
                    O card Vértices lista todos os vértices em ordem alfabética, com a contagem
                    total no cabeçalho. O botão{' '}
                    <strong className="text-ink font-medium">Novo</strong> cria um vértice no canvas
                    sem precisar trocar de ferramenta; depois é só arrastá-lo para o lugar desejado.
                </p>
                <ul className="flex list-disc flex-col gap-1.5 pl-5">
                    <li>
                        <strong className="text-ink font-medium">Renomear:</strong> edite o rótulo
                        direto no campo de texto, com até 6 caracteres. A ordem alfabética dos
                        rótulos é a ordem padrão de visita de todos os algoritmos.
                    </li>
                    <li>
                        <strong className="text-ink font-medium">Selecionar:</strong> clique no
                        círculo com as iniciais ou no campo de texto para destacar o vértice no
                        canvas.
                    </li>
                    <li>
                        <strong className="text-ink font-medium">Remover:</strong> o ícone de
                        lixeira apaga o vértice e todas as arestas incidentes a ele.
                    </li>
                </ul>
            </DocSubsection>

            <DocSubsection title="Arestas">
                <p>
                    O formulário no topo do card cria arestas com precisão, o que é útil para grafos
                    grandes ou para copiar um exercício: escolha os vértices{' '}
                    <strong className="text-ink font-medium">De</strong> e{' '}
                    <strong className="text-ink font-medium">Para</strong>, informe o{' '}
                    <strong className="text-ink font-medium">Peso</strong> e o{' '}
                    <strong className="text-ink font-medium">Tipo</strong> (simples ou direcionada)
                    e clique em Adicionar aresta. O cabeçalho mostra o total de arestas e quantas
                    são de cada tipo.
                </p>
                <div className="grid gap-2.5 sm:grid-cols-3">
                    {edgeRules.map((rule) => (
                        <div
                            key={rule.title}
                            className="border-line bg-surface rounded-lg border p-3"
                        >
                            <p className="text-ink text-xs font-semibold">{rule.title}</p>
                            <p className="text-ink-soft mt-1 text-xs leading-relaxed">
                                {rule.description}
                            </p>
                        </div>
                    ))}
                </div>
                <p>Cada aresta da lista pode ser editada sem ser recriada:</p>
                <ul className="flex list-disc flex-col gap-1.5 pl-5">
                    <li>o campo numérico altera o peso, e apagá-lo deixa a aresta sem peso;</li>
                    <li>
                        o selo <Badge>simples</Badge> / <Badge tone="brand">direcionada</Badge>{' '}
                        alterna a direção com um clique;
                    </li>
                    <li>clicar nos rótulos seleciona a aresta no canvas;</li>
                    <li>a lixeira remove a aresta.</li>
                </ul>
            </DocSubsection>

            <Callout tone="warning" title="Grafos mistos">
                Cada aresta guarda a própria orientação, então um grafo pode misturar arestas
                simples e direcionadas. Quando isso acontece, um aviso aparece no card de arestas
                com dois atalhos,{' '}
                <strong className="text-ink font-medium">Todas direcionadas</strong> e{' '}
                <strong className="text-ink font-medium">Todas simples</strong>, porque a maioria
                dos algoritmos exige um único tipo.
            </Callout>
        </DocSection>
    );
}
