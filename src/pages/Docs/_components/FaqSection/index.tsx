import { ChevronDown } from 'lucide-react';
import { DocSection } from '../DocSection';

const questions = [
    {
        question: 'Por que o botão Executar está desabilitado?',
        answer: 'O grafo ou os parâmetros não atendem aos requisitos do algoritmo escolhido. Os problemas aparecem listados em vermelho logo acima do botão, cada um com a correção sugerida, como converter as arestas para direcionadas ou escolher uma fonte diferente do sumidouro.',
    },
    {
        question: 'O resultado ficou diferente do que fiz no papel. O que pode ser?',
        answer: 'Na maioria das vezes é a ordem de visita. Quando há empate, o estúdio examina os vizinhos em ordem alfabética dos rótulos. Se o exercício usa outra convenção, monte a mesma ordem em Sequência de visita, na aba Executar. Confira também a raiz escolhida e se todas as arestas têm o tipo e o peso corretos.',
    },
    {
        question: 'O que acontece com arestas sem peso?',
        answer: 'Elas contam como peso 1 nos algoritmos que usam pesos ou capacidades. Nas buscas, em Kosaraju, Fleury, no emparelhamento e na coloração os pesos são ignorados.',
    },
    {
        question: 'Posso usar pesos negativos?',
        answer: 'Sim. Bellman-Ford e Floyd-Warshall aceitam arestas de peso negativo e indicam quando existe um ciclo de peso negativo. Dijkstra exige pesos não negativos, e os algoritmos de fluxo exigem capacidades positivas; nesses casos a validação avisa antes da execução.',
    },
    {
        question: 'O grafo pode ter laços ou arestas múltiplas?',
        answer: 'Não. Laços (arestas de um vértice para ele mesmo) não são suportados, e não é possível repetir uma aresta entre o mesmo par de vértices. A exceção são duas arestas direcionadas em sentidos opostos, como A → B e B → A, que são permitidas e desenhadas curvas.',
    },
    {
        question: 'Mudei o grafo e a execução sumiu. É um erro?',
        answer: 'Não. O traço sempre corresponde ao grafo em que foi gerado. Qualquer mudança estrutural, como vértices, arestas, rótulos, pesos ou direções, ou a troca de algoritmo descarta a execução para evitar mostrar passos que não valem mais. Basta executar de novo. Apenas arrastar vértices não descarta nada.',
    },
    {
        question: 'Perdi o grafo que estava montando. Dá para recuperar?',
        answer: 'Se a página ainda estiver aberta, use Desfazer (Ctrl + Z): o histórico guarda as últimas 60 alterações, inclusive Limpar grafo e carregar um modelo. Depois de recarregar a página o histórico é perdido, mas o último estado do grafo continua salvo no navegador.',
    },
    {
        question: 'Funciona no celular?',
        answer: 'Sim. O canvas aceita toque para criar e mover vértices, arrastar com um dedo para mover a visão e pinça com dois dedos para o zoom. O painel lateral aparece abaixo do canvas, com as abas fixas no topo.',
    },
];

export function FaqSection() {
    return (
        <DocSection
            id="perguntas-frequentes"
            index={11}
            title="Perguntas frequentes"
            description="Respostas rápidas para as dúvidas mais comuns no uso do estúdio."
        >
            <div className="border-line bg-surface rounded-card divide-y divide-[var(--color-line)] border">
                {questions.map((item) => (
                    <details key={item.question} className="group">
                        <summary className="text-ink hover:text-brand flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-3.5 text-[13px] font-semibold transition-colors [&::-webkit-details-marker]:hidden">
                            {item.question}
                            <ChevronDown
                                size={16}
                                className="text-ink-faint shrink-0 transition-transform duration-200 group-open:rotate-180"
                            />
                        </summary>
                        <p className="text-ink-soft px-4 pb-4 text-[13px] leading-relaxed">
                            {item.answer}
                        </p>
                    </details>
                ))}
            </div>
        </DocSection>
    );
}
