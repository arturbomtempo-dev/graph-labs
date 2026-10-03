import type { Dictionary } from '@/i18n/dictionaries';

export const about: Dictionary['about'] = {
    eyebrow: 'Sobre el autor',
    headline: 'Desarrollador de software',
    summary: (institution) =>
        `Desarrollador de software | Monitor de Teoría de Grafos en la ${institution} en el 2.º semestre de 2026.`,
    credentials: [
        {
            title: 'Desarrollador de software',
            description: 'Más de 4 años de experiencia en el área.',
        },
        { title: 'Técnico en Informática', description: 'Formación técnica en Coemig.' },
        { title: 'Ingeniería de Software', description: 'Estudiante de grado en la PUC Minas.' },
    ],
    who: {
        title: 'Quién escribe',
        description: 'Un breve resumen de mi formación y de lo que hago.',
        text: 'Trabajo en desarrollo desde hace más de 4 años, creando aplicaciones web y herramientas que hacen más fáciles de ver las ideas abstractas. Me gustan especialmente los proyectos en los que la interfaz es lo que por fin hace que el concepto tenga sentido.',
    },
    why: {
        title: 'Por qué existe Graph Labs',
        description: 'Para estudiar los algoritmos y revisar ejercicios.',
        paragraphs: (institution) => [
            `En la monitoría de Teoría de Grafos de la ${institution}, en el 2.º semestre de 2026, desarrollé Graph Labs para ayudar a los estudiantes a comprender y repasar los principales algoritmos de grafos de la asignatura.`,
            'La idea nació de una dificultad recurrente en las tutorías: el pseudocódigo en papel oculta lo que realmente ocurre en cada iteración. Aquí cada método se ejecuta paso a paso sobre el grafo que el propio estudiante dibujó, mostrando las mismas tablas, colas y notación usadas en clase, con la justificación de cada decisión.',
            'En la práctica, puedes reconstruir el grafo de un ejercicio de la lista, ejecutar el método sobre él y comparar cada paso con lo que resolviste en papel.',
        ],
        numbers: {
            methods: 'métodos implementados',
            topics: 'temas de la asignatura',
            presets: 'grafos de ejemplo',
        },
    },
    cta: {
        title: 'Hecho para estudiar y revisar ejercicios',
        description:
            'Construye el grafo de tu ejercicio o carga uno de los ejemplos y revisa cada paso de la ejecución.',
        openStudio: 'Abrir el estudio',
        viewPseudocode: 'Ver pseudocódigos',
    },
};
