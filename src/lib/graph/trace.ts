import { idleStates } from './helpers';
import type {
    AlgorithmStep,
    AlgorithmTrace,
    ElementState,
    Graph,
    NodeId,
    TraceList,
    TraceMetric,
    TraceTable,
} from './types';

export interface StepPayload {
    title: string;
    description: string;
    tables?: TraceTable[];
    lists?: TraceList[];
    metrics?: TraceMetric[];
}

export interface TraceBuilder {
    setNode: (id: NodeId, state: ElementState) => void;
    setNodes: (ids: NodeId[], state: ElementState) => void;
    setEdge: (id: string, state: ElementState) => void;
    resetEdgesWithState: (from: ElementState, to: ElementState) => void;
    setNodeBadge: (id: NodeId, badge: string) => void;
    setEdgeBadge: (id: string, badge: string) => void;
    setNodeGroup: (id: NodeId, group: number) => void;
    clearNodeGroups: () => void;
    nodeState: (id: NodeId) => ElementState;
    edgeState: (id: string) => ElementState;
    commit: (payload: StepPayload) => void;
    build: (conclusions: string[]) => AlgorithmTrace;
}

export function createTraceBuilder(graph: Graph): TraceBuilder {
    const base = idleStates(graph);
    const nodeStates: Record<NodeId, ElementState> = { ...base.nodeStates };
    const edgeStates: Record<string, ElementState> = { ...base.edgeStates };
    let nodeBadges: Record<NodeId, string> = {};
    let edgeBadges: Record<string, string> = {};
    let nodeGroups: Record<NodeId, number> = {};
    const steps: AlgorithmStep[] = [];

    return {
        setNode(id, state) {
            nodeStates[id] = state;
        },
        setNodes(ids, state) {
            ids.forEach((id) => {
                nodeStates[id] = state;
            });
        },
        setEdge(id, state) {
            edgeStates[id] = state;
        },
        resetEdgesWithState(from, to) {
            Object.keys(edgeStates).forEach((id) => {
                if (edgeStates[id] === from) edgeStates[id] = to;
            });
        },
        setNodeBadge(id, badge) {
            nodeBadges = { ...nodeBadges, [id]: badge };
        },
        setEdgeBadge(id, badge) {
            edgeBadges = { ...edgeBadges, [id]: badge };
        },
        setNodeGroup(id, group) {
            nodeGroups = { ...nodeGroups, [id]: group };
        },
        clearNodeGroups() {
            nodeGroups = {};
        },
        nodeState(id) {
            return nodeStates[id] ?? 'idle';
        },
        edgeState(id) {
            return edgeStates[id] ?? 'idle';
        },
        commit(payload) {
            steps.push({
                title: payload.title,
                description: payload.description,
                nodeStates: { ...nodeStates },
                edgeStates: { ...edgeStates },
                nodeBadges: { ...nodeBadges },
                edgeBadges: { ...edgeBadges },
                nodeGroups: { ...nodeGroups },
                tables: payload.tables,
                lists: payload.lists,
                metrics: payload.metrics,
            });
        },
        build(conclusions) {
            return { steps, conclusions };
        },
    };
}
