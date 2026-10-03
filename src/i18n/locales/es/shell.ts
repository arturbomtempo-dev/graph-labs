import type { Dictionary } from '@/i18n/dictionaries';

export const shell: Dictionary['shell'] = {
    meta: {
        title: 'Graph Labs · Algoritmos en grafos',
        description:
            'Laboratorio visual de teoría de grafos: construye el grafo y ejecuta los algoritmos clásicos paso a paso, con tablas, colas y la justificación de cada iteración.',
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
