import type { Dictionary } from '@/i18n/dictionaries';
import { algorithms } from './algorithms';
import { presets } from './catalog';

export const docs: Dictionary['docs'] = {
    hero: {
        eyebrow: 'Documentación',
        title: 'Cómo funciona Graph Labs',
        description:
            'Una guía completa del estudio: cómo construir el grafo, configurar y ejecutar cada algoritmo, leer la traza paso a paso y aprovechar las funciones que agilizan la revisión de ejercicios.',
        openStudio: 'Abrir el estudio',
        viewPseudocode: 'Ver pseudocódigos',
    },
    toc: {
        label: 'En esta página',
        ariaLabel: 'Secciones de la documentación',
    },
    callouts: {
        info: 'Nota',
        tip: 'Consejo',
        warning: 'Atención',
    },
    sections: {
        overview: 'Visión general',
        quickStart: 'Primeros pasos',
        anatomy: 'Anatomía del estudio',
        canvas: 'Lienzo y herramientas',
        build: 'Pestaña Construir',
        run: 'Pestaña Ejecutar',
        steps: 'Pestaña Pasos',
        catalog: 'Catálogo de algoritmos',
        shortcuts: 'Atajos de teclado',
        storage: 'Datos y preferencias',
        faq: 'Preguntas frecuentes',
    },
    overview: {
        description:
            'Graph Labs es un laboratorio visual de teoría de grafos. Dibujas el grafo, eliges uno de los algoritmos clásicos y sigues la ejecución iteración a iteración, con las mismas tablas, colas y notación usadas en clase.',
        numbers: {
            algorithms: 'algoritmos implementados',
            topics: 'temas de la asignatura',
            presets: 'grafos de ejemplo',
        },
        problemTitle: 'El problema que resuelve',
        problemParagraphs: [
            'El pseudocódigo en papel oculta justamente lo que más importa para aprender: qué ocurre en cada iteración. Leer que el algoritmo de Dijkstra “selecciona el vértice no cerrado de menor etiqueta” es muy distinto de ver cómo se elige ese vértice, se actualiza la tabla de distancias y la arista entra en la solución.',
            'En Graph Labs reconstruyes el grafo de un ejercicio de la lista, ejecutas el método sobre él y comparas cada paso con lo que resolviste a mano. Es útil en clases y tutorías, al corregir ejercicios y en el estudio individual antes del examen.',
        ],
        principles: [
            {
                title: 'Fiel a la asignatura',
                description:
                    'Nombres, notación, tablas y orden de visita siguen lo que se enseña y se evalúa en clase, y no la versión genérica de una biblioteca.',
            },
            {
                title: 'Cada decisión justificada',
                description:
                    'Cada paso tiene un título, la explicación de lo ocurrido y el estado de las estructuras auxiliares en ese instante.',
            },
            {
                title: '100% en el navegador',
                description:
                    'Sin registro, sin servidor y sin base de datos. Funciona en el ordenador, la tableta y el móvil.',
            },
        ],
        pagesTitle: 'Páginas de la aplicación',
        pages: {
            studio: 'El corazón del proyecto: editor de grafos, selección del algoritmo y reproducción paso a paso de la ejecución.',
            algorithms:
                'Referencia teórica de cada método: idea central, invariante, requisitos, errores comunes y pseudocódigo.',
            about: 'El origen del proyecto, en la monitoría de Teoría de Grafos, e información sobre el autor.',
        },
    },
    quickStart: {
        description:
            'Todo uso del estudio sigue el mismo ciclo de cuatro etapas, reflejado en las tres pestañas del panel lateral: Construir, Ejecutar y Pasos.',
        steps: [
            {
                title: 'Construye el grafo',
                description:
                    'En la pestaña Construir, carga un grafo de ejemplo o dibuja desde cero: crea vértices haciendo clic en el lienzo y conéctalos con la herramienta de aristas.',
            },
            {
                title: 'Ajusta pesos y direcciones',
                description:
                    'Define el peso de cada arista (o déjala sin peso) y elige si es no dirigida o dirigida, en el lienzo o en la lista de aristas.',
            },
            {
                title: 'Elige el algoritmo',
                description:
                    'En la pestaña Ejecutar, selecciona el método y completa los parámetros que aparezcan: raíz, destino, fuente, sumidero o secuencia de visita.',
            },
            {
                title: 'Ejecuta y sigue el proceso',
                description:
                    'Haz clic en Ejecutar. La pestaña Pasos se abre sola en el primer paso; avanza manualmente o usa la reproducción automática.',
            },
        ],
        exampleTitle: 'Ejemplo guiado: camino mínimo con Dijkstra',
        exampleIntro: 'Un recorrido de dos minutos para conocer el estudio con un grafo listo:',
        exampleSteps: [
            `En la pestaña **Construir**, haz clic en **${presets['weighted-undirected'].name}**. El grafo se carga y se encuadra automáticamente.`,
            `Ve a **Ejecutar** y elige **${algorithms.dijkstra.name}**, en Caminos mínimos.`,
            'En Raíz / origen, selecciona `A`; en Vértice de destino, selecciona `F`.',
            `Haz clic en **Ejecutar ${algorithms.dijkstra.shortName}** y usa **Paso siguiente** para ver cómo se cierra cada vértice y se relaja cada arista tensa en la tabla *dist y pred*.`,
            'En el último paso, el camino mínimo `A → C → F`, de peso 11, aparece en morado, y la tarjeta de Conclusiones resume las distancias finales.',
        ],
        tryIt: 'Probar en el estudio',
        tip: `En la primera visita, el estudio ya se abre con la ${presets['weighted-undirected'].name} cargada. Después, siempre vuelve a abrirse con el último grafo en el que trabajaste.`,
    },
    anatomy: {
        description:
            'El estudio divide la pantalla en dos áreas: el lienzo, donde se dibuja y anima el grafo, y el panel lateral, donde están los formularios, el catálogo de algoritmos y la traza de la ejecución.',
        mockHint: 'Arrastra los vértices para reubicarlos...',
        mockTabs: ['Construir', 'Ejecutar', 'Pasos'],
        regions: [
            {
                title: 'Herramientas de edición',
                description:
                    'Seleccionar y mover, añadir vértice, conectar vértices y eliminar elemento.',
            },
            { title: 'Historial', description: 'Deshacer, rehacer y vaciar el grafo entero.' },
            {
                title: 'Dirección de las nuevas aristas',
                description:
                    'Define si las aristas creadas en el lienzo nacen no dirigidas o dirigidas.',
            },
            {
                title: 'Posición',
                description:
                    'Activa o desactiva la sugerencia automática y reorganiza el dibujo cuando lo pidas.',
            },
            {
                title: 'Sugerencia contextual',
                description:
                    'Explica cómo usar la herramienta activa. Aparece en pantallas a partir de 640 px.',
            },
            {
                title: 'Lienzo',
                description:
                    'Área de dibujo con cuadrícula de puntos, desplazamiento, zoom y resaltados de la ejecución.',
            },
            {
                title: 'Leyenda',
                description:
                    'Significado de cada color aplicado a vértices y aristas durante la simulación.',
            },
            {
                title: 'Zoom',
                description: 'Acercar, alejar y encuadrar el grafo entero en la pantalla.',
            },
            {
                title: 'Pestañas del panel',
                description:
                    'Alterna entre Construir, Ejecutar y Pasos, las tres etapas del flujo.',
            },
            {
                title: 'Contenido de la pestaña',
                description:
                    'Formularios del grafo, catálogo de algoritmos o la traza paso a paso.',
            },
        ],
        responsiveTitle: 'Diseño adaptable',
        responsiveText:
            'En pantallas anchas (a partir de 1024 px), el lienzo ocupa toda la altura a la izquierda y el panel queda fijo a la derecha, con su propio desplazamiento. En tabletas y móviles, el lienzo aparece arriba, con cerca de la mitad de la altura de la pantalla, y el panel justo debajo, con las pestañas fijas arriba mientras te desplazas.',
    },
    canvas: {
        description:
            'El lienzo es el área de dibujo del estudio. Ahí creas y organizas el grafo y, durante la simulación, sigues visualmente el estado de cada vértice y cada arista.',
        editingTitle: 'Herramientas de edición',
        editingIntro:
            'Solo hay una herramienta activa a la vez, resaltada en la barra superior. El cursor cambia de forma para indicar cuál está en uso, y una sugerencia junto a la barra explica qué hacer.',
        editingTools: {
            select: {
                name: 'Seleccionar y mover',
                description:
                    'Herramienta por defecto. Haz clic en un vértice o una arista para seleccionarlo, arrastra los vértices para reubicarlos y arrastra el fondo para mover la vista.',
            },
            node: {
                name: 'Añadir vértice',
                description:
                    'Cada clic en un punto vacío crea un vértice ahí. Las etiquetas siguen la secuencia A, B, C, ..., Z, A1, B1, ..., saltando siempre las que ya están en uso.',
            },
            edge: {
                name: 'Conectar vértices',
                description:
                    'Haz clic en el vértice de origen y luego en el de destino. Entre los dos clics, una línea discontinua sigue al cursor. Esc cancela.',
            },
            erase: {
                name: 'Eliminar elemento',
                description:
                    'Haz clic en un vértice o una arista para borrarlo. Eliminar un vértice elimina también todas las aristas unidas a él.',
            },
        },
        actionsTitle: 'Historial, dirección y posición',
        actionTools: {
            undo: {
                name: 'Deshacer',
                description: 'Revierte el último cambio del grafo. Guarda hasta 60 cambios.',
            },
            redo: { name: 'Rehacer', description: 'Vuelve a aplicar un cambio deshecho.' },
            clear: {
                name: 'Vaciar grafo',
                description: 'Borra todos los vértices y aristas. Se puede revertir con Deshacer.',
            },
            undirected: {
                name: 'Nuevas aristas no dirigidas',
                description: 'Las aristas creadas en el lienzo nacen no dirigidas (por defecto).',
            },
            directed: {
                name: 'Nuevas aristas dirigidas',
                description:
                    'Las aristas creadas en el lienzo nacen con flecha, del origen al destino.',
            },
            autoArrange: {
                name: 'Sugerencia de posición',
                description:
                    'Cuando está activada, cada nueva arista provoca un ajuste fino del dibujo. La preferencia se guarda.',
            },
            arrangeNow: {
                name: 'Reorganizar ahora',
                description: 'Aplica el ajuste de posición de inmediato, una sola vez.',
            },
        },
        autoArrangeTitle: 'Cómo funciona la sugerencia de posición',
        autoArrangeText:
            'El ajuste mueve los vértices poco a poco, sin perder de vista el dibujo original, para reducir cruces de aristas, vértices sobre aristas, superposiciones y ángulos muy cerrados. Actúa en grafos de 3 a 40 vértices y hasta 90 aristas, y no hace nada si el dibujo ya está limpio.',
        navigationTitle: 'Navegación y zoom',
        navigationText:
            'Arrastra el fondo para mover la vista y usa la rueda del ratón (o el gesto de pellizcar en el trackpad y en el móvil) para acercar y alejar, siempre centrado en el punto bajo el cursor. El zoom va del 30% al 260%. Los botones de la esquina inferior derecha ofrecen el mismo control:',
        viewTools: {
            zoomIn: {
                name: 'Acercar',
                description: 'Aumenta el zoom un 25%, manteniendo el centro.',
            },
            zoomOut: {
                name: 'Alejar',
                description: 'Reduce el zoom un 20%, manteniendo el centro.',
            },
            fit: {
                name: 'Encuadrar grafo',
                description:
                    'Ajusta el zoom y la posición para que el grafo entero quepa en la pantalla.',
            },
        },
        navigationNote:
            'Al cargar un grafo de ejemplo, se encuadra automáticamente. Las aristas paralelas entre el mismo par de vértices, como A → B y B → A, se dibujan curvas para no superponerse.',
        colorsTitle: 'Colores durante la ejecución',
        colorsIntro:
            'Una vez ejecutado un algoritmo, cada vértice y arista recibe un estado en cada paso. La leyenda de la esquina inferior izquierda del lienzo resume el significado de los colores:',
        states: {
            idle: {
                label: 'No explorado',
                description: 'Estado inicial: el algoritmo todavía no ha alcanzado el elemento.',
            },
            frontier: {
                label: 'Marcado',
                description:
                    'Alcanzado pero aún no procesado: está en la cola, la pila o la frontera.',
            },
            active: {
                label: 'En análisis',
                description:
                    'Elemento examinado en el paso actual. Los vértices en análisis laten para llamar la atención.',
            },
            done: {
                label: 'Explorado / en la solución',
                description:
                    'Procesamiento terminado o elemento aceptado en la solución (árbol, orden, emparejamiento).',
            },
            reject: {
                label: 'Descartado',
                description:
                    'Rechazado por el algoritmo, como una arista que formaría un ciclo. Las aristas descartadas se ven discontinuas.',
            },
            path: {
                label: 'Camino',
                description:
                    'Resultado resaltado al final: camino mínimo, camino aumentante o camino euleriano.',
            },
        },
        markersTitle: 'Marcas adicionales',
        markers: {
            start: {
                title: 'Anillo discontinuo en el color principal',
                description:
                    'Vértice de partida. La etiqueta encima indica RAÍZ o, en los algoritmos de flujo, FUENTE.',
            },
            end: {
                title: 'Anillo discontinuo morado',
                description: 'Vértice de llegada: DESTINO, o SUMIDERO en los algoritmos de flujo.',
            },
            nodeBadge: {
                title: 'Etiqueta bajo el vértice',
                description:
                    'Valor del vértice en el paso actual: TD/TF en la búsqueda en profundidad, nivel en la búsqueda en anchura, dist en Dijkstra, color en la coloración, s y t en el flujo.',
            },
            edgeLabel: {
                title: 'Rótulo de la arista',
                description:
                    'Muestra el peso. Durante la ejecución puede dar paso a otro valor, como flujo/capacidad en los algoritmos de flujo o el orden de recorrido en Fleury.',
            },
            group: {
                title: 'Contorno de color',
                description:
                    'Agrupa vértices del mismo conjunto: componentes fuertemente conexas en Kosaraju, árboles del bosque en Kruskal, clases de color en la coloración.',
            },
        },
    },
    build: {
        description:
            'Todo lo relacionado con la estructura del grafo: grafos de ejemplo, lista de vértices y lista de aristas. Cualquier cambio hecho aquí aparece en el lienzo al instante, y viceversa.',
        presetsTitle: 'Grafos de ejemplo',
        presetsText:
            'Los ejemplos reproducen casos usados en clase, cada uno pensado para resaltar el comportamiento de determinados algoritmos. Cargar un ejemplo sustituye el grafo actual (se puede deshacer), borra la raíz y el destino elegidos y encuadra el dibujo.',
        verticesTitle: 'Vértices',
        verticesText:
            'La tarjeta Vértices lista todos los vértices en orden alfabético, con el total en el encabezado. El botón **Nuevo** crea un vértice en el lienzo sin cambiar de herramienta; después solo tienes que arrastrarlo al lugar deseado.',
        verticesItems: [
            '**Renombrar:** edita la etiqueta directamente en el campo de texto, con hasta 6 caracteres. El orden alfabético de las etiquetas es el orden de visita por defecto de todos los algoritmos.',
            '**Seleccionar:** haz clic en el círculo con las iniciales o en el campo de texto para resaltar el vértice en el lienzo.',
            '**Eliminar:** el icono de papelera borra el vértice y todas las aristas incidentes a él.',
        ],
        edgesTitle: 'Aristas',
        edgesText:
            'El formulario de la parte superior de la tarjeta crea aristas con precisión, algo útil para grafos grandes o para copiar un ejercicio: elige los vértices **De** y **A**, indica el **Peso** y el **Tipo** (no dirigida o dirigida) y haz clic en Añadir arista. El encabezado muestra el total de aristas y cuántas hay de cada tipo.',
        edgeRules: [
            {
                title: 'Peso opcional',
                description:
                    'Un campo vacío crea una arista sin peso, que cuenta como 1 en los algoritmos ponderados. Acepta valores negativos y decimales con coma o punto.',
            },
            {
                title: 'Sin bucles',
                description: 'Una arista debe unir dos vértices distintos.',
            },
            {
                title: 'Sin aristas repetidas',
                description:
                    'No se pueden crear dos aristas iguales. Una arista no dirigida A - B ya conecta B con A, pero dos aristas dirigidas opuestas, A → B y B → A, sí están permitidas.',
            },
        ],
        editIntro: 'Cada arista de la lista se puede editar sin volver a crearla:',
        editItems: {
            weight: 'el campo numérico cambia el peso, y vaciarlo deja la arista sin peso;',
            direction: 'la insignia cambia la dirección con un clic:',
            select: 'hacer clic en las etiquetas selecciona la arista en el lienzo;',
            remove: 'la papelera elimina la arista.',
        },
        mixedTitle: 'Grafos mixtos',
        mixedText:
            'Cada arista guarda su propia orientación, así que un grafo puede mezclar aristas no dirigidas y dirigidas. Cuando ocurre, aparece un aviso en la tarjeta de aristas con dos atajos, **Todas dirigidas** y **Todas no dirigidas**, porque la mayoría de los algoritmos exige un único tipo.',
    },
    run: {
        description:
            'Aquí eliges el algoritmo, indicas los parámetros que pide y compruebas que el grafo cumple los requisitos antes de lanzar la simulación.',
        chooseTitle: 'Elección del algoritmo',
        chooseText:
            'La tarjeta Algoritmo agrupa los métodos por tema, en el orden de la asignatura. Cada opción muestra el nombre, la complejidad y un resumen de la estrategia. El algoritmo seleccionado queda resaltado y define el contenido de la tarjeta Parámetros justo debajo.',
        parametersTitle: 'Parámetros',
        parametersIntro:
            'El encabezado de la tarjeta repite el nombre y la complejidad del método, seguidos de los requisitos del grafo en forma de insignias. Los campos de vértice solo aparecen cuando el algoritmo los usa:',
        tableColumns: ['Campo', 'Algoritmos', 'Uso', 'Efecto'],
        required: 'obligatorio',
        optional: 'opcional',
        rows: [
            {
                field: 'Raíz / origen',
                when: 'Búsquedas en anchura y en profundidad, Prim, Dijkstra y Bellman-Ford',
                required: true,
                effect: 'Vértice desde el que parte la ejecución.',
            },
            {
                field: 'Vértice de destino',
                when: 'Dijkstra, Bellman-Ford y Floyd-Warshall',
                required: false,
                effect: 'Resalta en morado, en el último paso, el camino mínimo hasta él.',
            },
            {
                field: 'Raíz / origen (opcional)',
                when: 'Floyd-Warshall',
                required: false,
                effect: 'Junto con el destino, elige qué par de vértices tendrá el camino resaltado.',
            },
            {
                field: 'Fuente s y sumidero t',
                when: 'Ford-Fulkerson, Edmonds-Karp y Dinic',
                required: true,
                effect: 'Extremos de la red de flujo. Deben ser vértices distintos.',
            },
            {
                field: 'Vértice inicial',
                when: 'Fleury',
                required: false,
                effect: 'Si hay vértices de grado impar, el camino debe partir de uno de ellos.',
            },
        ],
        defaultsText:
            'Cuando todavía no se ha elegido un campo obligatorio, el estudio usa el primer vértice en orden alfabético (y, para el sumidero, el primero distinto de la fuente). Los vértices elegidos reciben un anillo discontinuo en el lienzo con la etiqueta RAÍZ, DESTINO, FUENTE o SUMIDERO.',
        orderTitle: 'Secuencia de visita',
        orderText:
            'Muchos algoritmos necesitan decidir qué vecino examinar primero. Por defecto, la decisión sigue el orden alfabético de las etiquetas, que es la convención usada en clase. Cuando el ejercicio pide otro orden, constrúyelo en **Secuencia de visita**:',
        orderItems: [
            'haz clic en los vértices en el orden deseado para añadirlos a la secuencia;',
            'el primer vértice elegido pasa a ser la raíz cuando no se define ninguna arriba (en los algoritmos de flujo, es el primer vecino que se prueba en la búsqueda);',
            'haz clic en un vértice de la secuencia para quitarlo;',
            'los vértices que queden fuera siguen en orden alfabético, después de los elegidos;',
            'el botón **Por defecto** vuelve al orden alfabético.',
        ],
        validationTitle: 'Validación antes de ejecutar',
        validationText:
            'Los requisitos se comprueban con cada cambio del grafo o de los parámetros. Si todo está bien, aparece una confirmación en verde; si no, cada problema se lista en rojo con la corrección sugerida y el botón Ejecutar queda desactivado.',
        sampleIssues: [
            'Kruskal trabaja sobre grafos no dirigidos: convierte todas las aristas en no dirigidas.',
            'La fuente s y el sumidero t deben ser vértices distintos.',
        ],
        requirementsMet: 'El grafo cumple los requisitos de este algoritmo.',
        tip: 'Al hacer clic en Ejecutar, el estudio calcula toda la ejecución de una vez, abre la pestaña Pasos en el primer paso y devuelve la herramienta del lienzo a Seleccionar y mover, para que ningún clic accidental cambie el grafo durante el análisis.',
    },
    steps: {
        description:
            'Tras la ejecución, la pestaña Pasos funciona como un reproductor: navegas por la simulación mientras el lienzo y las estructuras auxiliares muestran el estado exacto de cada iteración.',
        controlsTitle: 'Controles de reproducción',
        controlsIntro:
            'El encabezado indica el algoritmo y la posición actual (por ejemplo, Paso 4 de 23), con una barra de progreso justo debajo. Los controles son:',
        controls: {
            first: { name: 'Primer paso', description: 'Vuelve al estado inicial.' },
            previous: { name: 'Paso anterior', description: 'Retrocede una iteración.' },
            play: {
                name: 'Reproducir / pausar',
                description:
                    'Avanza solo al ritmo elegido. Al final, vuelve a empezar desde el primer paso.',
            },
            next: { name: 'Paso siguiente', description: 'Avanza una iteración.' },
            last: { name: 'Último paso', description: 'Salta al resultado final.' },
            clear: {
                name: 'Limpiar',
                description: 'Descarta la ejecución y devuelve el lienzo a sus colores originales.',
            },
        },
        speedText:
            'El control deslizante salta directamente a cualquier paso. Cualquier navegación manual pausa la reproducción automática. Las velocidades disponibles son:',
        perStep: (interval) => `${interval} por paso`,
        contentTitle: 'Qué muestra cada paso',
        contentText:
            'La tarjeta principal muestra el **título** de la decisión tomada (por ejemplo, “Arista tensa (A, C): relajada”), la **justificación** con los valores implicados y, cuando tiene sentido, **métricas** como el orden de visita, la iteración actual o el valor del flujo. Debajo aparecen las estructuras auxiliares del algoritmo.',
        structures: {
            queue: {
                title: 'Cola',
                description: 'El primer elemento, el siguiente en salir, aparece resaltado.',
            },
            stack: {
                title: 'Pila',
                description: 'La cima de la pila, el último elemento, aparece resaltada.',
            },
            set: {
                title: 'Conjunto',
                description: 'Elementos sin orden de salida, como los vértices aún no cerrados.',
            },
        },
        tablesText:
            'Las **tablas** reproducen las de la pizarra: dist y pred, tiempos de descubrimiento y finalización, matrices de Floyd-Warshall, flujo y capacidades residuales, entre otras. Las filas de color indican el papel de cada entrada en el paso actual:',
        sampleTable: { title: 'dist y pred', columns: ['Vértice', 'dist', 'pred'] },
        emphasis: [
            { label: 'Azul:', description: 'entrada modificada o examinada en este paso.' },
            { label: 'Verde:', description: 'valor definitivo o elemento aceptado.' },
            { label: 'Rojo:', description: 'elemento rechazado.' },
        ],
        conclusionsTitle: 'Conclusiones',
        conclusionsText:
            'En el último paso aparece la tarjeta verde de **Conclusiones**, que interpreta el resultado: distancias finales y camino recuperado, peso total del árbol de expansión, valor del flujo máximo y el corte correspondiente, componentes encontradas, orden topológico, número de colores usados. Es el resumen para comparar con tu respuesta.',
        conclusionBadges: [
            'dist final',
            'camino mínimo',
            'peso del AEM',
            'flujo máximo',
            'orden topológico',
            'número de colores',
        ],
        discardedTitle: 'Cuándo se descarta la ejecución',
        discardedText:
            'La ejecución queda vinculada al grafo y al algoritmo con los que se generó. Crear, eliminar o renombrar vértices, cambiar aristas, pesos o direcciones, o cambiar de algoritmo descarta la traza automáticamente, y hay que volver a ejecutar. Arrastrar vértices para reorganizar el dibujo no afecta a la ejecución.',
    },
    catalog: {
        description: (count) =>
            `Los ${count} métodos disponibles en el estudio, en el orden de la asignatura. Para la idea central, el invariante, los errores comunes y el pseudocódigo de cada uno, abre la página de referencia.`,
        parameters: 'Parámetros:',
        summaries: {
            flow: 'Fuente s y sumidero t',
            originWithOptionalTarget: 'Origen; destino opcional',
            optionalOriginAndTarget: 'Origen y destino opcionales',
            root: 'Raíz',
            optionalStart: 'Vértice inicial opcional',
            none: 'Ninguno',
        },
    },
    shortcuts: {
        description:
            'Los atajos funcionan en cualquier pestaña del estudio y agilizan la edición del grafo.',
        or: 'o',
        actions: {
            undo: 'Deshace el último cambio del grafo.',
            redo: 'Rehace el cambio deshecho.',
            remove: 'Elimina el vértice o la arista seleccionados.',
            cancel: 'Cancela la selección o la arista que se está creando.',
        },
        note: 'Mientras escribes en un campo de texto o eliges una opción de una lista, los atajos se desactivan, para que borrar un carácter nunca elimine un vértice.',
    },
    storage: {
        description:
            'Graph Labs no tiene servidor, base de datos ni registro. Todo el procesamiento ocurre en tu navegador y nada de lo que dibujas se envía a ningún sitio.',
        savedInBrowser: 'Guardado en el navegador',
        sessionOnly: 'Solo en esta sesión',
        items: {
            graph: {
                title: 'Grafo actual',
                description:
                    'Vértices, posiciones, aristas, pesos y direcciones se guardan con cada cambio. Al volver al estudio, el grafo reaparece exactamente como lo dejaste.',
            },
            autoArrange: {
                title: 'Sugerencia de posición',
                description: 'Recuerda si prefieres el ajuste automático activado o desactivado.',
            },
            theme: {
                title: 'Tema claro u oscuro',
                description:
                    'En la primera visita sigue la preferencia del sistema operativo. Después, vale la elección hecha con el botón del encabezado.',
            },
            language: {
                title: 'Idioma',
                description:
                    'El inglés es el idioma por defecto. Cuando eliges otro idioma en el encabezado, el sitio se abre en él en tus próximas visitas.',
            },
            history: {
                title: 'Historial y ejecución',
                description:
                    'El historial de deshacer y rehacer, el algoritmo elegido y la traza de la ejecución se descartan al recargar la página.',
            },
        },
        warningTitle: 'Un grafo por navegador',
        warningText:
            'El estudio solo guarda el grafo que estás editando, y solo en el navegador y el dispositivo donde se creó. Borrar los datos del sitio, usar una ventana privada o cargar un grafo de ejemplo sustituye el grafo guardado.',
    },
    faq: {
        description: 'Respuestas rápidas a las dudas más comunes sobre el uso del estudio.',
        items: [
            {
                question: '¿Por qué el botón Ejecutar está desactivado?',
                answer: 'El grafo o los parámetros no cumplen los requisitos del algoritmo elegido. Los problemas aparecen listados en rojo justo encima del botón, cada uno con la corrección sugerida, como convertir las aristas en dirigidas o elegir una fuente distinta del sumidero.',
            },
            {
                question: 'El resultado es distinto del que obtuve en papel. ¿Qué puede ser?',
                answer: 'La mayoría de las veces es el orden de visita. Cuando hay empate, el estudio examina los vecinos en orden alfabético de sus etiquetas. Si el ejercicio usa otra convención, construye el mismo orden en Secuencia de visita, en la pestaña Ejecutar. Revisa también la raíz elegida y si todas las aristas tienen el tipo y el peso correctos.',
            },
            {
                question: '¿Qué pasa con las aristas sin peso?',
                answer: 'Cuentan como peso 1 en los algoritmos que usan pesos o capacidades. Las búsquedas, Kosaraju, Fleury, el emparejamiento y la coloración ignoran los pesos.',
            },
            {
                question: '¿Puedo usar pesos negativos?',
                answer: 'Sí. Bellman-Ford y Floyd-Warshall aceptan aristas de peso negativo e indican cuándo hay un ciclo de peso negativo. Dijkstra exige pesos no negativos y los algoritmos de flujo exigen capacidades positivas; en esos casos la validación avisa antes de la ejecución.',
            },
            {
                question: '¿El grafo puede tener bucles o aristas múltiples?',
                answer: 'No. Los bucles (aristas de un vértice a sí mismo) no están permitidos, y no se puede repetir una arista entre el mismo par de vértices. La excepción son dos aristas dirigidas en sentidos opuestos, como A → B y B → A, que están permitidas y se dibujan curvas.',
            },
            {
                question: 'Cambié el grafo y la ejecución desapareció. ¿Es un error?',
                answer: 'No. La traza siempre corresponde al grafo con el que se generó. Cualquier cambio estructural, como vértices, aristas, etiquetas, pesos o direcciones, o cambiar de algoritmo descarta la ejecución para no mostrar pasos que ya no son válidos. Basta con volver a ejecutar. Solo arrastrar vértices no descarta nada.',
            },
            {
                question: 'Perdí el grafo que estaba construyendo. ¿Puedo recuperarlo?',
                answer: 'Si la página sigue abierta, usa Deshacer (Ctrl + Z): el historial guarda los últimos 60 cambios, incluidos Vaciar grafo y cargar un ejemplo. Al recargar la página se pierde el historial, pero el último estado del grafo sigue guardado en el navegador.',
            },
            {
                question: '¿Funciona en el móvil?',
                answer: 'Sí. El lienzo acepta toques para crear y mover vértices, arrastrar con un dedo para mover la vista y pellizcar con dos dedos para el zoom. El panel lateral aparece debajo del lienzo, con las pestañas fijas arriba.',
            },
        ],
    },
};
