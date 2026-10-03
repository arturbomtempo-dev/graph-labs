import { Badge } from '@/components/Badge';
import { RichText } from '@/components/RichText';
import { useI18n } from '@/hooks/useI18n';
import { presets } from '@/lib/graph/presets';
import { Callout } from '../Callout';
import { DocSection, DocSubsection } from '../DocSection';

export function BuildSection() {
    const { t } = useI18n();
    const text = t.docs.build;
    const builder = t.studio.builder;

    return (
        <DocSection section="build" description={text.description}>
            <DocSubsection title={text.presetsTitle}>
                <p>{text.presetsText}</p>
                <ul className="grid gap-2.5 sm:grid-cols-2">
                    {presets.map((preset) => (
                        <li
                            key={preset.id}
                            className="border-line bg-surface flex flex-col gap-2 rounded-lg border p-3.5"
                        >
                            <p className="text-ink text-[13px] font-semibold">
                                {t.presets[preset.id].name}
                            </p>
                            <p className="text-ink-soft text-xs leading-relaxed">
                                {t.presets[preset.id].description}
                            </p>
                            <div className="mt-auto flex flex-wrap gap-1 pt-1">
                                {preset.suggestedAlgorithms.map((id) => (
                                    <Badge key={id} tone="brand">
                                        {t.algorithms[id].shortName}
                                    </Badge>
                                ))}
                            </div>
                        </li>
                    ))}
                </ul>
            </DocSubsection>

            <DocSubsection title={text.verticesTitle}>
                <p>
                    <RichText text={text.verticesText} />
                </p>
                <ul className="flex list-disc flex-col gap-1.5 pl-5">
                    {text.verticesItems.map((item) => (
                        <li key={item}>
                            <RichText text={item} />
                        </li>
                    ))}
                </ul>
            </DocSubsection>

            <DocSubsection title={text.edgesTitle}>
                <p>
                    <RichText text={text.edgesText} />
                </p>
                <div className="grid gap-2.5 sm:grid-cols-3">
                    {text.edgeRules.map((rule) => (
                        <div
                            key={rule.title}
                            className="border-line bg-surface rounded-lg border p-3"
                        >
                            <p className="text-ink text-xs font-semibold">{rule.title}</p>
                            <p className="text-ink-soft mt-1 text-xs leading-relaxed">
                                {rule.description}
                            </p>
                        </div>
                    ))}
                </div>
                <p>{text.editIntro}</p>
                <ul className="flex list-disc flex-col gap-1.5 pl-5">
                    <li>{text.editItems.weight}</li>
                    <li>
                        {text.editItems.direction} <Badge>{builder.undirectedBadge}</Badge> /{' '}
                        <Badge tone="brand">{builder.directedBadge}</Badge>
                    </li>
                    <li>{text.editItems.select}</li>
                    <li>{text.editItems.remove}</li>
                </ul>
            </DocSubsection>

            <Callout tone="warning" title={text.mixedTitle}>
                <RichText text={text.mixedText} />
            </Callout>
        </DocSection>
    );
}
