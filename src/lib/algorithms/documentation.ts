export interface AlgorithmDocumentation {
    id: string;
    idea: string;
    pseudocode: string[];
    invariant: string;
    pitfalls: string[];
}

export const documentation: AlgorithmDocumentation[] = [
    {
        id: 'bfs',
        idea: 'Explora o grafo em camadas: primeiro todos os vértices a uma aresta da origem, depois os que estão a duas, e assim por diante. A fila garante essa ordem.',
        pseudocode: [
            'BFS(G, s)',
            '  para cada v em V[G]: cor[v] ← branco; d[v] ← ∞; π[v] ← nil',
            '  cor[s] ← cinza; d[s] ← 0',
            '  Q ← {s}',
            '  enquanto Q ≠ ∅:',
            '    u ← desenfileira(Q)',
            '    para cada v em Adj[u]:',
            '      se cor[v] = branco:',
            '        cor[v] ← cinza; d[v] ← d[u] + 1; π[v] ← u',
            '        enfileira(Q, v)',
            '    cor[u] ← preto',
        ],
        invariant:
            'Quando um vértice sai da fila, d[v] já é a menor quantidade de arestas entre a origem e v.',
        pitfalls: [
            'Marcar o vértice como descoberto no momento em que ele entra na fila, e não quando sai.',
            'Em grafos ponderados, BFS só devolve caminho mínimo se todos os pesos forem iguais.',
        ],
    },
    {
        id: 'dfs',
        idea: 'Aprofunda por um caminho até não haver mais vizinhos brancos e só então retrocede. Os tempos de descoberta e término classificam as arestas.',
        pseudocode: [
            'DFS(G)',
            '  para cada u em V[G]: cor[u] ← branco; π[u] ← nil',
            '  tempo ← 0',
            '  para cada u em V[G]: se cor[u] = branco: DFS-VISITA(u)',
            '',
            'DFS-VISITA(u)',
            '  tempo ← tempo + 1; d[u] ← tempo; cor[u] ← cinza',
            '  para cada v em Adj[u]:',
            '    se cor[v] = branco: π[v] ← u; DFS-VISITA(v)',
            '  cor[u] ← preto; tempo ← tempo + 1; f[u] ← tempo',
        ],
        invariant:
            'Os intervalos [d[u], f[u]] são aninhados ou disjuntos — nunca se cruzam parcialmente.',
        pitfalls: [
            'Em grafo não direcionado, a aresta usada para chegar ao vértice não deve ser classificada como aresta de retorno.',
            'Aresta de retorno em grafo direcionado é a única evidência necessária de ciclo.',
        ],
    },
    {
        id: 'kosaraju',
        idea: 'A primeira busca ordena os vértices por tempo de término. A segunda busca, no grafo transposto e nessa ordem invertida, isola cada componente fortemente conexa.',
        pseudocode: [
            'KOSARAJU(G)',
            '  execute DFS(G) e empilhe cada u quando f[u] é definido',
            '  calcule G^T invertendo todas as arestas',
            '  enquanto a pilha não estiver vazia:',
            '    u ← desempilha()',
            '    se u não foi visitado em G^T:',
            '      a árvore de DFS(G^T, u) é uma componente fortemente conexa',
        ],
        invariant:
            'A ordem decrescente de término garante que a busca no grafo transposto nunca escapa da componente atual.',
        pitfalls: [
            'Esquecer de transpor o grafo antes da segunda busca.',
            'Percorrer a segunda busca na ordem crescente de término em vez da decrescente.',
        ],
    },
    {
        id: 'prim',
        idea: 'Mantém uma única árvore e, a cada passo, adiciona a aresta de menor peso que sai dela — uma aresta leve que cruza o corte.',
        pseudocode: [
            'PRIM(G, w, r)',
            '  para cada u em V[G]: chave[u] ← ∞; π[u] ← nil',
            '  chave[r] ← 0; Q ← V[G]',
            '  enquanto Q ≠ ∅:',
            '    u ← extrai-mínimo(Q)',
            '    para cada v em Adj[u]:',
            '      se v ∈ Q e w(u, v) < chave[v]:',
            '        π[v] ← u; chave[v] ← w(u, v)',
        ],
        invariant:
            'O conjunto de arestas {(v, π[v]) : v ∉ Q, v ≠ r} é sempre subconjunto de alguma árvore geradora mínima.',
        pitfalls: [
            'Comparar w(u, v) com a distância acumulada em vez da chave — isso transformaria Prim em Dijkstra.',
            'Aplicar Prim em grafo direcionado: o problema correto passa a ser arborescência mínima.',
        ],
    },
    {
        id: 'kruskal',
        idea: 'Ordena todas as arestas por peso e aceita cada uma que não feche ciclo, unindo florestas até restar uma única árvore.',
        pseudocode: [
            'KRUSKAL(G, w)',
            '  A ← ∅',
            '  para cada v em V[G]: MAKE-SET(v)',
            '  ordene as arestas de E por peso crescente',
            '  para cada (u, v) em E nessa ordem:',
            '    se FIND-SET(u) ≠ FIND-SET(v):',
            '      A ← A ∪ {(u, v)}; UNION(u, v)',
            '  retorne A',
        ],
        invariant: 'A é sempre uma floresta contida em alguma árvore geradora mínima do grafo.',
        pitfalls: [
            'Detectar ciclo percorrendo o grafo em vez de usar conjuntos disjuntos.',
            'Em grafo desconexo o resultado é uma floresta geradora mínima, não uma árvore.',
        ],
    },
    {
        id: 'dijkstra',
        idea: 'Fecha repetidamente o vértice aberto de menor distância e relaxa suas arestas. Sem pesos negativos, a distância fechada nunca mais melhora.',
        pseudocode: [
            'DIJKSTRA(G, w, s)',
            '  para cada v em V[G]: d[v] ← ∞; π[v] ← nil',
            '  d[s] ← 0; S ← ∅; Q ← V[G]',
            '  enquanto Q ≠ ∅:',
            '    u ← extrai-mínimo(Q); S ← S ∪ {u}',
            '    para cada v em Adj[u]:',
            '      se d[u] + w(u, v) < d[v]:',
            '        d[v] ← d[u] + w(u, v); π[v] ← u',
        ],
        invariant: 'Para todo u em S, d[u] já é a distância mínima definitiva da origem até u.',
        pitfalls: [
            'Usar Dijkstra com aresta de peso negativo: a distância fechada pode ficar incorreta.',
            'Reinserir na fila um vértice já fechado.',
        ],
    },
    {
        id: 'bellman-ford',
        idea: 'Relaxa todas as arestas V−1 vezes. Como todo caminho mínimo tem no máximo V−1 arestas, isso basta — e uma passagem extra revela ciclos negativos.',
        pseudocode: [
            'BELLMAN-FORD(G, w, s)',
            '  para cada v em V[G]: d[v] ← ∞; π[v] ← nil',
            '  d[s] ← 0',
            '  repita V−1 vezes:',
            '    para cada (u, v) em E:',
            '      se d[u] + w(u, v) < d[v]: d[v] ← d[u] + w(u, v); π[v] ← u',
            '  para cada (u, v) em E:',
            '    se d[u] + w(u, v) < d[v]: retorne falso',
            '  retorne verdadeiro',
        ],
        invariant:
            'Após i iterações, d[v] é no máximo o peso do menor caminho de s a v que usa até i arestas.',
        pitfalls: [
            'Parar antes de completar V−1 iterações sem verificar que nada mudou.',
            'Aresta não direcionada com peso negativo já é, por si só, um ciclo negativo.',
        ],
    },
    {
        id: 'floyd-warshall',
        idea: 'Programação dinâmica sobre o conjunto de vértices intermediários permitidos: a cada rodada k, testa-se se passar por k encurta algum par (i, j).',
        pseudocode: [
            'FLOYD-WARSHALL(W)',
            '  D⁰ ← W',
            '  para k ← 1 até n:',
            '    para i ← 1 até n:',
            '      para j ← 1 até n:',
            '        Dᵏ[i][j] ← min(Dᵏ⁻¹[i][j], Dᵏ⁻¹[i][k] + Dᵏ⁻¹[k][j])',
            '  retorne Dⁿ',
        ],
        invariant:
            'Dᵏ[i][j] é o menor caminho de i a j usando apenas {1, …, k} como vértices intermediários.',
        pitfalls: [
            'Trocar a ordem dos laços: k precisa ser o laço mais externo.',
            'Entrada negativa na diagonal indica ciclo de peso negativo.',
        ],
    },
    {
        id: 'ford-fulkerson',
        idea: 'Enquanto existir caminho da fonte ao sumidouro na rede residual, envia-se por ele o máximo possível — o gargalo — e atualiza-se a rede residual.',
        pseudocode: [
            'FORD-FULKERSON(G, s, t)',
            '  para cada (u, v) em E: f(u, v) ← 0',
            '  enquanto existir caminho p de s a t em Gf:',
            '    cf(p) ← min{ cf(u, v) : (u, v) ∈ p }',
            '    para cada (u, v) em p:',
            '      f(u, v) ← f(u, v) + cf(p)',
            '      f(v, u) ← f(v, u) − cf(p)',
            '  retorne f',
        ],
        invariant:
            'O valor do fluxo nunca excede a capacidade de nenhum corte; ao final ambos coincidem.',
        pitfalls: [
            'Esquecer de criar o arco reverso na rede residual, o que impede desfazer envios.',
            'Escolher caminhos aumentantes arbitrários com capacidades irracionais pode não terminar; usar busca em largura resolve.',
        ],
    },
];

export const documentationById = new Map(documentation.map((entry) => [entry.id, entry]));
