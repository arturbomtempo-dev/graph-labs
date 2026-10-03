export const home = {
    hero: {
        title: 'Build the graph, pick the algorithm and follow every step of the run.',
        description:
            'A visual lab for lectures and tutoring sessions. Draw directed or undirected vertices and edges, set weights and run the classic algorithms of the course in the same notation used in class, with tables, queues and the reasoning behind every iteration.',
        openStudio: 'Open the studio',
        viewPseudocode: 'View pseudocode',
    },
    capabilities: [
        {
            title: 'Edit right on the canvas',
            description:
                'Create vertices with a click, connect them and adjust weights and direction without leaving the screen.',
        },
        {
            title: 'Directed, undirected or mixed',
            description:
                'Each edge keeps its own direction. Algorithms check the required graph type before they run.',
        },
        {
            title: 'Step-by-step trace',
            description:
                'Queues, stacks, dist and pred tables and distance matrices follow the animation at every iteration.',
        },
    ],
    grid: {
        title: 'From graph search to coloring, in course order',
        description:
            'Every run produces a full trace: vertex markings, auxiliary tables and the reasoning behind each decision.',
        badge: (count: number) => `${count} algorithms`,
    },
};
