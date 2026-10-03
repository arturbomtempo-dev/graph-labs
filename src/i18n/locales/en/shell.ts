export const shell = {
    meta: {
        imageAlt:
            'Graph Labs: graph algorithms, step by step. A five-vertex graph highlighting the run of an algorithm.',
        pages: {
            home: {
                title: 'Graph Labs · Graph algorithms, step by step',
                description:
                    'A visual graph theory lab: build the graph and run the classic algorithms step by step, with tables, queues and the reasoning behind every iteration.',
            },
            studio: {
                title: 'Studio · Graph Labs',
                description:
                    'Draw a graph on the canvas, choose one of 17 classic algorithms and follow the run step by step, with tables, queues and the reasoning behind each decision.',
            },
            algorithms: {
                title: 'Algorithm reference · Graph Labs',
                description:
                    'Core idea, invariant, common pitfalls and pseudocode for breadth-first and depth-first search, Dijkstra, Bellman-Ford, Floyd-Warshall, Prim, Kruskal, maximum flow, matching and coloring.',
            },
            docs: {
                title: 'Documentation · Graph Labs',
                description:
                    'Complete guide to the Graph Labs studio: building graphs, running algorithms, reading the step-by-step trace, keyboard shortcuts and FAQ.',
            },
            about: {
                title: 'About · Graph Labs',
                description:
                    'Why Graph Labs was created in the Graph Theory teaching assistantship at PUC Minas, and who builds it.',
            },
            notFound: {
                title: 'Page not found · Graph Labs',
                description:
                    'The page you tried to open was not found. Go back home and pick a valid path.',
            },
        },
    },
    nav: {
        home: 'Home',
        studio: 'Studio',
        algorithms: 'Algorithms',
        docs: 'Docs',
        about: 'About',
    },
    menu: {
        open: 'Open menu',
        close: 'Close menu',
        navigation: 'Main navigation',
    },
    theme: {
        toLight: 'Switch to light theme',
        toDark: 'Switch to dark theme',
    },
    language: {
        label: 'Language',
        change: 'Change language',
    },
    footer: {
        rights: (year: number) => `© ${year} Graph Labs. All rights reserved.`,
        developedBy: 'Developed by',
    },
    notFound: {
        title: 'This vertex is not in the graph',
        description:
            'The page you tried to open was not found. Go back home and pick a valid path.',
        back: 'Back to home',
    },
};
