import type { Dictionary } from '@/i18n/dictionaries';

export const about: Dictionary['about'] = {
    eyebrow: 'Sobre o autor',
    headline: 'Desenvolvedor de Software',
    summary: (institution) =>
        `Desenvolvedor de Software · Monitor de Teoria dos Grafos na ${institution} no 2º semestre de 2026.`,
    credentials: [
        {
            title: 'Desenvolvedor de Software',
            description: 'Mais de 4 anos de experiência na área.',
        },
        { title: 'Técnico em Informática', description: 'Formação técnica pelo Coemig.' },
        { title: 'Engenharia de Software', description: 'Graduando na PUC Minas.' },
    ],
    who: {
        title: 'Quem escreve',
        description: 'Um resumo rápido da minha formação e do que faço.',
        text: 'Trabalho com desenvolvimento há mais de 4 anos, construindo aplicações web e ferramentas que tornam ideias abstratas mais fáceis de enxergar. Gosto especialmente de projetos em que a interface é o que faz o conceito finalmente fazer sentido.',
    },
    why: {
        title: 'Por que o Graph Labs existe',
        description: 'Para estudar os algoritmos e conferir exercícios.',
        paragraphs: (institution) => [
            `Na monitoria de Teoria dos Grafos da ${institution}, no 2º semestre de 2026, desenvolvi o Graph Labs para ajudar os alunos a compreender e revisar os principais algoritmos de grafos vistos na disciplina.`,
            'A ideia nasceu de uma dificuldade recorrente no atendimento: o pseudocódigo no papel esconde o que de fato acontece a cada iteração. Aqui cada método executa passo a passo sobre o grafo que o próprio aluno desenhou, exibindo as mesmas tabelas, filas e notação usadas em sala, com a justificativa de cada decisão.',
            'Na prática, dá para remontar o grafo de um exercício da lista, executar o método sobre ele e comparar cada passo com o que você resolveu no papel.',
        ],
        numbers: {
            methods: 'métodos implementados',
            topics: 'frentes da disciplina',
            presets: 'grafos de exemplo',
        },
    },
    cta: {
        title: 'Feito para estudar e conferir exercícios',
        description:
            'Monte o grafo do seu exercício ou carregue um dos exemplos e confira cada passo da execução.',
        openStudio: 'Abrir o estúdio',
        viewPseudocode: 'Ver pseudocódigos',
    },
};
