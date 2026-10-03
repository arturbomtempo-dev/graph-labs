export const about = {
    eyebrow: 'About the author',
    headline: 'Software Developer',
    summary: (institution: string) =>
        `Software Developer | Graph Theory teaching assistant at ${institution} in the 2nd semester of 2026.`,
    credentials: [
        {
            title: 'Software Developer',
            description: 'More than 4 years of experience in the field.',
        },
        { title: 'IT Technician', description: 'Technical degree from Coemig.' },
        { title: 'Software Engineering', description: 'Undergraduate student at PUC Minas.' },
    ],
    who: {
        title: 'Who writes this',
        description: 'A quick summary of my background and what I do.',
        text: 'I have been working in software development for more than 4 years, building web applications and tools that make abstract ideas easier to see. I especially enjoy projects where the interface is what finally makes the concept click.',
    },
    why: {
        title: 'Why Graph Labs exists',
        description: 'To study the algorithms and check exercises.',
        paragraphs: (institution: string) => [
            `During the Graph Theory teaching assistantship at ${institution}, in the 2nd semester of 2026, I built Graph Labs to help students understand and review the main graph algorithms covered in the course.`,
            'The idea came from a recurring difficulty during office hours: pseudocode on paper hides what actually happens at each iteration. Here every method runs step by step on the graph the student drew, showing the same tables, queues and notation used in class, with the reasoning behind each decision.',
            'In practice, you can rebuild the graph from a homework exercise, run the method on it and compare every step with what you solved on paper.',
        ],
        numbers: {
            methods: 'methods implemented',
            topics: 'course topics',
            presets: 'sample graphs',
        },
    },
    cta: {
        title: 'Made for studying and checking exercises',
        description:
            'Build the graph from your exercise or load one of the samples and check every step of the run.',
        openStudio: 'Open the studio',
        viewPseudocode: 'View pseudocode',
    },
};
