import type { Dictionary } from '@/i18n/dictionaries';

export const shell: Dictionary['shell'] = {
    meta: {
        title: 'Graph Labs · Algoritmos em grafos',
        description:
            'Laboratório visual de teoria dos grafos: monte o grafo e execute os métodos clássicos passo a passo, com tabelas, filas e a justificativa de cada iteração.',
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
