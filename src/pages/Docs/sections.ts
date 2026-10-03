export const docSections = [
    { key: 'overview', id: 'overview' },
    { key: 'quickStart', id: 'getting-started' },
    { key: 'anatomy', id: 'studio-layout' },
    { key: 'canvas', id: 'canvas' },
    { key: 'build', id: 'build-tab' },
    { key: 'run', id: 'run-tab' },
    { key: 'steps', id: 'steps-tab' },
    { key: 'catalog', id: 'algorithms' },
    { key: 'shortcuts', id: 'shortcuts' },
    { key: 'storage', id: 'data-and-preferences' },
    { key: 'faq', id: 'faq' },
] as const;

export type DocSectionKey = (typeof docSections)[number]['key'];

export function sectionId(key: DocSectionKey): string {
    return docSections.find((section) => section.key === key)?.id ?? key;
}

export function sectionIndex(key: DocSectionKey): number {
    return docSections.findIndex((section) => section.key === key) + 1;
}
