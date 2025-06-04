import { Position, type Edge, type Node } from '@xyflow/react'
import type { BlueprintEdge, BlueprintForm, BlueprintGraph, BlueprintNode } from '../types/blueprint-graph'
import type {
  DrawerFormField,
  DrawerFormMapping,
  GetActiveFieldLabelProps,
  GraphNode,
  MappingMap,
  NodeMap,
} from '../types/graph'

// -----------------------------------------------------------

const getRawNodeMap = (graph: BlueprintGraph): Record<string, BlueprintNode> => {
  const map: Record<string, BlueprintNode> = {}
  graph.nodes.forEach((node) => {
    map[node.id] = node
  })
  return map
}

const getRawFormMap = (graph: BlueprintGraph): Record<string, BlueprintForm> => {
  const map: Record<string, BlueprintForm> = {}
  graph.forms.forEach((form) => {
    map[form.id] = form
  })
  return map
}

const getRawPredecessorMap = (graph: BlueprintGraph): Record<string, string[]> => {
  if (!graph) return {}

  const incoming: Record<string, string[]> = {}

  graph.edges.forEach(({ source, target }) => {
    if (!incoming[target]) incoming[target] = []
    incoming[target].push(source)
  })

  const map: Record<string, string[]> = {}

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

    map[node.id] = result
  })

  return map
}

export const selectGraphNodes = (data: BlueprintGraph): GraphNode[] => {
  const formMap = getRawFormMap(data)
  const nodeMap = getRawNodeMap(data)
  const predecessorMap = getRawPredecessorMap(data)

  return data.nodes.map((node) => ({
    id: node.id,
    title: node.data.name,
    fields: Object.keys(formMap[nodeMap[node.id].data.component_id].field_schema.properties),
    position: node.position,
    isGlobal: false,
    predecessorIds: predecessorMap[node.id],
  }))
}

// -----------------------------------------------------------

export const getFieldKeyFromField = ({ nodeId, fieldKey }: DrawerFormField): string => `${fieldKey}-${nodeId}`

export const getActiveFieldLabel = ({ mapping, nodeMap }: GetActiveFieldLabelProps): string =>
  `${mapping.field.fieldKey}: ${nodeMap[mapping.target.nodeId].title}.${mapping.target.fieldKey}`

export const getCanvasNodes = (nodes: GraphNode[]): Node[] => {
  return nodes
    .filter((node) => Boolean(node.position))
    .map((node) => ({
      id: node.id,
      position: node.position!,
      data: { label: node.title },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    }))
}

export const getCanvasEdges = (edges: BlueprintEdge[]): Edge[] => {
  return edges.map((edge) => ({
    id: `${edge.source}-${edge.target}`,
    source: edge.source,
    target: edge.target,
  }))
}

export const getNodeMap = (node: GraphNode[]): NodeMap => {
  const map: NodeMap = {}
  node.forEach((node) => {
    map[node.id] = node
  })
  return map
}

export const getMappingMap = (mappings: DrawerFormMapping[]): MappingMap => {
  const map: MappingMap = {}
  mappings.forEach((mapping) => {
    const key = getFieldKeyFromField(mapping.field)
    map[key] = mapping
  })
  return map
}
