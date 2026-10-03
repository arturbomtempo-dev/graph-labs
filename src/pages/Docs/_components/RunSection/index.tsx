import { AlertTriangle, Check } from 'lucide-react';
import { Badge } from '@/components/Badge';
import { Callout } from '../Callout';
import { DocSection, DocSubsection } from '../DocSection';

const parameterRules = [
    {
        field: 'Raiz / origem',
        when: 'Buscas em largura e profundidade, Prim, Dijkstra e Bellman-Ford',
        required: true,
        effect: 'Vértice de onde a execução parte.',
    },
    {
        field: 'Vértice de destino',
        when: 'Dijkstra, Bellman-Ford e Floyd-Warshall',
        required: false,
        effect: 'Destaca em roxo, no último passo, o caminho mínimo até ele.',
    },
    {
        field: 'Raiz / origem (opcional)',
        when: 'Floyd-Warshall',
        required: false,
        effect: 'Junto com o destino, escolhe qual par de vértices terá o caminho destacado.',
    },
    {
        field: 'Fonte s e sumidouro t',
        when: 'Ford-Fulkerson, Edmonds-Karp e Dinic',
        required: true,
        effect: 'Extremos da rede de fluxo. Precisam ser vértices diferentes.',
    },
    {
        field: 'Vértice inicial',
        when: 'Fleury',
        required: false,
        effect: 'Se houver vértices de grau ímpar, o trajeto precisa partir de um deles.',
    },
];

const sampleIssues = [
    'Kruskal opera sobre grafos não direcionados: converta todas as arestas para não direcionadas.',
    'A fonte s e o sumidouro t precisam ser vértices diferentes.',
];

export function RunSection() {
    return (
        <DocSection
            id="aba-executar"
            index={6}
            title="Aba Executar"
            description="Aqui você escolhe o algoritmo, informa os parâmetros que ele pede e confere se o grafo atende aos requisitos antes de rodar a simulação."
        >
            <DocSubsection title="Escolha do algoritmo">
                <p>
                    O card Algoritmo agrupa os métodos por tópico, na ordem da disciplina. Cada
                    opção mostra o nome, a complexidade e um resumo da estratégia. O algoritmo
                    selecionado fica destacado e define o conteúdo do card Parâmetros logo abaixo.
                </p>
            </DocSubsection>

            <DocSubsection title="Parâmetros">
                <p>
                    O cabeçalho do card repete o nome e a complexidade do método, seguidos pelos
                    requisitos do grafo em forma de selos. Os campos de vértice só aparecem quando o
                    algoritmo os utiliza:
                </p>
                <div className="border-line bg-surface rounded-card overflow-x-auto border">
                    <table className="w-full min-w-[560px] border-collapse text-left">
                        <thead>
                            <tr className="border-line border-b">
                                {['Campo', 'Algoritmos', 'Uso', 'Efeito'].map((column) => (
                                    <th
                                        key={column}
                                        className="text-ink-faint px-4 py-2.5 text-[10px] font-semibold tracking-wider uppercase"
                                    >
                                        {column}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {parameterRules.map((rule) => (
                                <tr
                                    key={rule.field + rule.when}
                                    className="border-line/60 border-b align-top last:border-0"
                                >
                                    <td className="text-ink px-4 py-3 text-xs font-semibold whitespace-nowrap">
                                        {rule.field}
                                    </td>
                                    <td className="text-ink-soft px-4 py-3 text-xs leading-relaxed">
                                        {rule.when}
                                    </td>
                                    <td className="px-4 py-3">
                                        <Badge tone={rule.required ? 'brand' : 'neutral'}>
                                            {rule.required ? 'obrigatório' : 'opcional'}
                                        </Badge>
                                    </td>
                                    <td className="text-ink-soft px-4 py-3 text-xs leading-relaxed">
                                        {rule.effect}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <p>
                    Quando um campo obrigatório ainda não foi escolhido, o estúdio usa o primeiro
                    vértice em ordem alfabética (e, para o sumidouro, o primeiro diferente da
                    fonte). Os vértices escolhidos ganham um anel tracejado no canvas com a etiqueta
                    RAIZ, DESTINO, FONTE ou SUMIDOURO.
                </p>
            </DocSubsection>

            <DocSubsection title="Sequência de visita">
                <p>
                    Muitos algoritmos precisam decidir qual vizinho examinar primeiro. Por padrão a
                    decisão segue a ordem alfabética dos rótulos, que é a convenção usada em sala.
                    Quando o exercício pede outra ordem, monte-a em{' '}
                    <strong className="text-ink font-medium">Sequência de visita</strong>:
                </p>
                <ul className="flex list-disc flex-col gap-1.5 pl-5">
                    <li>clique nos vértices na ordem desejada para acrescentá-los à sequência;</li>
                    <li>
                        o primeiro vértice escolhido vira a raiz quando nenhuma for definida acima
                        (nos algoritmos de fluxo, ele é o primeiro vizinho tentado na busca);
                    </li>
                    <li>clique em um vértice da sequência para retirá-lo;</li>
                    <li>
                        os vértices que ficarem de fora seguem em ordem alfabética, depois dos
                        escolhidos;
                    </li>
                    <li>
                        o botão <strong className="text-ink font-medium">Padrão</strong> volta à
                        ordem alfabética.
                    </li>
                </ul>
            </DocSubsection>

            <DocSubsection title="Validação antes de executar">
                <p>
                    Os requisitos são verificados a cada alteração do grafo ou dos parâmetros. Se
                    estiver tudo certo, aparece uma confirmação em verde; caso contrário, cada
                    problema é listado em vermelho com a correção sugerida, e o botão Executar fica
                    desabilitado.
                </p>
                <div className="grid gap-2.5 sm:grid-cols-2">
                    <div className="border-line bg-surface flex flex-col justify-center rounded-lg border p-3">
                        <p className="text-state-done flex items-center gap-1.5 text-[11px]">
                            <Check size={13} />O grafo atende aos requisitos deste algoritmo.
                        </p>
                    </div>
                    <div className="border-state-reject/25 bg-state-reject/8 flex flex-col gap-1.5 rounded-lg border p-2.5">
                        {sampleIssues.map((issue) => (
                            <p
                                key={issue}
                                className="text-state-reject flex items-start gap-1.5 text-[11px] leading-relaxed"
                            >
                                <AlertTriangle size={13} className="mt-px shrink-0" />
                                {issue}
                            </p>
                        ))}
                    </div>
                </div>
            </DocSubsection>

            <Callout tone="tip">
                Ao clicar em Executar, o estúdio calcula a execução inteira de uma vez, abre a aba
                Passos no primeiro passo e volta a ferramenta do canvas para Selecionar e mover,
                para que nenhum clique acidental altere o grafo durante a análise.
            </Callout>
        </DocSection>
    );
}
