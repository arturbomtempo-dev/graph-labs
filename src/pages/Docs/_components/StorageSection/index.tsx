import { History, Languages, Moon, Network, Wand2, type LucideIcon } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';
import { Callout } from '../Callout';
import { DocSection } from '../DocSection';

const items: {
    key: 'graph' | 'autoArrange' | 'theme' | 'language' | 'history';
    icon: LucideIcon;
    persisted: boolean;
}[] = [
    { key: 'graph', icon: Network, persisted: true },
    { key: 'autoArrange', icon: Wand2, persisted: true },
    { key: 'theme', icon: Moon, persisted: true },
    { key: 'language', icon: Languages, persisted: true },
    { key: 'history', icon: History, persisted: false },
];

export function StorageSection() {
    const { t } = useI18n();
    const text = t.docs.storage;

    return (
        <DocSection section="storage" description={text.description}>
            <ul className="grid gap-2.5 sm:grid-cols-2">
                {items.map((item) => (
                    <li
                        key={item.key}
                        className="border-line bg-surface flex flex-col gap-2 rounded-lg border p-4"
                    >
                        <div className="flex items-center justify-between gap-2">
                            <span className="text-ink flex items-center gap-2 text-[13px] font-semibold">
                                <item.icon size={15} className="text-brand" />
                                {text.items[item.key].title}
                            </span>
                            <span className="text-ink-faint text-[10px] font-semibold tracking-wider whitespace-nowrap uppercase">
                                {item.persisted ? text.savedInBrowser : text.sessionOnly}
                            </span>
                        </div>
                        <p className="text-ink-soft text-xs leading-relaxed">
                            {text.items[item.key].description}
                        </p>
                    </li>
                ))}
            </ul>

            <Callout tone="warning" title={text.warningTitle}>
                {text.warningText}
            </Callout>
        </DocSection>
    );
}
