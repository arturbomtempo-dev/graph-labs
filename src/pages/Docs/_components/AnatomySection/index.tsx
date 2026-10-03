import { Callout } from '../Callout';
import { DocSection } from '../DocSection';
import { StudioMap } from '../StudioMap';

export function AnatomySection() {
    return (
        <DocSection
            id="anatomia-do-estudio"
            index={3}
            title="Anatomia do estúdio"
            description="O estúdio divide a tela em duas áreas: o canvas, onde o grafo é desenhado e animado, e o painel lateral, onde ficam os formulários, o catálogo de algoritmos e o traço da execução."
        >
            <StudioMap />

            <Callout tone="info" title="Layout responsivo">
                Em telas largas (a partir de 1024 px), o canvas ocupa toda a altura à esquerda e o
                painel fica fixo à direita, com rolagem própria. Em tablets e celulares, o canvas
                aparece em cima, com cerca de metade da altura da tela, e o painel logo abaixo, com
                as abas fixas no topo enquanto você rola.
            </Callout>
        </DocSection>
    );
}
