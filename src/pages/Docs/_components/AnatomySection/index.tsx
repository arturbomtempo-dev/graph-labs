import { useI18n } from '@/hooks/useI18n';
import { Callout } from '../Callout';
import { DocSection } from '../DocSection';
import { StudioMap } from '../StudioMap';

export function AnatomySection() {
    const { t } = useI18n();
    const text = t.docs.anatomy;

    return (
        <DocSection section="anatomy" description={text.description}>
            <StudioMap />

            <Callout tone="info" title={text.responsiveTitle}>
                {text.responsiveText}
            </Callout>
        </DocSection>
    );
}
