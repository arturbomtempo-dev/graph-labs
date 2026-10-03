export const shell = {
    meta: {
        title: 'Graph Labs · Graph algorithms',
        description:
            'A visual graph theory lab: build the graph and run the classic algorithms step by step, with tables, queues and the reasoning behind every iteration.',
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
