import type { Dictionary } from '@/i18n/dictionaries';

export const shell: Dictionary['shell'] = {
    meta: {
        imageAlt:
            'Graph Labs: algoritmos em grafos, passo a passo. Um grafo com cinco vértices destacando a execução de um algoritmo.',
        pages: {
            home: {
                title: 'Graph Labs · Algoritmos em grafos, passo a passo',
                description:
                    'Laboratório visual de teoria dos grafos: monte o grafo e execute os métodos clássicos passo a passo, com tabelas, filas e a justificativa de cada iteração.',
            },
            studio: {
                title: 'Estúdio · Graph Labs',
                description:
                    'Desenhe um grafo no canvas, escolha um dos 17 algoritmos clássicos e acompanhe a execução passo a passo, com tabelas, filas e a justificativa de cada decisão.',
            },
            algorithms: {
                title: 'Referência dos algoritmos · Graph Labs',
                description:
                    'Ideia central, invariante, erros comuns e pseudocódigo das buscas em largura e em profundidade, Dijkstra, Bellman-Ford, Floyd-Warshall, Prim, Kruskal, fluxo máximo, emparelhamento e coloração.',
            },
            docs: {
                title: 'Documentação · Graph Labs',
                description:
                    'Guia completo do estúdio do Graph Labs: montagem de grafos, execução dos algoritmos, leitura do traço passo a passo, atalhos de teclado e perguntas frequentes.',
            },
            about: {
                title: 'Sobre · Graph Labs',
                description:
                    'Por que o Graph Labs foi criado na monitoria de Teoria dos Grafos da PUC Minas e quem o desenvolve.',
            },
            notFound: {
                title: 'Página não encontrada · Graph Labs',
                description:
                    'A rota que você tentou acessar não foi encontrada. Volte para o início e escolha um caminho válido.',
            },
        },
    },
    nav: {
        home: 'Início',
        studio: 'Estúdio',
        algorithms: 'Algoritmos',
        docs: 'Documentação',
        about: 'Sobre',
    },
    menu: {
        open: 'Abrir menu',
        close: 'Fechar menu',
        navigation: 'Navegação principal',
    },
    theme: {
        toLight: 'Ativar tema claro',
        toDark: 'Ativar tema escuro',
    },
    language: {
        label: 'Idioma',
        change: 'Alterar idioma',
    },
    footer: {
        rights: (year) => `© ${year} Graph Labs. Todos os direitos reservados.`,
        developedBy: 'Desenvolvido por',
    },
    notFound: {
        title: 'Este vértice não existe no grafo',
        description:
            'A rota que você tentou acessar não foi encontrada. Volte para o início e escolha um caminho válido.',
        back: 'Voltar ao início',
    },
};
