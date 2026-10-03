import { algorithms } from './algorithms';
import { presets } from './catalog';

export const docs = {
    hero: {
        eyebrow: 'Documentation',
        title: 'How Graph Labs works',
        description:
            'A complete guide to the studio: how to build the graph, configure and run each algorithm, read the step-by-step trace and make the most of the features that speed up checking exercises.',
        openStudio: 'Open the studio',
        viewPseudocode: 'View pseudocode',
    },
    toc: {
        label: 'On this page',
        ariaLabel: 'Documentation sections',
    },
    callouts: {
        info: 'Note',
        tip: 'Tip',
        warning: 'Heads up',
    },
    sections: {
        overview: 'Overview',
        quickStart: 'Getting started',
        anatomy: 'Studio layout',
        canvas: 'Canvas and tools',
        build: 'Build tab',
        run: 'Run tab',
        steps: 'Steps tab',
        catalog: 'Algorithm catalog',
        shortcuts: 'Keyboard shortcuts',
        storage: 'Data and preferences',
        faq: 'FAQ',
    },
    overview: {
        description:
            'Graph Labs is a visual graph theory lab. You draw the graph, pick one of the classic algorithms and follow the run iteration by iteration, with the same tables, queues and notation used in class.',
        numbers: {
            algorithms: 'algorithms implemented',
            topics: 'course topics',
            presets: 'sample graphs',
        },
        problemTitle: 'The problem it solves',
        problemParagraphs: [
            'Pseudocode on paper hides exactly the part that matters most for learning: what happens at each iteration. Reading that Dijkstra\'s algorithm "selects the unclosed vertex with the smallest label" is very different from watching that vertex get picked, the distance table get updated and the edge join the solution.',
            'In Graph Labs you rebuild the graph from a homework exercise, run the method on it and compare every step with what you solved by hand. It is useful in lectures and tutoring sessions, when checking exercises and for self-study before an exam.',
        ],
        principles: [
            {
                title: 'Faithful to the course',
                description:
                    'Names, notation, tables and visiting order follow what is taught and tested in class, not the generic version of a library.',
            },
            {
                title: 'Every decision explained',
                description:
                    'Each step has a title, an explanation of what happened and the state of the auxiliary structures at that moment.',
            },
            {
                title: '100% in the browser',
                description:
                    'No sign-up, no server and no database. It works on desktop, tablet and phone.',
            },
        ],
        pagesTitle: 'Application pages',
        pages: {
            studio: 'The heart of the project: graph editor, algorithm selection and step-by-step playback of the run.',
            algorithms:
                'Theory reference for each method: core idea, invariant, requirements, common pitfalls and pseudocode.',
            about: 'Where the project came from, in the Graph Theory teaching assistantship, and information about the author.',
        },
    },
    quickStart: {
        description:
            'Every use of the studio follows the same four-stage cycle, mirrored by the three tabs of the side panel: Build, Run and Steps.',
        steps: [
            {
                title: 'Build the graph',
                description:
                    'In the Build tab, load a sample graph or draw from scratch: create vertices by clicking on the canvas and connect them with the edge tool.',
            },
            {
                title: 'Set weights and directions',
                description:
                    'Set the weight of each edge (or leave it without one) and choose whether it is undirected or directed, on the canvas or in the edge list.',
            },
            {
                title: 'Choose the algorithm',
                description:
                    'In the Run tab, select the method and fill in the parameters that show up: root, target, source, sink or visit sequence.',
            },
            {
                title: 'Run and follow along',
                description:
                    'Click Run. The Steps tab opens on its own at the first step; move forward manually or use automatic playback.',
            },
        ],
        exampleTitle: "Guided example: shortest path with Dijkstra's algorithm",
        exampleIntro: 'A two-minute walkthrough to get to know the studio with a ready-made graph:',
        exampleSteps: [
            `In the **Build** tab, click **${presets['weighted-undirected'].name}**. The graph is loaded and framed automatically.`,
            `Go to **Run** and choose **${algorithms.dijkstra.name}**, under Shortest paths.`,
            'In Root / origin, select `A`; in Target vertex, select `F`.',
            `Click **Run ${algorithms.dijkstra.shortName}** and use **Next step** to watch each vertex get closed and each tense edge get relaxed in the *dist and pred* table.`,
            'At the last step, the shortest path `A → C → F`, with weight 11, turns purple, and the Conclusions card sums up the final distances.',
        ],
        tryIt: 'Try it in the studio',
        tip: `On your first visit the studio opens with the ${presets['weighted-undirected'].name} already loaded. After that, it always reopens with the last graph you worked on.`,
    },
    anatomy: {
        description:
            'The studio splits the screen into two areas: the canvas, where the graph is drawn and animated, and the side panel, which holds the forms, the algorithm catalog and the trace of the run.',
        mockHint: 'Drag vertices to reposition them...',
        mockTabs: ['Build', 'Run', 'Steps'],
        regions: [
            {
                title: 'Editing tools',
                description: 'Select and move, add vertex, connect vertices and remove element.',
            },
            { title: 'History', description: 'Undo, redo and clear the whole graph.' },
            {
                title: 'Direction of new edges',
                description:
                    'Sets whether edges created on the canvas start undirected or directed.',
            },
            {
                title: 'Layout',
                description:
                    'Turns the automatic suggestion on or off and rearranges the drawing on demand.',
            },
            {
                title: 'Contextual hint',
                description:
                    'Explains how to use the active tool. Shown on screens from 640 px wide.',
            },
            {
                title: 'Canvas',
                description: 'Drawing area with a dotted grid, panning, zoom and run highlights.',
            },
            {
                title: 'Legend',
                description:
                    'Meaning of each color applied to vertices and edges during the simulation.',
            },
            { title: 'Zoom', description: 'Zoom in, zoom out and fit the whole graph on screen.' },
            {
                title: 'Panel tabs',
                description: 'Switches between Build, Run and Steps, the three stages of the flow.',
            },
            {
                title: 'Tab content',
                description: 'Graph forms, algorithm catalog or the step-by-step trace.',
            },
        ],
        responsiveTitle: 'Responsive layout',
        responsiveText:
            'On wide screens (from 1024 px), the canvas takes the full height on the left and the panel stays fixed on the right, with its own scrolling. On tablets and phones, the canvas sits on top, at about half the screen height, with the panel right below and its tabs pinned to the top while you scroll.',
    },
    canvas: {
        description:
            'The canvas is the drawing area of the studio. It is where you create and arrange the graph and, during the simulation, visually follow the state of every vertex and edge.',
        editingTitle: 'Editing tools',
        editingIntro:
            'Only one tool is active at a time, highlighted in the top bar. The cursor changes shape to show which one is in use, and a hint next to the bar explains what to do.',
        editingTools: {
            select: {
                name: 'Select and move',
                description:
                    'The default tool. Click a vertex or an edge to select it, drag vertices to reposition them and drag the background to move the view.',
            },
            node: {
                name: 'Add vertex',
                description:
                    'Each click on an empty spot creates a vertex there. Labels follow the sequence A, B, C, ..., Z, A1, B1, ..., always skipping the ones already in use.',
            },
            edge: {
                name: 'Connect vertices',
                description:
                    'Click the source vertex and then the target. Between the two clicks, a dashed line follows the cursor. Esc cancels.',
            },
            erase: {
                name: 'Remove element',
                description:
                    'Click a vertex or an edge to delete it. Removing a vertex also removes every edge attached to it.',
            },
        },
        actionsTitle: 'History, direction and layout',
        actionTools: {
            undo: {
                name: 'Undo',
                description: 'Reverts the last change to the graph. Keeps up to 60 changes.',
            },
            redo: { name: 'Redo', description: 'Reapplies a change that was undone.' },
            clear: {
                name: 'Clear graph',
                description: 'Deletes every vertex and edge. It can be reverted with Undo.',
            },
            undirected: {
                name: 'New edges are undirected',
                description: 'Edges created on the canvas start undirected (default).',
            },
            directed: {
                name: 'New edges are directed',
                description:
                    'Edges created on the canvas start with an arrow, from source to target.',
            },
            autoArrange: {
                name: 'Layout suggestion',
                description:
                    'When on, each new edge triggers a light adjustment of the drawing. The preference is saved.',
            },
            arrangeNow: {
                name: 'Rearrange now',
                description: 'Applies the layout adjustment right away, just once.',
            },
        },
        autoArrangeTitle: 'How the layout suggestion works',
        autoArrangeText:
            'The adjustment moves vertices a little at a time, without losing sight of the original drawing, to reduce edge crossings, vertices sitting on edges, overlaps and very tight angles. It works on graphs with 3 to 40 vertices and up to 90 edges, and does nothing if the drawing is already clean.',
        navigationTitle: 'Navigation and zoom',
        navigationText:
            'Drag the background to move the view and use the mouse wheel (or a pinch gesture on a trackpad or phone) to zoom in and out, always centered on the point under the cursor. Zoom ranges from 30% to 260%. The buttons in the bottom-right corner offer the same control:',
        viewTools: {
            zoomIn: {
                name: 'Zoom in',
                description: 'Increases the zoom by 25%, keeping the center.',
            },
            zoomOut: {
                name: 'Zoom out',
                description: 'Decreases the zoom by 20%, keeping the center.',
            },
            fit: {
                name: 'Fit graph',
                description: 'Adjusts zoom and position so the whole graph fits on screen.',
            },
        },
        navigationNote:
            'When a sample graph is loaded, it is framed automatically. Parallel edges between the same pair of vertices, such as A → B and B → A, are drawn curved so they do not overlap.',
        colorsTitle: 'Colors during a run',
        colorsIntro:
            'Once an algorithm runs, every vertex and edge gets a state at each step. The legend in the bottom-left corner of the canvas sums up what the colors mean:',
        states: {
            idle: {
                label: 'Unexplored',
                description: 'Initial state: the algorithm has not reached the element yet.',
            },
            frontier: {
                label: 'Marked',
                description:
                    'Reached but not processed yet: it is in the queue, the stack or the frontier.',
            },
            active: {
                label: 'Under analysis',
                description:
                    'Element examined in the current step. Vertices under analysis pulse to draw attention.',
            },
            done: {
                label: 'Explored / in solution',
                description:
                    'Processing finished or element accepted into the solution (tree, order, matching).',
            },
            reject: {
                label: 'Discarded',
                description:
                    'Rejected by the algorithm, such as an edge that would form a cycle. Discarded edges are dashed.',
            },
            path: {
                label: 'Path',
                description:
                    'Result highlighted at the end: shortest path, augmenting path or Eulerian trail.',
            },
        },
        markersTitle: 'Extra markings',
        markers: {
            start: {
                title: 'Dashed ring in the main color',
                description:
                    'Starting vertex. The label above it reads ROOT or, in flow algorithms, SOURCE.',
            },
            end: {
                title: 'Purple dashed ring',
                description: 'Ending vertex: TARGET, or SINK in flow algorithms.',
            },
            nodeBadge: {
                title: 'Badge under the vertex',
                description:
                    'Value of the vertex at the current step: d/f in depth-first search, level in breadth-first search, dist in Dijkstra, color in coloring, s and t in flow.',
            },
            edgeLabel: {
                title: 'Edge label',
                description:
                    "Shows the weight. During a run it may give way to another value, such as flow/capacity in flow algorithms or the traversal order in Fleury's algorithm.",
            },
            group: {
                title: 'Colored outline',
                description:
                    'Groups vertices of the same set: strongly connected components in Kosaraju, trees of the forest in Kruskal, color classes in coloring.',
            },
        },
    },
    build: {
        description:
            'Everything about the structure of the graph: sample graphs, the vertex list and the edge list. Any change made here shows up on the canvas instantly, and vice versa.',
        presetsTitle: 'Sample graphs',
        presetsText:
            'The samples reproduce examples used in class, each one designed to highlight the behavior of specific algorithms. Loading a sample replaces the current graph (you can undo it), clears the chosen root and target and frames the drawing.',
        verticesTitle: 'Vertices',
        verticesText:
            'The Vertices card lists every vertex in alphabetical order, with the total count in the header. The **New** button creates a vertex on the canvas without switching tools; then just drag it where you want it.',
        verticesItems: [
            '**Rename:** edit the label directly in the text field, up to 6 characters. The alphabetical order of the labels is the default visit order of every algorithm.',
            '**Select:** click the circle with the initials or the text field to highlight the vertex on the canvas.',
            '**Remove:** the trash icon deletes the vertex and every edge incident to it.',
        ],
        edgesTitle: 'Edges',
        edgesText:
            'The form at the top of the card creates edges precisely, which helps with large graphs or when copying an exercise: choose the **From** and **To** vertices, enter the **Weight** and the **Type** (undirected or directed) and click Add edge. The header shows the total number of edges and how many there are of each type.',
        edgeRules: [
            {
                title: 'Optional weight',
                description:
                    'An empty field creates an unweighted edge, which counts as 1 in weighted algorithms. Negative values and decimals with a comma or a dot are accepted.',
            },
            {
                title: 'No loops',
                description: 'An edge must connect two different vertices.',
            },
            {
                title: 'No repeated edges',
                description:
                    'Two identical edges cannot be created. An undirected edge A - B already connects B to A, but two opposite directed edges, A → B and B → A, are allowed.',
            },
        ],
        editIntro: 'Each edge in the list can be edited without being recreated:',
        editItems: {
            weight: 'the numeric field changes the weight, and clearing it leaves the edge unweighted;',
            direction: 'the badge toggles the direction with one click:',
            select: 'clicking the labels selects the edge on the canvas;',
            remove: 'the trash icon removes the edge.',
        },
        mixedTitle: 'Mixed graphs',
        mixedText:
            'Each edge keeps its own direction, so a graph can mix undirected and directed edges. When that happens, a warning shows up in the edge card with two shortcuts, **All directed** and **All undirected**, because most algorithms require a single type.',
    },
    run: {
        description:
            'Here you choose the algorithm, provide the parameters it asks for and check that the graph meets the requirements before running the simulation.',
        chooseTitle: 'Choosing the algorithm',
        chooseText:
            'The Algorithm card groups the methods by topic, in course order. Each option shows the name, the complexity and a summary of the strategy. The selected algorithm is highlighted and defines the content of the Parameters card right below.',
        parametersTitle: 'Parameters',
        parametersIntro:
            'The card header repeats the name and complexity of the method, followed by the graph requirements as badges. Vertex fields only appear when the algorithm uses them:',
        tableColumns: ['Field', 'Algorithms', 'Usage', 'Effect'],
        required: 'required',
        optional: 'optional',
        rows: [
            {
                field: 'Root / origin',
                when: 'Breadth-first and depth-first search, Prim, Dijkstra and Bellman-Ford',
                required: true,
                effect: 'Vertex where the run starts.',
            },
            {
                field: 'Target vertex',
                when: 'Dijkstra, Bellman-Ford and Floyd-Warshall',
                required: false,
                effect: 'Highlights in purple, at the last step, the shortest path to it.',
            },
            {
                field: 'Root / origin (optional)',
                when: 'Floyd-Warshall',
                required: false,
                effect: 'Together with the target, picks which pair of vertices gets its path highlighted.',
            },
            {
                field: 'Source s and sink t',
                when: 'Ford-Fulkerson, Edmonds-Karp and Dinic',
                required: true,
                effect: 'Endpoints of the flow network. They must be different vertices.',
            },
            {
                field: 'Starting vertex',
                when: 'Fleury',
                required: false,
                effect: 'If there are vertices of odd degree, the trail must start at one of them.',
            },
        ],
        defaultsText:
            'When a required field has not been chosen yet, the studio uses the first vertex in alphabetical order (and, for the sink, the first one different from the source). The chosen vertices get a dashed ring on the canvas with the label ROOT, TARGET, SOURCE or SINK.',
        orderTitle: 'Visit sequence',
        orderText:
            'Many algorithms need to decide which neighbor to examine first. By default the decision follows the alphabetical order of the labels, which is the convention used in class. When the exercise asks for another order, build it in **Visit sequence**:',
        orderItems: [
            'click the vertices in the desired order to add them to the sequence;',
            'the first vertex chosen becomes the root when none is set above (in flow algorithms, it is the first neighbor tried in the search);',
            'click a vertex in the sequence to take it out;',
            'vertices left out follow in alphabetical order, after the chosen ones;',
            'the **Default** button goes back to alphabetical order.',
        ],
        validationTitle: 'Validation before running',
        validationText:
            'Requirements are checked on every change to the graph or the parameters. If everything is fine, a green confirmation appears; otherwise, each problem is listed in red with the suggested fix, and the Run button is disabled.',
        sampleIssues: [
            'Kruskal works on undirected graphs: convert every edge to undirected.',
            'The source s and the sink t must be different vertices.',
        ],
        requirementsMet: 'The graph meets the requirements of this algorithm.',
        tip: 'When you click Run, the studio computes the whole run at once, opens the Steps tab at the first step and switches the canvas tool back to Select and move, so no accidental click changes the graph during the analysis.',
    },
    steps: {
        description:
            'After the run, the Steps tab works like a player: you move through the simulation while the canvas and the auxiliary structures show the exact state of each iteration.',
        controlsTitle: 'Playback controls',
        controlsIntro:
            'The header shows the algorithm and the current position (for example, Step 4 of 23), with a progress bar right below. The controls are:',
        controls: {
            first: { name: 'First step', description: 'Goes back to the initial state.' },
            previous: { name: 'Previous step', description: 'Goes back one iteration.' },
            play: {
                name: 'Play / pause',
                description:
                    'Moves forward on its own at the chosen pace. At the end, it restarts from the first step.',
            },
            next: { name: 'Next step', description: 'Moves forward one iteration.' },
            last: { name: 'Last step', description: 'Jumps to the final result.' },
            clear: {
                name: 'Clear',
                description: 'Discards the run and restores the original canvas colors.',
            },
        },
        speedText:
            'The slider jumps straight to any step. Any manual navigation pauses automatic playback. The available speeds are:',
        perStep: (interval: string) => `${interval} per step`,
        contentTitle: 'What each step shows',
        contentText:
            'The main card shows the **title** of the decision taken (for example, "Tense edge (A, C): relaxed"), the **reasoning** with the values involved and, when it makes sense, **metrics** such as the visit order, the current iteration or the flow value. The algorithm’s auxiliary structures appear below it.',
        structures: {
            queue: {
                title: 'Queue',
                description: 'The first element, the next one to leave, is highlighted.',
            },
            stack: {
                title: 'Stack',
                description: 'The top of the stack, the last element, is highlighted.',
            },
            set: {
                title: 'Set',
                description: 'Elements with no exit order, such as the vertices not yet closed.',
            },
        },
        tablesText:
            'The **tables** reproduce the ones on the board: dist and pred, discovery and finish times, Floyd-Warshall matrices, flow and residual capacities, among others. Colored rows show the role of each entry at the current step:',
        sampleTable: { title: 'dist and pred', columns: ['Vertex', 'dist', 'pred'] },
        emphasis: [
            { label: 'Blue:', description: 'entry changed or examined in this step.' },
            { label: 'Green:', description: 'final value or accepted element.' },
            { label: 'Red:', description: 'rejected element.' },
        ],
        conclusionsTitle: 'Conclusions',
        conclusionsText:
            'At the last step the green **Conclusions** card appears and interprets the result: final distances and the recovered path, total weight of the spanning tree, maximum flow value and the matching cut, components found, topological order, number of colors used. It is the summary to compare with your answer.',
        conclusionBadges: [
            'final dist',
            'shortest path',
            'MST weight',
            'maximum flow',
            'topological order',
            'number of colors',
        ],
        discardedTitle: 'When the run is discarded',
        discardedText:
            'A run is tied to the graph and the algorithm it was generated for. Creating, removing or renaming vertices, changing edges, weights or directions, or switching algorithms discards the trace automatically, and you need to run it again. Dragging vertices to rearrange the drawing does not affect the run.',
    },
    catalog: {
        description: (count: number) =>
            `The ${count} methods available in the studio, in course order. For the core idea, the invariant, the common pitfalls and the pseudocode of each one, open the reference page.`,
        parameters: 'Parameters:',
        summaries: {
            flow: 'Source s and sink t',
            originWithOptionalTarget: 'Origin; optional target',
            optionalOriginAndTarget: 'Optional origin and target',
            root: 'Root',
            optionalStart: 'Optional starting vertex',
            none: 'None',
        },
    },
    shortcuts: {
        description: 'Shortcuts work in any tab of the studio and speed up graph editing.',
        or: 'or',
        actions: {
            undo: 'Undoes the last change to the graph.',
            redo: 'Redoes the change that was undone.',
            remove: 'Removes the selected vertex or edge.',
            cancel: 'Cancels the selection or the edge being created.',
        },
        note: 'While you type in a text field or pick an option from a list, the shortcuts are turned off, so deleting a character never removes a vertex.',
    },
    storage: {
        description:
            'Graph Labs has no server, no database and no sign-up. All the processing happens in your browser and nothing you draw is sent anywhere.',
        savedInBrowser: 'Saved in the browser',
        sessionOnly: 'This session only',
        items: {
            graph: {
                title: 'Current graph',
                description:
                    'Vertices, positions, edges, weights and directions are saved on every change. When you return to the studio, the graph comes back exactly as you left it.',
            },
            autoArrange: {
                title: 'Layout suggestion',
                description: 'Remembers whether you prefer the automatic adjustment on or off.',
            },
            theme: {
                title: 'Light or dark theme',
                description:
                    'On the first visit it follows the operating system preference. After that, the choice made with the header button applies.',
            },
            language: {
                title: 'Language',
                description:
                    'English is the default. Once you choose another language in the header, the site opens in it on your next visits.',
            },
            history: {
                title: 'History and run',
                description:
                    'The undo and redo history, the chosen algorithm and the trace of the run are discarded when the page is reloaded.',
            },
        },
        warningTitle: 'One graph per browser',
        warningText:
            'The studio only keeps the graph being edited, and only in the browser and device where it was created. Clearing site data, using a private window or loading a sample graph replaces the saved graph.',
    },
    faq: {
        description: 'Quick answers to the most common questions about using the studio.',
        items: [
            {
                question: 'Why is the Run button disabled?',
                answer: 'The graph or the parameters do not meet the requirements of the chosen algorithm. The problems are listed in red right above the button, each with the suggested fix, such as converting the edges to directed or choosing a source different from the sink.',
            },
            {
                question: 'The result differs from what I did on paper. What could it be?',
                answer: 'Most of the time it is the visit order. On ties, the studio examines neighbors in alphabetical order of their labels. If the exercise uses another convention, build the same order in Visit sequence, in the Run tab. Also check the chosen root and whether every edge has the right type and weight.',
            },
            {
                question: 'What happens with unweighted edges?',
                answer: 'They count as weight 1 in algorithms that use weights or capacities. Searches, Kosaraju, Fleury, matching and coloring ignore weights.',
            },
            {
                question: 'Can I use negative weights?',
                answer: 'Yes. Bellman-Ford and Floyd-Warshall accept negative-weight edges and report when there is a negative-weight cycle. Dijkstra requires non-negative weights, and the flow algorithms require positive capacities; in those cases validation warns you before the run.',
            },
            {
                question: 'Can the graph have loops or multiple edges?',
                answer: 'No. Loops (edges from a vertex to itself) are not supported, and an edge cannot be repeated between the same pair of vertices. The exception is two directed edges in opposite directions, such as A → B and B → A, which are allowed and drawn curved.',
            },
            {
                question: 'I changed the graph and the run disappeared. Is that a bug?',
                answer: 'No. The trace always matches the graph it was generated for. Any structural change, such as vertices, edges, labels, weights or directions, or switching algorithms discards the run to avoid showing steps that are no longer valid. Just run it again. Only dragging vertices discards nothing.',
            },
            {
                question: 'I lost the graph I was building. Can I get it back?',
                answer: 'If the page is still open, use Undo (Ctrl + Z): the history keeps the last 60 changes, including Clear graph and loading a sample. After reloading the page the history is lost, but the latest state of the graph is still saved in the browser.',
            },
            {
                question: 'Does it work on a phone?',
                answer: 'Yes. The canvas accepts touch to create and move vertices, one-finger drag to move the view and two-finger pinch to zoom. The side panel appears below the canvas, with its tabs pinned to the top.',
            },
        ],
    },
};
