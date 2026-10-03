import type { ReactNode } from 'react';
import { Callout } from '../Callout';
import { DocSection } from '../DocSection';
import { Kbd } from '../Kbd';

const shortcuts: { keys: ReactNode; action: string }[] = [
    {
        keys: (
            <>
                <Kbd>Ctrl</Kbd> <Kbd>Z</Kbd>
                <span className="text-ink-faint text-xs">ou</span>
                <Kbd>⌘</Kbd> <Kbd>Z</Kbd>
            </>
        ),
        action: 'Desfaz a última alteração do grafo.',
    },
    {
        keys: (
            <>
                <Kbd>Ctrl</Kbd> <Kbd>Shift</Kbd> <Kbd>Z</Kbd>
                <span className="text-ink-faint text-xs">ou</span>
                <Kbd>⌘</Kbd> <Kbd>Shift</Kbd> <Kbd>Z</Kbd>
            </>
        ),
        action: 'Refaz a alteração desfeita.',
    },
    {
        keys: (
            <>
                <Kbd>Delete</Kbd>
                <span className="text-ink-faint text-xs">ou</span>
                <Kbd>Backspace</Kbd>
            </>
        ),
        action: 'Remove o vértice ou a aresta selecionada.',
    },
    {
        keys: <Kbd>Esc</Kbd>,
        action: 'Cancela a seleção ou a aresta que está sendo criada.',
    },
];

export function ShortcutsSection() {
    return (
        <DocSection
            id="atalhos"
            index={9}
            title="Atalhos de teclado"
            description="Os atalhos funcionam em qualquer aba do estúdio e agilizam a edição do grafo."
        >
            <ul className="border-line bg-surface rounded-card divide-y divide-[var(--color-line)] border">
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

            <Callout tone="info">
                Enquanto você digita em um campo de texto ou escolhe uma opção em uma lista, os
                atalhos ficam desativados, para que apagar um caractere nunca remova um vértice.
            </Callout>
        </DocSection>
    );
}
