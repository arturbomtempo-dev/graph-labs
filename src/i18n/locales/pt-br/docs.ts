import type { Dictionary } from '@/i18n/dictionaries';
import { algorithms } from './algorithms';
import { presets } from './catalog';

export const docs: Dictionary['docs'] = {
    hero: {
        eyebrow: 'Documentação',
        title: 'Como o Graph Labs funciona',
        description:
            'Um guia completo do estúdio: como montar o grafo, configurar e executar cada algoritmo, ler o traço passo a passo e aproveitar os recursos que tornam a conferência de exercícios mais rápida.',
        openStudio: 'Abrir o estúdio',
        viewPseudocode: 'Ver pseudocódigos',
    },
    toc: {
        label: 'Nesta página',
        ariaLabel: 'Seções da documentação',
    },
    callouts: {
        info: 'Nota',
        tip: 'Dica',
        warning: 'Atenção',
    },
    sections: {
        overview: 'Visão geral',
        quickStart: 'Primeiros passos',
        anatomy: 'Anatomia do estúdio',
        canvas: 'Canvas e ferramentas',
        build: 'Aba Construir',
        run: 'Aba Executar',
        steps: 'Aba Passos',
        catalog: 'Catálogo de algoritmos',
        shortcuts: 'Atalhos de teclado',
        storage: 'Dados e preferências',
        faq: 'Perguntas frequentes',
    },
    overview: {
        description:
            'O Graph Labs é um laboratório visual de teoria dos grafos. Você desenha o grafo, escolhe um dos métodos clássicos e acompanha a execução iteração por iteração, com as mesmas tabelas, filas e notação usadas em sala.',
        numbers: {
            algorithms: 'algoritmos implementados',
            topics: 'tópicos da disciplina',
            presets: 'grafos de exemplo',
        },
        problemTitle: 'O problema que ele resolve',
        problemParagraphs: [
            'O pseudocódigo no papel esconde justamente a parte que mais importa para aprender: o que acontece em cada iteração. Ler que o método de Dijkstra “seleciona o vértice não fechado de menor rótulo” é bem diferente de ver esse vértice ser escolhido, a tabela de distâncias ser atualizada e a aresta entrar na solução.',
            'No Graph Labs, você remonta o grafo de um exercício da lista, executa o método sobre ele e compara cada passo com o que resolveu à mão. É útil em aulas e monitorias, na correção de exercícios e no estudo individual antes da prova.',
        ],
        principles: [
            {
                title: 'Fiel à disciplina',
                description:
                    'Nomes, notação, tabelas e ordem de visita seguem o que é ensinado e cobrado em sala, e não a versão genérica de uma biblioteca.',
            },
            {
                title: 'Cada decisão justificada',
                description:
                    'Todo passo traz um título, a explicação do que aconteceu e o estado das estruturas auxiliares naquele instante.',
            },
            {
                title: '100% no navegador',
                description:
                    'Sem cadastro, sem servidor e sem banco de dados. Funciona no computador, no tablet e no celular.',
            },
        ],
        pagesTitle: 'Páginas da aplicação',
        pages: {
            studio: 'O coração do projeto: editor de grafos, seleção do algoritmo e reprodução da execução passo a passo.',
            algorithms:
                'Referência teórica de cada método: ideia central, invariante, requisitos, erros comuns e pseudocódigo.',
            about: 'Origem do projeto na monitoria de Teoria dos Grafos e informações do autor.',
        },
    },
    quickStart: {
        description:
            'Todo uso do estúdio segue o mesmo ciclo de quatro etapas, refletido nas três abas do painel lateral: Construir, Executar e Passos.',
        steps: [
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
        ],
        exampleTitle: 'Exemplo guiado: caminho mínimo com Dijkstra',
        exampleIntro: 'Um roteiro de dois minutos para conhecer o estúdio usando um grafo pronto:',
        exampleSteps: [
            `Na aba **Construir**, clique em **${presets['weighted-undirected'].name}**. O grafo é carregado e enquadrado automaticamente.`,
            `Vá para **Executar** e escolha **${algorithms.dijkstra.name}**, em Caminho mínimo.`,
            'Em Raiz / origem, selecione `A`; em Vértice de destino, selecione `F`.',
            `Clique em **Executar ${algorithms.dijkstra.shortName}** e use **Próximo passo** para ver cada vértice ser fechado e cada aresta tensa ser relaxada na tabela *dist e pred*.`,
            'No último passo, o caminho mínimo `A → C → F`, de peso 11, aparece em roxo, e o card de Conclusões resume as distâncias finais.',
        ],
        tryIt: 'Testar no estúdio',
        tip: `Na primeira visita o estúdio já abre com a ${presets['weighted-undirected'].name} carregada. Depois disso, ele sempre reabre com o último grafo em que você trabalhou.`,
    },
    anatomy: {
        description:
            'O estúdio divide a tela em duas áreas: o canvas, onde o grafo é desenhado e animado, e o painel lateral, onde ficam os formulários, o catálogo de algoritmos e o traço da execução.',
        mockHint: 'Arraste os vértices para reposicionar...',
        mockTabs: ['Construir', 'Executar', 'Passos'],
        regions: [
            {
                title: 'Ferramentas de edição',
                description:
                    'Selecionar e mover, adicionar vértice, conectar vértices e remover elemento.',
            },
            { title: 'Histórico', description: 'Desfazer, refazer e limpar o grafo inteiro.' },
            {
                title: 'Direção das novas arestas',
                description:
                    'Define se as arestas criadas pelo canvas nascem simples ou direcionadas.',
            },
            {
                title: 'Posicionamento',
                description:
                    'Liga ou desliga a sugestão automática e reorganiza o desenho sob demanda.',
            },
            {
                title: 'Dica contextual',
                description:
                    'Explica como usar a ferramenta ativa. Aparece em telas a partir de 640 px.',
            },
            {
                title: 'Canvas',
                description:
                    'Área de desenho com grade pontilhada, arrasto, zoom e destaques da execução.',
            },
            {
                title: 'Legenda',
                description:
                    'Significado de cada cor aplicada a vértices e arestas durante a simulação.',
            },
            {
                title: 'Zoom',
                description: 'Aproximar, afastar e enquadrar o grafo inteiro na tela.',
            },
            {
                title: 'Abas do painel',
                description: 'Alterna entre Construir, Executar e Passos, as três etapas do fluxo.',
            },
            {
                title: 'Conteúdo da aba',
                description:
                    'Formulários do grafo, catálogo de algoritmos ou o traço passo a passo.',
            },
        ],
        responsiveTitle: 'Layout responsivo',
        responsiveText:
            'Em telas largas (a partir de 1024 px), o canvas ocupa toda a altura à esquerda e o painel fica fixo à direita, com rolagem própria. Em tablets e celulares, o canvas aparece em cima, com cerca de metade da altura da tela, e o painel logo abaixo, com as abas fixas no topo enquanto você rola.',
    },
    canvas: {
        description:
            'O canvas é a área de desenho do estúdio. É nele que você cria e organiza o grafo e, durante a simulação, acompanha visualmente o estado de cada vértice e aresta.',
        editingTitle: 'Ferramentas de edição',
        editingIntro:
            'Apenas uma ferramenta fica ativa por vez, destacada na barra superior. O cursor muda de formato para indicar qual está em uso, e uma dica ao lado da barra explica o que fazer.',
        editingTools: {
            select: {
                name: 'Selecionar e mover',
                description:
                    'Ferramenta padrão. Clique em um vértice ou aresta para selecioná-lo, arraste vértices para reposicioná-los e arraste o fundo para mover a visão.',
            },
            node: {
                name: 'Adicionar vértice',
                description:
                    'Cada clique em um ponto vazio cria um vértice ali. Os rótulos seguem a sequência A, B, C, ..., Z, A1, B1, ..., sempre pulando os já usados.',
            },
            edge: {
                name: 'Conectar vértices',
                description:
                    'Clique no vértice de origem e depois no de destino. Entre os dois cliques, uma linha tracejada acompanha o cursor. Esc cancela.',
            },
            erase: {
                name: 'Remover elemento',
                description:
                    'Clique em um vértice ou aresta para apagá-lo. Remover um vértice remove também todas as arestas ligadas a ele.',
            },
        },
        actionsTitle: 'Histórico, direção e posicionamento',
        actionTools: {
            undo: {
                name: 'Desfazer',
                description: 'Volta a última alteração do grafo. Guarda até 60 alterações.',
            },
            redo: { name: 'Refazer', description: 'Reaplica uma alteração desfeita.' },
            clear: {
                name: 'Limpar grafo',
                description: 'Apaga todos os vértices e arestas. Pode ser desfeito com Desfazer.',
            },
            undirected: {
                name: 'Novas arestas não direcionadas',
                description: 'As arestas criadas no canvas nascem simples (padrão).',
            },
            directed: {
                name: 'Novas arestas direcionadas',
                description:
                    'As arestas criadas no canvas nascem com seta, da origem para o destino.',
            },
            autoArrange: {
                name: 'Sugestão de posicionamento',
                description:
                    'Quando ligada, cada nova aresta dispara um ajuste fino do desenho. A preferência fica salva.',
            },
            arrangeNow: {
                name: 'Reorganizar agora',
                description: 'Aplica o ajuste de posicionamento imediatamente, uma única vez.',
            },
        },
        autoArrangeTitle: 'Como funciona a sugestão de posicionamento',
        autoArrangeText:
            'O ajuste move os vértices aos poucos, sem perder o desenho original de vista, para reduzir cruzamentos de arestas, vértices sobre arestas, sobreposições e ângulos muito fechados. Ele atua em grafos de 3 a 40 vértices e até 90 arestas, e não faz nada se o desenho já estiver limpo.',
        navigationTitle: 'Navegação e zoom',
        navigationText:
            'Arraste o fundo para mover a visão e use a roda do mouse (ou o gesto de pinça no trackpad e no celular) para aproximar e afastar, sempre centrado no ponto sob o cursor. O zoom vai de 30% a 260%. Os botões no canto inferior direito oferecem o mesmo controle:',
        viewTools: {
            zoomIn: { name: 'Aproximar', description: 'Aumenta o zoom em 25%, mantendo o centro.' },
            zoomOut: { name: 'Afastar', description: 'Reduz o zoom em 20%, mantendo o centro.' },
            fit: {
                name: 'Enquadrar grafo',
                description: 'Ajusta zoom e posição para que o grafo inteiro caiba na tela.',
            },
        },
        navigationNote:
            'Ao carregar um modelo pronto, o grafo é enquadrado automaticamente. Arestas paralelas entre o mesmo par de vértices, como A → B e B → A, são desenhadas curvas para não se sobreporem.',
        colorsTitle: 'Cores durante a execução',
        colorsIntro:
            'Depois que um algoritmo é executado, cada vértice e aresta recebe um estado a cada passo. A legenda no canto inferior esquerdo do canvas resume o significado das cores:',
        states: {
            idle: {
                label: 'Não explorado',
                description: 'Estado inicial: o algoritmo ainda não alcançou o elemento.',
            },
            frontier: {
                label: 'Marcado',
                description:
                    'Alcançado, mas ainda não processado: está na fila, na pilha ou na fronteira.',
            },
            active: {
                label: 'Em análise',
                description:
                    'Elemento examinado no passo atual. Vértices em análise pulsam para chamar a atenção.',
            },
            done: {
                label: 'Explorado / na solução',
                description:
                    'Processamento concluído ou elemento aceito na solução (árvore, ordem, emparelhamento).',
            },
            reject: {
                label: 'Descartado',
                description:
                    'Rejeitado pelo algoritmo, como uma aresta que formaria ciclo. Arestas descartadas ficam tracejadas.',
            },
            path: {
                label: 'Caminho',
                description:
                    'Resultado destacado no fim: caminho mínimo, caminho aumentante ou trajeto euleriano.',
            },
        },
        markersTitle: 'Marcações adicionais',
        markers: {
            start: {
                title: 'Anel tracejado na cor principal',
                description:
                    'Vértice de partida. A etiqueta acima dele indica RAIZ ou, nos algoritmos de fluxo, FONTE.',
            },
            end: {
                title: 'Anel tracejado roxo',
                description: 'Vértice de chegada: DESTINO, ou SUMIDOURO nos algoritmos de fluxo.',
            },
            nodeBadge: {
                title: 'Etiqueta sob o vértice',
                description:
                    'Valor do vértice no passo atual: TD/TT na busca em profundidade, nível na busca em largura, dist em Dijkstra, cor na coloração, s e t no fluxo.',
            },
            edgeLabel: {
                title: 'Rótulo da aresta',
                description:
                    'Mostra o peso. Durante a execução pode dar lugar a outro valor, como fluxo/capacidade nos algoritmos de fluxo ou a ordem de travessia em Fleury.',
            },
            group: {
                title: 'Contorno colorido',
                description:
                    'Agrupa vértices do mesmo conjunto: componentes f-conexos em Kosaraju, árvores da floresta em Kruskal, classes de cor na coloração.',
            },
        },
    },
    build: {
        description:
            'Tudo o que diz respeito à estrutura do grafo: modelos prontos, lista de vértices e lista de arestas. Qualquer alteração feita aqui aparece no canvas na hora, e vice-versa.',
        presetsTitle: 'Modelos prontos',
        presetsText:
            'Os modelos reproduzem exemplos usados em aula, cada um pensado para destacar o comportamento de determinados algoritmos. Carregar um modelo substitui o grafo atual (é possível desfazer), limpa a raiz e o destino escolhidos e enquadra o desenho.',
        verticesTitle: 'Vértices',
        verticesText:
            'O card Vértices lista todos os vértices em ordem alfabética, com a contagem total no cabeçalho. O botão **Novo** cria um vértice no canvas sem precisar trocar de ferramenta; depois é só arrastá-lo para o lugar desejado.',
        verticesItems: [
            '**Renomear:** edite o rótulo direto no campo de texto, com até 6 caracteres. A ordem alfabética dos rótulos é a ordem padrão de visita de todos os algoritmos.',
            '**Selecionar:** clique no círculo com as iniciais ou no campo de texto para destacar o vértice no canvas.',
            '**Remover:** o ícone de lixeira apaga o vértice e todas as arestas incidentes a ele.',
        ],
        edgesTitle: 'Arestas',
        edgesText:
            'O formulário no topo do card cria arestas com precisão, o que é útil para grafos grandes ou para copiar um exercício: escolha os vértices **De** e **Para**, informe o **Peso** e o **Tipo** (simples ou direcionada) e clique em Adicionar aresta. O cabeçalho mostra o total de arestas e quantas são de cada tipo.',
        edgeRules: [
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
        ],
        editIntro: 'Cada aresta da lista pode ser editada sem ser recriada:',
        editItems: {
            weight: 'o campo numérico altera o peso, e apagá-lo deixa a aresta sem peso;',
            direction: 'o selo alterna a direção com um clique:',
            select: 'clicar nos rótulos seleciona a aresta no canvas;',
            remove: 'a lixeira remove a aresta.',
        },
        mixedTitle: 'Grafos mistos',
        mixedText:
            'Cada aresta guarda a própria orientação, então um grafo pode misturar arestas simples e direcionadas. Quando isso acontece, um aviso aparece no card de arestas com dois atalhos, **Todas direcionadas** e **Todas simples**, porque a maioria dos algoritmos exige um único tipo.',
    },
    run: {
        description:
            'Aqui você escolhe o algoritmo, informa os parâmetros que ele pede e confere se o grafo atende aos requisitos antes de rodar a simulação.',
        chooseTitle: 'Escolha do algoritmo',
        chooseText:
            'O card Algoritmo agrupa os métodos por tópico, na ordem da disciplina. Cada opção mostra o nome, a complexidade e um resumo da estratégia. O algoritmo selecionado fica destacado e define o conteúdo do card Parâmetros logo abaixo.',
        parametersTitle: 'Parâmetros',
        parametersIntro:
            'O cabeçalho do card repete o nome e a complexidade do método, seguidos pelos requisitos do grafo em forma de selos. Os campos de vértice só aparecem quando o algoritmo os utiliza:',
        tableColumns: ['Campo', 'Algoritmos', 'Uso', 'Efeito'],
        required: 'obrigatório',
        optional: 'opcional',
        rows: [
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
        ],
        defaultsText:
            'Quando um campo obrigatório ainda não foi escolhido, o estúdio usa o primeiro vértice em ordem alfabética (e, para o sumidouro, o primeiro diferente da fonte). Os vértices escolhidos ganham um anel tracejado no canvas com a etiqueta RAIZ, DESTINO, FONTE ou SUMIDOURO.',
        orderTitle: 'Sequência de visita',
        orderText:
            'Muitos algoritmos precisam decidir qual vizinho examinar primeiro. Por padrão a decisão segue a ordem alfabética dos rótulos, que é a convenção usada em sala. Quando o exercício pede outra ordem, monte-a em **Sequência de visita**:',
        orderItems: [
            'clique nos vértices na ordem desejada para acrescentá-los à sequência;',
            'o primeiro vértice escolhido vira a raiz quando nenhuma for definida acima (nos algoritmos de fluxo, ele é o primeiro vizinho tentado na busca);',
            'clique em um vértice da sequência para retirá-lo;',
            'os vértices que ficarem de fora seguem em ordem alfabética, depois dos escolhidos;',
            'o botão **Padrão** volta à ordem alfabética.',
        ],
        validationTitle: 'Validação antes de executar',
        validationText:
            'Os requisitos são verificados a cada alteração do grafo ou dos parâmetros. Se estiver tudo certo, aparece uma confirmação em verde; caso contrário, cada problema é listado em vermelho com a correção sugerida, e o botão Executar fica desabilitado.',
        sampleIssues: [
            'Kruskal opera sobre grafos não direcionados: converta todas as arestas para não direcionadas.',
            'A fonte s e o sumidouro t precisam ser vértices diferentes.',
        ],
        requirementsMet: 'O grafo atende aos requisitos deste algoritmo.',
        tip: 'Ao clicar em Executar, o estúdio calcula a execução inteira de uma vez, abre a aba Passos no primeiro passo e volta a ferramenta do canvas para Selecionar e mover, para que nenhum clique acidental altere o grafo durante a análise.',
    },
    steps: {
        description:
            'Depois da execução, a aba Passos funciona como um player: você navega pela simulação enquanto o canvas e as estruturas auxiliares mostram o estado exato de cada iteração.',
        controlsTitle: 'Controles de reprodução',
        controlsIntro:
            'O cabeçalho indica o algoritmo e a posição atual (por exemplo, Passo 4 de 23), com uma barra de progresso logo abaixo. Os controles são:',
        controls: {
            first: { name: 'Primeiro passo', description: 'Volta ao estado inicial.' },
            previous: { name: 'Passo anterior', description: 'Recua uma iteração.' },
            play: {
                name: 'Reproduzir / pausar',
                description:
                    'Avança sozinho no ritmo escolhido. No fim, recomeça do primeiro passo.',
            },
            next: { name: 'Próximo passo', description: 'Avança uma iteração.' },
            last: { name: 'Último passo', description: 'Pula para o resultado final.' },
            clear: {
                name: 'Limpar',
                description: 'Descarta a execução e devolve o canvas às cores originais.',
            },
        },
        speedText:
            'O controle deslizante salta direto para qualquer passo. Qualquer navegação manual pausa a reprodução automática. As velocidades disponíveis são:',
        perStep: (interval) => `${interval} por passo`,
        contentTitle: 'O que cada passo mostra',
        contentText:
            'O card principal traz o **título** da decisão tomada (por exemplo, “Aresta tensa (A, C): relaxada”), a **justificativa** com os valores envolvidos e, quando faz sentido, **métricas** como a ordem de visita, a iteração corrente ou o valor do fluxo. Abaixo dele aparecem as estruturas auxiliares do algoritmo.',
        structures: {
            queue: {
                title: 'Fila',
                description: 'O primeiro elemento, o próximo a sair, fica destacado.',
            },
            stack: {
                title: 'Pilha',
                description: 'O topo da pilha, o último elemento, fica destacado.',
            },
            set: {
                title: 'Conjunto',
                description: 'Elementos sem ordem de saída, como os vértices ainda não fechados.',
            },
        },
        tablesText:
            'As **tabelas** reproduzem as do quadro: dist e pred, tempos de descoberta e término, matrizes de Floyd-Warshall, fluxo e capacidades residuais, entre outras. Linhas coloridas indicam o papel de cada entrada no passo atual:',
        sampleTable: { title: 'dist e pred', columns: ['Vértice', 'dist', 'pred'] },
        emphasis: [
            { label: 'Azul:', description: 'entrada alterada ou examinada neste passo.' },
            { label: 'Verde:', description: 'valor definitivo ou elemento aceito.' },
            { label: 'Vermelho:', description: 'elemento rejeitado.' },
        ],
        conclusionsTitle: 'Conclusões',
        conclusionsText:
            'No último passo surge o card **Conclusões**, em verde, que interpreta o resultado: distâncias finais e caminho recuperado, peso total da árvore geradora, valor do fluxo máximo e o corte correspondente, componentes encontrados, ordem topológica, número de cores usadas. É o resumo para conferir com a sua resposta.',
        conclusionBadges: [
            'dist final',
            'caminho mínimo',
            'peso da AGM',
            'fluxo máximo',
            'ordem topológica',
            'número de cores',
        ],
        discardedTitle: 'Quando a execução é descartada',
        discardedText:
            'A execução fica vinculada ao grafo e ao algoritmo em que foi gerada. Criar, remover ou renomear vértices, mudar arestas, pesos ou direções, ou trocar de algoritmo descarta o traço automaticamente, e é preciso executar de novo. Arrastar vértices para reorganizar o desenho não afeta a execução.',
    },
    catalog: {
        description: (count) =>
            `Os ${count} métodos disponíveis no estúdio, na ordem da disciplina. Para a ideia central, o invariante, os erros comuns e o pseudocódigo de cada um, abra a página de referência.`,
        parameters: 'Parâmetros:',
        summaries: {
            flow: 'Fonte s e sumidouro t',
            originWithOptionalTarget: 'Origem; destino opcional',
            optionalOriginAndTarget: 'Origem e destino opcionais',
            root: 'Raiz',
            optionalStart: 'Vértice inicial opcional',
            none: 'Nenhum',
        },
    },
    shortcuts: {
        description:
            'Os atalhos funcionam em qualquer aba do estúdio e agilizam a edição do grafo.',
        or: 'ou',
        actions: {
            undo: 'Desfaz a última alteração do grafo.',
            redo: 'Refaz a alteração desfeita.',
            remove: 'Remove o vértice ou a aresta selecionada.',
            cancel: 'Cancela a seleção ou a aresta que está sendo criada.',
        },
        note: 'Enquanto você digita em um campo de texto ou escolhe uma opção em uma lista, os atalhos ficam desativados, para que apagar um caractere nunca remova um vértice.',
    },
    storage: {
        description:
            'O Graph Labs não tem servidor, banco de dados nem cadastro. Todo o processamento acontece no seu navegador e nada do que você desenha é enviado para lugar algum.',
        savedInBrowser: 'Salvo no navegador',
        sessionOnly: 'Apenas nesta sessão',
        items: {
            graph: {
                title: 'Grafo atual',
                description:
                    'Vértices, posições, arestas, pesos e direções são salvos a cada alteração. Ao voltar ao estúdio, o grafo reaparece exatamente como você deixou.',
            },
            autoArrange: {
                title: 'Sugestão de posicionamento',
                description:
                    'Fica lembrado se você prefere o ajuste automático ligado ou desligado.',
            },
            theme: {
                title: 'Tema claro ou escuro',
                description:
                    'Na primeira visita segue a preferência do sistema operacional. Depois, vale a escolha feita no botão do cabeçalho.',
            },
            language: {
                title: 'Idioma',
                description:
                    'O inglês é o padrão. Depois que você escolhe outro idioma no cabeçalho, o site passa a abrir nele nas próximas visitas.',
            },
            history: {
                title: 'Histórico e execução',
                description:
                    'O histórico de desfazer e refazer, o algoritmo escolhido e o traço da execução são descartados ao recarregar a página.',
            },
        },
        warningTitle: 'Um grafo por navegador',
        warningText:
            'O estúdio guarda apenas o grafo em edição, e só no navegador e dispositivo em que ele foi criado. Limpar os dados do site, usar uma janela anônima ou carregar um modelo pronto substitui o grafo salvo.',
    },
    faq: {
        description: 'Respostas rápidas para as dúvidas mais comuns no uso do estúdio.',
        items: [
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
        ],
    },
};
