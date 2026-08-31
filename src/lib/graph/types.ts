export type NodeId = string;

export interface GraphNode {
    id: NodeId;
    label: string;
    x: number;
    y: number;
}

export interface GraphEdge {
    id: string;
    source: NodeId;
    target: NodeId;
    weight: number;
    directed: boolean;
}

export interface Graph {
    nodes: GraphNode[];
    edges: GraphEdge[];
}

export type ElementState = 'idle' | 'frontier' | 'active' | 'done' | 'reject' | 'path';

export interface TraceColumn {
    key: string;
    label: string;
}

export interface TraceRow {
    key: string;
    cells: Record<string, string>;
    emphasis?: 'active' | 'done' | 'reject';
}

export interface TraceTable {
    id: string;
    title: string;
    columns: TraceColumn[];
    rows: TraceRow[];
}

export interface TraceList {
    id: string;
    title: string;
    items: string[];
    variant?: 'queue' | 'stack' | 'set';
}

export interface TraceMetric {
    label: string;
    value: string;
}

export interface AlgorithmStep {
    title: string;
    description: string;
    nodeStates: Record<NodeId, ElementState>;
    edgeStates: Record<string, ElementState>;
    nodeBadges?: Record<NodeId, string>;
    edgeBadges?: Record<string, string>;
    nodeGroups?: Record<NodeId, number>;
    tables?: TraceTable[];
    lists?: TraceList[];
    metrics?: TraceMetric[];
}

export interface AlgorithmTrace {
    steps: AlgorithmStep[];
    conclusions: string[];
}

export interface AlgorithmContext {
    graph: Graph;
    startId: NodeId | null;
    endId: NodeId | null;
}

export type AlgorithmCategory =
    'Percursos' | 'Conectividade' | 'Árvore geradora mínima' | 'Caminhos mínimos' | 'Fluxo máximo';

export interface AlgorithmDefinition {
    id: string;
    name: string;
    shortName: string;
    category: AlgorithmCategory;
    tagline: string;
    complexity: string;
    needsStart: boolean;
    needsEnd: boolean;
    constraints: string[];
    validate: (context: AlgorithmContext) => string[];
    run: (context: AlgorithmContext) => AlgorithmTrace;
}
