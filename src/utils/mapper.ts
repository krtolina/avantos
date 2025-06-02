import { Position, type Edge, type Node } from '@xyflow/react'
import type { BlueprintGraph } from '../types/blueprint-graph'

export function mapBlueprintGraphToNodes(graph: BlueprintGraph): Node[] {
  return graph.nodes.map((node) => ({
    id: node.id,
    position: node.position,
    data: { label: node.data.name },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  }))
}

export function mapBlueprintGraphToEdges(graph: BlueprintGraph): Edge[] {
  return graph.edges.map((edge) => ({
    id: `${edge.source}-${edge.target}`,
    source: edge.source,
    target: edge.target,
  }))
}
