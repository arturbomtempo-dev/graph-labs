import type { AlgorithmTexts } from '@/i18n/dictionaries';
import { plural } from '@/i18n/format';

export const kahn: AlgorithmTexts['kahn'] = {
    name: 'Método de Kahn',
    shortName: 'Kahn',
    tagline:
        'Determina a cada instante um vértice com grau de entrada zero, insere-o no fim do resultado e reduz o grau de entrada de seus sucessores.',
    complexity: 'O(n + m)',
    constraints: [
        'Exige grafo direcionado',
        'Só existe ordenação topológica em grafo acíclico',
        'Detecta a existência de ciclo',
    ],
    reference: {
        idea: 'Determina a cada instante um vértice sem arestas de entrada, isto é, com d⁻(v) = 0, e o insere no fim do resultado. Em vez de remover as arestas, mantém e atualiza um mapa M com o grau de entrada de cada vértice.',
        pseudocode: [
            'Método de Kahn',
            '  1. para todo vértice v faça M[v] ← d⁻(v)',
            '  2. Fila ← ∅; Ordena_Top ← ∅',
            '  3. para todo vértice v tal que d⁻(v) = 0 faça',
            '       Fila.Insere(v)',
            '  4. enquanto not Fila.Vazia() efetuar',
            '     a. v ← Fila.Remove()',
            '     b. Ordena_Top.InsereNoFim(v)',
            '     c. para todo vértice w ∈ Γ⁺(v) faça',
            '        i.  M[w] ← M[w] − 1',
            '        ii. se M[w] = 0 então Fila.Insere(w)',
            '  5. Se todos os vértices forem processados, SUCESSO;',
            '     caso contrário, existe um CICLO',
        ],
        invariant:
            'Um vértice só entra na fila quando todos os seus predecessores já estão em Ordena_Top, portanto ord(v) < ord(w) para toda aresta (v, w) ∈ E(G).',
        pitfalls: [
            'Aplicar a grafo não direcionado ou com ciclo: não há como estabelecer relação de precedência, e a ordenação topológica não existe.',
            'Interpretar a fila vazia com vértices pendentes como erro: é exatamente assim que o método detecta a existência de ciclo.',
            'Supor que a ordenação é única: cada grafo acíclico direcionado pode ter várias ordenações topológicas válidas.',
        ],
    },
    trace: {
        degreesTitle: 'Mapa de graus de entrada M',
        positionStatus: (position) => `posição ${position}`,
        queuedStatus: 'na fila',
        waitingStatus: 'aguardando',
        initDescription:
            'M[v] recebe o grau de entrada d⁻(v) de cada vértice. A fila e o resultado Ordena_Top começam vazios.',
        sourcesTitle: 'Vértices sem arestas de entrada',
        sourcesDescription: (vertices) =>
            `Os vértices com d⁻(v) = 0 entram na fila: ${vertices}. Eles não dependem de nenhum outro.`,
        noSourcesDescription:
            'Nenhum vértice tem d⁻(v) = 0. Como todo grafo acíclico direcionado possui pelo menos um vértice sem arestas de entrada, o grafo contém um ciclo.',
        insertTitle: (vertex, position) => `${vertex} entra em Ordena_Top na posição ${position}`,
        insertDescription: (vertex, position) =>
            `${vertex} sai da fila e é inserido no fim do resultado. Sua numeração topológica é ${position}, pois todos os vértices que o precedem já foram processados.`,
        zeroTitle: (vertex) => `M[${vertex}] chega a 0, entra na fila`,
        zeroDescription: (from, to, before) =>
            `Removida a aresta (${from}, ${to}), o grau de entrada de ${to} cai de ${before} para 0: todas as suas dependências já estão no resultado, então ele entra na fila.`,
        decreasedDescription: (from, to, before) =>
            `Removida a aresta (${from}, ${to}), o grau de entrada de ${to} cai de ${before} para ${before - 1}. Ele ainda depende de ${before - 1} ${plural(before - 1, 'vértice', 'vértices')} e permanece fora da fila.`,
        cycleTitle: 'Ciclo detectado',
        cycleDescription: (count, vertices) =>
            `A fila esvaziou com ${count} ${plural(count, 'vértice ainda não processado', 'vértices ainda não processados')}: ${vertices}. Todos continuam com M[v] > 0, o que só é possível se houver um ciclo entre eles.`,
        pendingConclusion: (vertices) =>
            `Nem todos os vértices foram processados: o grafo possui um ciclo envolvendo ${vertices}.`,
        completeDescription: (count, order) =>
            `Todos os ${count} vértices foram processados: ${order}.`,
        numberingConclusion:
            'A numeração topológica ord(v) corresponde à ordem de inserção no resultado, e satisfaz ord(v) < ord(w) para toda aresta (v, w) ∈ E(G).',
        acyclicConclusion:
            'Todos os vértices foram processados, portanto o grafo é acíclico. Note que a ordenação topológica pode não ser única.',
    },
};
