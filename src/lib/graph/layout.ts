import type { Graph, GraphEdge, NodeId } from './types';

export const NODE_RADIUS = 24;

/** Folga mínima entre o traço de uma aresta e um vértice que não é extremo dela. */
const NODE_EDGE_CLEARANCE = NODE_RADIUS + 12;
/** Distância mínima entre os centros de dois vértices. */
const NODE_NODE_CLEARANCE = NODE_RADIUS * 2 + 16;
/** Abaixo deste ângulo, duas arestas incidentes ao mesmo vértice se confundem visualmente. */
const MIN_INCIDENT_ANGLE = 16;

const WEIGHT_CROSSING = 10;
const WEIGHT_NODE_ON_EDGE = 14;
const WEIGHT_NODE_OVERLAP = 9;
const WEIGHT_TIGHT_ANGLE = 5;
/** Penalidade por pixel afastado da posição original: mantém a sugestão perto do desenho do usuário. */
const WEIGHT_DRIFT = 0.01;

/** Acima destes limites a busca local fica cara demais para rodar a cada aresta inserida. */
const MAX_NODES = 40;
const MAX_EDGES = 90;

const PASSES = 4;
const CANDIDATE_RADII = [34, 68, 116];
const CANDIDATE_ANGLES = 10;
/** Nenhum vértice se afasta mais que isso de onde o usuário o colocou. */
const MAX_DRIFT = 260;

export interface Point {
    x: number;
    y: number;
}

export interface LayoutIssues {
    crossings: number;
    nodesOnEdges: number;
    overlaps: number;
    tightAngles: number;
    total: number;
}

type Positions = Map<NodeId, Point>;

const distance = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y);

const otherEnd = (edge: GraphEdge, node: NodeId) =>
    edge.source === node ? edge.target : edge.source;

const touches = (edge: GraphEdge, node: NodeId) => edge.source === node || edge.target === node;

const sharesEndpoint = (a: GraphEdge, b: GraphEdge) =>
    a.source === b.source ||
    a.source === b.target ||
    a.target === b.source ||
    a.target === b.target;

/** Duas arestas entre o mesmo par de vértices são desenhadas curvadas, então não se sobrepõem. */
const sameEndpoints = (a: GraphEdge, b: GraphEdge) =>
    (a.source === b.source && a.target === b.target) ||
    (a.source === b.target && a.target === b.source);

function turn(origin: Point, a: Point, b: Point): number {
    return (a.x - origin.x) * (b.y - origin.y) - (a.y - origin.y) * (b.x - origin.x);
}

/** Cruzamento próprio: os segmentos se atravessam fora de seus extremos. */
function segmentsCross(a1: Point, a2: Point, b1: Point, b2: Point): boolean {
    const d1 = turn(b1, b2, a1);
    const d2 = turn(b1, b2, a2);
    const d3 = turn(a1, a2, b1);
    const d4 = turn(a1, a2, b2);
    return ((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0)) && ((d3 > 0 && d4 < 0) || (d3 < 0 && d4 > 0));
}

function pointSegmentDistance(p: Point, a: Point, b: Point): number {
    const vx = b.x - a.x;
    const vy = b.y - a.y;
    const lengthSquared = vx * vx + vy * vy;
    if (lengthSquared === 0) return distance(p, a);
    const t = Math.max(0, Math.min(1, ((p.x - a.x) * vx + (p.y - a.y) * vy) / lengthSquared));
    return Math.hypot(p.x - (a.x + t * vx), p.y - (a.y + t * vy));
}

/** Ângulo, em graus, entre os segmentos centro→a e centro→b. */
function angleAt(center: Point, a: Point, b: Point): number {
    const ax = a.x - center.x;
    const ay = a.y - center.y;
    const bx = b.x - center.x;
    const by = b.y - center.y;
    const magnitude = Math.hypot(ax, ay) * Math.hypot(bx, by);
    if (magnitude === 0) return 180;
    const cosine = Math.max(-1, Math.min(1, (ax * bx + ay * by) / magnitude));
    return (Math.acos(cosine) * 180) / Math.PI;
}

function incidenceMap(graph: Graph): Map<NodeId, GraphEdge[]> {
    const map = new Map<NodeId, GraphEdge[]>(graph.nodes.map((node) => [node.id, []]));
    graph.edges.forEach((edge) => {
        map.get(edge.source)?.push(edge);
        if (edge.target !== edge.source) map.get(edge.target)?.push(edge);
    });
    return map;
}

function positionsOf(graph: Graph): Positions {
    return new Map(graph.nodes.map((node) => [node.id, { x: node.x, y: node.y }]));
}

/** Quantifica o quanto o desenho atual atrapalha a leitura do grafo. */
export function evaluateLayout(graph: Graph, positions: Positions): LayoutIssues {
    const at = (id: NodeId) => positions.get(id) as Point;
    const incident = incidenceMap(graph);
    let crossings = 0;
    let nodesOnEdges = 0;
    let overlaps = 0;
    let tightAngles = 0;

    for (let i = 0; i < graph.edges.length; i += 1) {
        const a = graph.edges[i];
        for (let j = i + 1; j < graph.edges.length; j += 1) {
            const b = graph.edges[j];
            if (sharesEndpoint(a, b)) continue;
            if (segmentsCross(at(a.source), at(a.target), at(b.source), at(b.target))) {
                crossings += 1;
            }
        }
    }

    graph.edges.forEach((edge) => {
        const a = at(edge.source);
        const b = at(edge.target);
        graph.nodes.forEach((node) => {
            if (touches(edge, node.id)) return;
            if (pointSegmentDistance(at(node.id), a, b) < NODE_EDGE_CLEARANCE) nodesOnEdges += 1;
        });
    });

    for (let i = 0; i < graph.nodes.length; i += 1) {
        for (let j = i + 1; j < graph.nodes.length; j += 1) {
            if (distance(at(graph.nodes[i].id), at(graph.nodes[j].id)) < NODE_NODE_CLEARANCE) {
                overlaps += 1;
            }
        }
    }

    graph.nodes.forEach((node) => {
        const own = incident.get(node.id) ?? [];
        for (let i = 0; i < own.length; i += 1) {
            for (let j = i + 1; j < own.length; j += 1) {
                if (sameEndpoints(own[i], own[j])) continue;
                const angle = angleAt(
                    at(node.id),
                    at(otherEnd(own[i], node.id)),
                    at(otherEnd(own[j], node.id))
                );
                if (angle < MIN_INCIDENT_ANGLE) tightAngles += 1;
            }
        }
    });

    return {
        crossings,
        nodesOnEdges,
        overlaps,
        tightAngles,
        total:
            crossings * WEIGHT_CROSSING +
            nodesOnEdges * WEIGHT_NODE_ON_EDGE +
            overlaps * WEIGHT_NODE_OVERLAP +
            tightAngles * WEIGHT_TIGHT_ANGLE,
    };
}

/**
 * Soma apenas as penalidades que envolvem `nodeId`. Como os demais termos não mudam
 * quando só esse vértice se move, comparar este custo entre posições candidatas equivale
 * a comparar a pontuação do desenho inteiro, mas a um custo muito menor.
 */
function nodeCost(
    nodeId: NodeId,
    candidate: Point,
    graph: Graph,
    positions: Positions,
    incident: Map<NodeId, GraphEdge[]>,
    origin: Point
): number {
    const at = (id: NodeId): Point => (id === nodeId ? candidate : (positions.get(id) as Point));
    const own = incident.get(nodeId) ?? [];
    let cost = 0;

    // Cruzamentos entre as arestas incidentes e as demais.
    own.forEach((edge) => {
        const a = at(edge.source);
        const b = at(edge.target);
        graph.edges.forEach((other) => {
            if (other === edge || touches(other, nodeId) || sharesEndpoint(edge, other)) return;
            if (segmentsCross(a, b, at(other.source), at(other.target))) cost += WEIGHT_CROSSING;
        });
    });

    // O próprio vértice pousando sobre arestas que não são dele.
    graph.edges.forEach((edge) => {
        if (touches(edge, nodeId)) return;
        if (
            pointSegmentDistance(candidate, at(edge.source), at(edge.target)) < NODE_EDGE_CLEARANCE
        ) {
            cost += WEIGHT_NODE_ON_EDGE;
        }
    });

    // Outros vértices pousando sobre as arestas deste.
    own.forEach((edge) => {
        const a = at(edge.source);
        const b = at(edge.target);
        graph.nodes.forEach((node) => {
            if (touches(edge, node.id)) return;
            if (pointSegmentDistance(at(node.id), a, b) < NODE_EDGE_CLEARANCE) {
                cost += WEIGHT_NODE_ON_EDGE;
            }
        });
    });

    graph.nodes.forEach((node) => {
        if (node.id === nodeId) return;
        if (distance(candidate, at(node.id)) < NODE_NODE_CLEARANCE) cost += WEIGHT_NODE_OVERLAP;
    });

    // Ângulos apertados no próprio vértice.
    for (let i = 0; i < own.length; i += 1) {
        for (let j = i + 1; j < own.length; j += 1) {
            if (sameEndpoints(own[i], own[j])) continue;
            const angle = angleAt(
                candidate,
                at(otherEnd(own[i], nodeId)),
                at(otherEnd(own[j], nodeId))
            );
            if (angle < MIN_INCIDENT_ANGLE) cost += WEIGHT_TIGHT_ANGLE;
        }
    }

    // Ângulos apertados criados nos vizinhos por causa deste vértice.
    own.forEach((edge) => {
        const neighbour = otherEnd(edge, nodeId);
        (incident.get(neighbour) ?? []).forEach((other) => {
            if (other === edge || sameEndpoints(edge, other)) return;
            const angle = angleAt(at(neighbour), candidate, at(otherEnd(other, neighbour)));
            if (angle < MIN_INCIDENT_ANGLE) cost += WEIGHT_TIGHT_ANGLE;
        });
    });

    return cost + distance(candidate, origin) * WEIGHT_DRIFT;
}

/**
 * Sugere posições melhores para os vértices a partir das atuais, por busca local.
 * Devolve `null` quando o desenho já está legível, quando o grafo é grande demais
 * para reorganizar sem travar, ou quando nenhuma tentativa melhorou a pontuação.
 */
export function refineLayout(graph: Graph): Graph | null {
    if (graph.nodes.length < 3 || graph.edges.length === 0) return null;
    if (graph.nodes.length > MAX_NODES || graph.edges.length > MAX_EDGES) return null;

    const positions = positionsOf(graph);
    const origin = positionsOf(graph);
    const incident = incidenceMap(graph);

    const before = evaluateLayout(graph, positions);
    if (before.total === 0) return null;

    const costOf = (id: NodeId, point: Point) =>
        nodeCost(id, point, graph, positions, incident, origin.get(id) as Point);

    let moved = false;

    for (let pass = 0; pass < PASSES; pass += 1) {
        let improved = false;

        // Trata primeiro os vértices que mais atrapalham a leitura.
        const order = [...graph.nodes].sort(
            (a, b) =>
                costOf(b.id, positions.get(b.id) as Point) -
                costOf(a.id, positions.get(a.id) as Point)
        );

        for (const node of order) {
            const current = positions.get(node.id) as Point;
            const anchor = origin.get(node.id) as Point;
            let bestPoint = current;
            let bestCost = costOf(node.id, current);

            for (const radius of CANDIDATE_RADII) {
                for (let step = 0; step < CANDIDATE_ANGLES; step += 1) {
                    // O deslocamento angular desalinha os anéis e amplia a variedade de tentativas.
                    const angle = (2 * Math.PI * step) / CANDIDATE_ANGLES + radius * 0.7;
                    const candidate = {
                        x: Math.round(current.x + Math.cos(angle) * radius),
                        y: Math.round(current.y + Math.sin(angle) * radius),
                    };
                    if (distance(candidate, anchor) > MAX_DRIFT) continue;

                    const cost = costOf(node.id, candidate);
                    if (cost < bestCost - 1e-6) {
                        bestCost = cost;
                        bestPoint = candidate;
                    }
                }
            }

            if (bestPoint !== current) {
                positions.set(node.id, bestPoint);
                moved = true;
                improved = true;
            }
        }

        if (!improved) break;
    }

    if (!moved) return null;
    if (evaluateLayout(graph, positions).total >= before.total) return null;

    return {
        ...graph,
        nodes: graph.nodes.map((node) => {
            const point = positions.get(node.id) as Point;
            return { ...node, x: point.x, y: point.y };
        }),
    };
}
