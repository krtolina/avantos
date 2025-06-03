import { Position, type Edge, type Node } from '@xyflow/react'
import type { BlueprintGraph } from '../types/blueprint-graph'

export const getCanvasNodesFromBlueprintGraph = (graph: BlueprintGraph): Node[] => {
  return graph.nodes.map((node) => ({
    id: node.id,
    position: node.position,
    data: { label: node.data.name },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  }))
}

export const getCanvasEdgesFromBlueprintGraph = (graph: BlueprintGraph): Edge[] => {
  return graph.edges.map((edge) => ({
    id: `${edge.source}-${edge.target}`,
    source: edge.source,
    target: edge.target,
  }))
}
