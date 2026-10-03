import type { Dictionary } from '@/i18n/dictionaries';

export const home: Dictionary['home'] = {
    hero: {
        title: 'Construye el grafo, elige el algoritmo y sigue cada paso de la ejecución.',
        description:
            'Un laboratorio visual para clases y tutorías. Dibuja vértices y aristas dirigidas o no dirigidas, define pesos y ejecuta los algoritmos clásicos de la asignatura con la misma notación usada en clase, con tablas, colas y la justificación de cada iteración.',
        openStudio: 'Abrir el estudio',
        viewPseudocode: 'Ver pseudocódigos',
    },
    capabilities: [
        {
            title: 'Edición directa en el lienzo',
            description:
                'Crea vértices con un clic, conéctalos y ajusta pesos y dirección sin salir de la pantalla.',
        },
        {
            title: 'Dirigido, no dirigido o mixto',
            description:
                'Cada arista guarda su propia orientación. Los algoritmos validan el tipo de grafo requerido antes de ejecutarse.',
        },
        {
            title: 'Traza paso a paso',
            description:
                'Colas, pilas, tablas de dist y pred y matrices de distancia acompañan la animación en cada iteración.',
        },
    ],
    grid: {
        title: 'De la búsqueda en grafos a la coloración, en el orden de la asignatura',
        description:
            'Cada ejecución genera una traza completa: marcado de los vértices, tablas auxiliares y la justificación de cada decisión.',
        badge: (count) => `${count} algoritmos`,
    },
};
