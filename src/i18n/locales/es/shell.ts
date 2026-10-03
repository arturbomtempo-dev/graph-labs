import type { Dictionary } from '@/i18n/dictionaries';

export const shell: Dictionary['shell'] = {
    meta: {
        imageAlt:
            'Graph Labs: algoritmos en grafos, paso a paso. Un grafo con cinco vértices que resalta la ejecución de un algoritmo.',
        pages: {
            home: {
                title: 'Graph Labs | Algoritmos en grafos, paso a paso',
                description:
                    'Laboratorio visual de teoría de grafos: construye el grafo y ejecuta los algoritmos clásicos paso a paso, con tablas, colas y la justificación de cada iteración.',
            },
            studio: {
                title: 'Estudio | Graph Labs',
                description:
                    'Dibuja un grafo en el lienzo, elige uno de los 17 algoritmos clásicos y sigue la ejecución paso a paso, con tablas, colas y la justificación de cada decisión.',
            },
            algorithms: {
                title: 'Referencia de los algoritmos | Graph Labs',
                description:
                    'Idea central, invariante, errores comunes y pseudocódigo de las búsquedas en anchura y en profundidad, Dijkstra, Bellman-Ford, Floyd-Warshall, Prim, Kruskal, flujo máximo, emparejamiento y coloración.',
            },
            docs: {
                title: 'Documentación | Graph Labs',
                description:
                    'Guía completa del estudio de Graph Labs: construcción de grafos, ejecución de los algoritmos, lectura de la traza paso a paso, atajos de teclado y preguntas frecuentes.',
            },
            about: {
                title: 'Acerca de | Graph Labs',
                description:
                    'Por qué se creó Graph Labs en la monitoría de Teoría de Grafos de la PUC Minas y quién lo desarrolla.',
            },
            notFound: {
                title: 'Página no encontrada | Graph Labs',
                description:
                    'No se encontró la página que intentaste abrir. Vuelve al inicio y elige un camino válido.',
            },
        },
    },
    nav: {
        home: 'Inicio',
        studio: 'Estudio',
        algorithms: 'Algoritmos',
        docs: 'Documentación',
        about: 'Acerca de',
    },
    menu: {
        open: 'Abrir menú',
        close: 'Cerrar menú',
        navigation: 'Navegación principal',
    },
    theme: {
        toLight: 'Activar tema claro',
        toDark: 'Activar tema oscuro',
    },
    language: {
        label: 'Idioma',
        change: 'Cambiar idioma',
    },
    footer: {
        rights: (year) => `© ${year} Graph Labs. Todos los derechos reservados.`,
        developedBy: 'Desarrollado por',
    },
    notFound: {
        title: 'Este vértice no existe en el grafo',
        description:
            'No se encontró la página que intentaste abrir. Vuelve al inicio y elige un camino válido.',
        back: 'Volver al inicio',
    },
};
