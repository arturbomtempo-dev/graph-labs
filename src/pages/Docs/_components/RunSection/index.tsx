import { AlertTriangle, Check } from 'lucide-react';
import { Badge } from '@/components/Badge';
import { RichText } from '@/components/RichText';
import { useI18n } from '@/hooks/useI18n';
import { Callout } from '../Callout';
import { DocSection, DocSubsection } from '../DocSection';

export function RunSection() {
    const { t } = useI18n();
    const text = t.docs.run;

    return (
        <DocSection section="run" description={text.description}>
            <DocSubsection title={text.chooseTitle}>
                <p>{text.chooseText}</p>
            </DocSubsection>

            <DocSubsection title={text.parametersTitle}>
                <p>{text.parametersIntro}</p>
                <div className="border-line bg-surface rounded-card overflow-x-auto border">
                    <table className="w-full min-w-140 border-collapse text-left">
                        <thead>
                            <tr className="border-line border-b">
                                {text.tableColumns.map((column) => (
                                    <th
                                        key={column}
                                        className="text-ink-faint px-4 py-2.5 text-[10px] font-semibold tracking-wider uppercase"
                                    >
                                        {column}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {text.rows.map((row) => (
                                <tr
                                    key={row.field + row.when}
                                    className="border-line/60 border-b align-top last:border-0"
                                >
                                    <td className="text-ink px-4 py-3 text-xs font-semibold whitespace-nowrap">
                                        {row.field}
                                    </td>
                                    <td className="text-ink-soft px-4 py-3 text-xs leading-relaxed">
                                        {row.when}
                                    </td>
                                    <td className="px-4 py-3">
                                        <Badge tone={row.required ? 'brand' : 'neutral'}>
                                            {row.required ? text.required : text.optional}
                                        </Badge>
                                    </td>
                                    <td className="text-ink-soft px-4 py-3 text-xs leading-relaxed">
                                        {row.effect}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <p>{text.defaultsText}</p>
            </DocSubsection>

            <DocSubsection title={text.orderTitle}>
                <p>
                    <RichText text={text.orderText} />
                </p>
                <ul className="flex list-disc flex-col gap-1.5 pl-5">
                    {text.orderItems.map((item) => (
                        <li key={item}>
                            <RichText text={item} />
                        </li>
                    ))}
                </ul>
            </DocSubsection>

            <DocSubsection title={text.validationTitle}>
                <p>{text.validationText}</p>
                <div className="grid gap-2.5 sm:grid-cols-2">
                    <div className="border-line bg-surface flex flex-col justify-center rounded-lg border p-3">
                        <p className="text-state-done flex items-center gap-1.5 text-[11px]">
                            <Check size={13} />
                            {text.requirementsMet}
                        </p>
                    </div>
                    <div className="border-state-reject/25 bg-state-reject/8 flex flex-col gap-1.5 rounded-lg border p-2.5">
                        {text.sampleIssues.map((issue) => (
                            <p
                                key={issue}
                                className="text-state-reject flex items-start gap-1.5 text-[11px] leading-relaxed"
                            >
                                <AlertTriangle size={13} className="mt-px shrink-0" />
                                {issue}
                            </p>
                        ))}
                    </div>
                </div>
            </DocSubsection>

            <Callout tone="tip">{text.tip}</Callout>
        </DocSection>
    );
}
