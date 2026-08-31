import type { ElementState } from '@/lib/graph/types';

export const nodeFillClasses: Record<ElementState, string> = {
    idle: 'fill-surface stroke-line-strong',
    frontier: 'fill-state-frontier/20 stroke-state-frontier',
    active: 'fill-state-active/25 stroke-state-active',
    done: 'fill-state-done/20 stroke-state-done',
    reject: 'fill-state-reject/20 stroke-state-reject',
    path: 'fill-state-path/25 stroke-state-path',
};

export const nodeStrokeWidth: Record<ElementState, number> = {
    idle: 2,
    frontier: 2.5,
    active: 3.5,
    done: 2.5,
    reject: 2.5,
    path: 3.5,
};

export const edgeStrokeClasses: Record<ElementState, string> = {
    idle: 'stroke-line-strong',
    frontier: 'stroke-state-frontier',
    active: 'stroke-state-active',
    done: 'stroke-state-done',
    reject: 'stroke-state-reject',
    path: 'stroke-state-path',
};

export const edgeStrokeWidth: Record<ElementState, number> = {
    idle: 2,
    frontier: 2.5,
    active: 3,
    done: 3,
    reject: 2.5,
    path: 4,
};

export const markerFillClasses: Record<ElementState, string> = {
    idle: 'fill-line-strong',
    frontier: 'fill-state-frontier',
    active: 'fill-state-active',
    done: 'fill-state-done',
    reject: 'fill-state-reject',
    path: 'fill-state-path',
};

export const groupPalette = [
    'stroke-state-active',
    'stroke-state-done',
    'stroke-state-frontier',
    'stroke-state-path',
    'stroke-state-reject',
];

export const elementStates: ElementState[] = [
    'idle',
    'frontier',
    'active',
    'done',
    'reject',
    'path',
];
