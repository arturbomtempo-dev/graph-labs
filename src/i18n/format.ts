export function plural(count: number, singular: string, pluralForm: string): string {
    return count === 1 ? singular : pluralForm;
}

export function joinList(items: string[], conjunction: string): string {
    if (items.length <= 1) return items.join('');
    return `${items.slice(0, -1).join(', ')} ${conjunction} ${items[items.length - 1]}`;
}
