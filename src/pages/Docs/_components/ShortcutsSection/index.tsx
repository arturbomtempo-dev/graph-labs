import type { ReactNode } from 'react';
import { useI18n } from '@/hooks/useI18n';
import { Callout } from '../Callout';
import { DocSection } from '../DocSection';
import { Kbd } from '../Kbd';

export function ShortcutsSection() {
    const { t } = useI18n();
    const text = t.docs.shortcuts;
    const or = <span className="text-ink-faint text-xs">{text.or}</span>;

    const shortcuts: { keys: ReactNode; action: string }[] = [
        {
            keys: (
                <>
                    <Kbd>Ctrl</Kbd> <Kbd>Z</Kbd>
                    {or}
                    <Kbd>⌘</Kbd> <Kbd>Z</Kbd>
                </>
            ),
            action: text.actions.undo,
        },
        {
            keys: (
                <>
                    <Kbd>Ctrl</Kbd> <Kbd>Shift</Kbd> <Kbd>Z</Kbd>
                    {or}
                    <Kbd>⌘</Kbd> <Kbd>Shift</Kbd> <Kbd>Z</Kbd>
                </>
            ),
            action: text.actions.redo,
        },
        {
            keys: (
                <>
                    <Kbd>Delete</Kbd>
                    {or}
                    <Kbd>Backspace</Kbd>
                </>
            ),
            action: text.actions.remove,
        },
        { keys: <Kbd>Esc</Kbd>, action: text.actions.cancel },
    ];

    return (
        <DocSection section="shortcuts" description={text.description}>
            <ul className="border-line bg-surface rounded-card divide-line divide-y border">
                {shortcuts.map((shortcut) => (
                    <li
                        key={shortcut.action}
                        className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
                    >
                        <span className="text-ink-soft text-[13px]">{shortcut.action}</span>
                        <span className="flex shrink-0 flex-wrap items-center gap-1">
                            {shortcut.keys}
                        </span>
                    </li>
                ))}
            </ul>

            <Callout tone="info">{text.note}</Callout>
        </DocSection>
    );
}
