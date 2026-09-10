export interface AuthorLink {
    id: string;
    label: string;
    url: string;
}

export const author = {
    name: 'Artur Bomtempo',
    headline: 'Desenvolvedor de Software',
    avatarUrl: 'https://avatars.githubusercontent.com/u/96635074?v=4',
    website: 'https://arturbomtempo.dev',
    role: 'Monitor de Teoria dos Grafos',
    institution: 'PUC Minas',
    term: '2º semestre de 2026',
    links: [
        { id: 'github', label: 'GitHub', url: 'https://github.com/arturbomtempo-dev' },
        { id: 'linkedin', label: 'LinkedIn', url: 'https://www.linkedin.com/in/artur-bomtempo/' },
        {
            id: 'instagram',
            label: 'Instagram',
            url: 'https://www.instagram.com/arturbomtempo.dev/',
        },
        { id: 'youtube', label: 'YouTube', url: 'https://www.youtube.com/@ArturBomtempoDev' },
    ] satisfies AuthorLink[],
};
