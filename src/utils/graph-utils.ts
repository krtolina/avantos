import { Position, type Edge, type Node } from '@xyflow/react'
import type { BlueprintForm, BlueprintGraph, BlueprintNode } from '../types/blueprint-graph'
import type { DrawerFormField, DrawerFormMapping } from '../types/graph-drawer'

export const getMappingKey = ({ nodeId, fieldKey }: DrawerFormField): string => `${fieldKey}-${nodeId}`

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

export const getNodeMap = (graph: BlueprintGraph): Record<string, BlueprintNode> => {
  const map: Record<string, BlueprintNode> = {}
  graph.nodes.forEach((node) => {
    map[node.id] = node
  })
  return map
}

export const getFormMap = (graph: BlueprintGraph): Record<string, BlueprintForm> => {
  const map: Record<string, BlueprintForm> = {}
  graph.forms.forEach((form) => {
    map[form.id] = form
  })
  return map
}

export const getMappingMap = (mappings: DrawerFormMapping[]): Record<string, DrawerFormMapping> => {
  const map: Record<string, DrawerFormMapping> = {}
  mappings.forEach((mapping) => {
    const key = getMappingKey(mapping.field)
    map[key] = mapping
  })
  return map
}

export const getPredecessorsMap = (graph: BlueprintGraph): Record<string, BlueprintNode[]> => {
  if (!graph) return {}

  const nodeMap = getNodeMap(graph)

  const incoming: Record<string, string[]> = {}

  graph.edges.forEach(({ source, target }) => {
    if (!incoming[target]) incoming[target] = []
    incoming[target].push(source)
  })

  const map: Record<string, BlueprintNode[]> = {}

  graph.nodes.forEach((node) => {
    const visited = new Set<string>()
    const queue: string[] = incoming[node.id] ? [...incoming[node.id]] : []
    const result: string[] = []

    while (queue.length > 0) {
      const parent = queue.shift()!
      if (!visited.has(parent)) {
        visited.add(parent)
        result.push(parent)
        if (incoming[parent]) queue.push(...incoming[parent])
      }
    }

    map[node.id] = result.map((id) => nodeMap[id])
  })

  return map
}
