import { Position, type Edge, type Node } from '@xyflow/react'
import type { BlueprintForm, BlueprintGraph, BlueprintNode } from '../types/blueprint-graph'
import type {
  DrawerFormField,
  DrawerFormMapping,
  GetActiveFieldLabelProps,
  GetCommonTargetProps,
  GetDagTargetProps,
  GetGlobalTargetProps,
  GlobalGroup,
} from '../types/graph-drawer'

export const getFieldKeyFromField = ({ nodeId, fieldKey }: DrawerFormField): string => `${fieldKey}-${nodeId}`

export const getActiveFieldLabel = ({ mapping, nodeMap, globalGroupMap }: GetActiveFieldLabelProps): string => {
  const targetId = mapping.target.nodeId
  const nodeLabel = nodeMap[targetId] ? nodeMap[targetId].data.name : globalGroupMap[targetId].title
  return `${mapping.field.fieldKey}: ${nodeLabel}.${mapping.target.fieldKey}`
}

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
    const key = getFieldKeyFromField(mapping.field)
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

export const getGlobalGroupMap = (group: GlobalGroup[]): Record<string, GlobalGroup> => {
  const map: Record<string, GlobalGroup> = {}
  group.forEach((group) => {
    map[group.id] = group
  })
  return map
}

const getCommonTargetProps = ({ handleMappingSelect, selectedMapping }: GetCommonTargetProps) => ({
  isTargetSelected: (groupId: string, targetKey: string) =>
    Boolean(selectedMapping && selectedMapping.fieldKey === targetKey && selectedMapping.nodeId === groupId),
  onTargetSelect: (groupId: string, targetKey: string) => handleMappingSelect({ nodeId: groupId, fieldKey: targetKey }),
})

export function getDagTargetProps(props: GetDagTargetProps) {
  const { selectedNode, predecessorsMap, formMap, selectedMapping, nodeMap, handleMappingSelect } = props
  return {
    ...getCommonTargetProps({ handleMappingSelect, selectedMapping }),
    groupIds: predecessorsMap[selectedNode.id].map((node) => node.id),
    getGroupTitle: (groupId: string) => nodeMap[groupId].data.name,
    getTargetKeys: (groupId: string) =>
      Object.keys(formMap[nodeMap[groupId].data.component_id].field_schema.properties),
    getTargetLabel: (_: string, targetKey: string) => targetKey,
  }
}

export function getGlobalTargetProps(props: GetGlobalTargetProps) {
  const { globalGroups, globalGroupMap, selectedMapping, handleMappingSelect } = props
  return {
    ...getCommonTargetProps({ handleMappingSelect, selectedMapping }),
    groupIds: globalGroups.map((group) => group.id),
    getGroupTitle: (groupId: string) => globalGroupMap[groupId].title,
    getTargetKeys: (groupId: string) => globalGroupMap[groupId].targets,
    getTargetLabel: (_: string, targetKey: string) => targetKey,
  }
}
