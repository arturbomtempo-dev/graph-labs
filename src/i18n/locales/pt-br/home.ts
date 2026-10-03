import type { Dictionary } from '@/i18n/dictionaries';

export const home: Dictionary['home'] = {
    hero: {
        title: 'Monte o grafo, escolha o algoritmo e acompanhe cada passo da execução.',
        description:
            'Um laboratório visual para aulas e monitorias. Desenhe vértices e arestas direcionadas ou não direcionadas, defina pesos e execute os métodos clássicos da disciplina na mesma notação usada em sala, com tabelas, filas e a justificativa de cada iteração.',
        openStudio: 'Abrir o estúdio',
        viewPseudocode: 'Ver pseudocódigos',
    },
    capabilities: [
        {
            title: 'Edição direta no canvas',
            description:
                'Crie vértices com um clique, conecte-os e ajuste pesos e direção sem sair da tela.',
        },
        {
            title: 'Direcionado, não direcionado ou misto',
            description:
                'Cada aresta guarda sua própria orientação. Os algoritmos validam o tipo de grafo exigido antes de executar.',
        },
        {
            title: 'Traço passo a passo',
            description:
                'Filas, pilhas, tabelas de dist e pred e matrizes de distância acompanham a animação em cada iteração.',
        },
    ],
    grid: {
        title: 'Da busca em grafos à coloração, na ordem da disciplina',
        description:
            'Cada execução gera um traço completo: marcação dos vértices, tabelas auxiliares e a justificativa de cada decisão.',
        badge: (count) => `${count} algoritmos`,
    },
};
