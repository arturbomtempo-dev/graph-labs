import { useCallback, useEffect, useMemo, useState } from 'react';
import { createEdgeId, createNodeId, edgeExists, nextNodeLabel } from '@/lib/graph/helpers';
import { refineLayout } from '@/lib/graph/layout';
import { presets } from '@/lib/graph/presets';
import type { Graph, GraphEdge, NodeId } from '@/lib/graph/types';

const STORAGE_KEY = 'graph-labs-graph';
const AUTO_ARRANGE_KEY = 'graph-labs-auto-arrange';
const HISTORY_LIMIT = 60;

interface History {
    past: Graph[];
    present: Graph;
    future: Graph[];
}

function readStoredGraph(): Graph {
    if (typeof window === 'undefined') return presets[0].build();
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) return presets[0].build();
        const parsed = JSON.parse(raw) as Graph;
        if (!Array.isArray(parsed.nodes) || !Array.isArray(parsed.edges)) {
            return presets[0].build();
        }
        return parsed;
    } catch {
        return presets[0].build();
    }
}

function readAutoArrange(): boolean {
    if (typeof window === 'undefined') return true;
    return window.localStorage.getItem(AUTO_ARRANGE_KEY) !== 'off';
}

export function useGraphEditor() {
    const [history, setHistory] = useState<History>(() => ({
        past: [],
        present: readStoredGraph(),
        future: [],
    }));
    const [autoArrange, setAutoArrange] = useState<boolean>(readAutoArrange);

    const graph = history.present;

    useEffect(() => {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(graph));
    }, [graph]);

    useEffect(() => {
        window.localStorage.setItem(AUTO_ARRANGE_KEY, autoArrange ? 'on' : 'off');
    }, [autoArrange]);

    const apply = useCallback((updater: (current: Graph) => Graph, record = true) => {
        setHistory((current) => {
            const next = updater(current.present);
            if (next === current.present) return current;
            if (!record) return { ...current, present: next };
            return {
                past: [...current.past, current.present].slice(-HISTORY_LIMIT),
                present: next,
                future: [],
            };
        });
    }, []);

    const beginHistoryCheckpoint = useCallback(() => {
        setHistory((current) => ({
            past: [...current.past, current.present].slice(-HISTORY_LIMIT),
            present: current.present,
            future: [],
        }));
    }, []);

    const undo = useCallback(() => {
        setHistory((current) => {
            if (current.past.length === 0) return current;
            const previous = current.past[current.past.length - 1];
            return {
                past: current.past.slice(0, -1),
                present: previous,
                future: [current.present, ...current.future].slice(0, HISTORY_LIMIT),
            };
        });
    }, []);

    const redo = useCallback(() => {
        setHistory((current) => {
            if (current.future.length === 0) return current;
            const [next, ...rest] = current.future;
            return {
                past: [...current.past, current.present].slice(-HISTORY_LIMIT),
                present: next,
                future: rest,
            };
        });
    }, []);

    const addNode = useCallback(
        (x: number, y: number) => {
            const id = createNodeId();
            apply((current) => ({
                ...current,
                nodes: [
                    ...current.nodes,
                    { id, label: nextNodeLabel(current.nodes), x: Math.round(x), y: Math.round(y) },
                ],
            }));
            return id;
        },
        [apply]
    );

    const moveNode = useCallback(
        (id: NodeId, x: number, y: number) => {
            apply(
                (current) => ({
                    ...current,
                    nodes: current.nodes.map((node) =>
                        node.id === id ? { ...node, x: Math.round(x), y: Math.round(y) } : node
                    ),
                }),
                false
            );
        },
        [apply]
    );

    const renameNode = useCallback(
        (id: NodeId, label: string) => {
            apply((current) => ({
                ...current,
                nodes: current.nodes.map((node) => (node.id === id ? { ...node, label } : node)),
            }));
        },
        [apply]
    );

    const removeNode = useCallback(
        (id: NodeId) => {
            apply((current) => ({
                nodes: current.nodes.filter((node) => node.id !== id),
                edges: current.edges.filter((edge) => edge.source !== id && edge.target !== id),
            }));
        },
        [apply]
    );

    const addEdge = useCallback(
        (source: NodeId, target: NodeId, weight = 1, directed = false) => {
            if (source === target) return false;
            let created = false;
            apply((current) => {
                if (edgeExists(current, source, target)) return current;
                created = true;
                const next: Graph = {
                    ...current,
                    edges: [
                        ...current.edges,
                        { id: createEdgeId(), source, target, weight, directed },
                    ],
                };
                // A sugestão de posicionamento entra no mesmo passo do histórico que a aresta,
                // então um único desfazer volta tudo.
                return autoArrange ? (refineLayout(next) ?? next) : next;
            });
            return created;
        },
        [apply, autoArrange]
    );

    /** Reorganiza sob demanda, sem depender de uma nova aresta. */
    const arrangeNow = useCallback(() => {
        let changed = false;
        apply((current) => {
            const next = refineLayout(current);
            if (!next) return current;
            changed = true;
            return next;
        });
        return changed;
    }, [apply]);

    const updateEdge = useCallback(
        (id: string, patch: Partial<Omit<GraphEdge, 'id'>>) => {
            apply((current) => ({
                ...current,
                edges: current.edges.map((edge) => (edge.id === id ? { ...edge, ...patch } : edge)),
            }));
        },
        [apply]
    );

    const removeEdge = useCallback(
        (id: string) => {
            apply((current) => ({
                ...current,
                edges: current.edges.filter((edge) => edge.id !== id),
            }));
        },
        [apply]
    );

    const setAllDirected = useCallback(
        (directed: boolean) => {
            apply((current) => ({
                ...current,
                edges: current.edges.map((edge) => ({ ...edge, directed })),
            }));
        },
        [apply]
    );

    const clear = useCallback(() => {
        apply(() => ({ nodes: [], edges: [] }));
    }, [apply]);

    const loadPreset = useCallback(
        (presetId: string) => {
            const preset = presets.find((candidate) => candidate.id === presetId);
            if (!preset) return;
            apply(() => preset.build());
        },
        [apply]
    );

    const replaceGraph = useCallback(
        (next: Graph) => {
            apply(() => next);
        },
        [apply]
    );

    const stats = useMemo(() => {
        const directedCount = graph.edges.filter((edge) => edge.directed).length;
        return {
            nodeCount: graph.nodes.length,
            edgeCount: graph.edges.length,
            directedCount,
            undirectedCount: graph.edges.length - directedCount,
            isMixed: directedCount > 0 && directedCount < graph.edges.length,
            hasWeights: graph.edges.some((edge) => edge.weight !== 1),
        };
    }, [graph]);

    return {
        graph,
        stats,
        canUndo: history.past.length > 0,
        canRedo: history.future.length > 0,
        undo,
        redo,
        beginHistoryCheckpoint,
        addNode,
        moveNode,
        renameNode,
        removeNode,
        addEdge,
        updateEdge,
        removeEdge,
        setAllDirected,
        clear,
        loadPreset,
        replaceGraph,
        autoArrange,
        setAutoArrange,
        arrangeNow,
    };
}
