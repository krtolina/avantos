import type { Edge, Node } from '@xyflow/react'
import type { NodePosition } from './blueprint-graph'

export type GraphNode = {
  id: string
  title: string
  fields: string[]
  isGlobal: boolean
  predecessorIds?: string[]
  position?: NodePosition
}

export type DrawerFormField = { nodeId: string; fieldKey: string }

export type DrawerFormMapping = { field: DrawerFormField; target: DrawerFormField }

export type NodeMap = Record<string, GraphNode>

export type MappingMap = Record<string, DrawerFormMapping>

export type GraphDrawerContextType = {
  isLoading: boolean
  selectedNode?: GraphNode
  setSelectedNode: (node?: GraphNode) => void
  selectedField?: DrawerFormField
  setSelectedField: (field?: DrawerFormField) => void
  selectedMapping?: DrawerFormField
  setSelectedMapping: (field?: DrawerFormField) => void
  mappings: DrawerFormMapping[]
  setMappings: (mappings: DrawerFormMapping[]) => void
  nodeMap?: NodeMap
  canvasNodes?: Node[]
  canvasEdges?: Edge[]
  handleOpenDrawer: (id: string) => void
  handleCloseDrawer: VoidFunction
  handleFieldSelect: (field: DrawerFormField) => void
  handleRemoveFieldSelection: VoidFunction
  handleMappingSelect: (mapping: DrawerFormField) => void
  handleRemoveMappingSelection: VoidFunction
  handleAddMapping: VoidFunction
  handleRemoveMapping: (field: DrawerFormField) => void
}

export type FormTargetProps = {
  nodeIds: string[]
  getNodeTitle: (nodeId: string) => string
  getFieldKeys: (nodeId: string) => string[]
  getFieldLabel: (nodeId: string, fieldKey: string) => string
  isFieldSelected: (nodeId: string, fieldKey: string) => boolean
  onFieldSelect: (nodeId: string, fieldKey: string) => void
}

export type FormFieldProps = {
  fieldKeys: string[]
  isFieldActive: (fieldKey: string) => boolean
  getActiveLabel: (fieldKey: string) => string
  getBasicLabel: (fieldKey: string) => string
  onRemove: (fieldKey: string) => void
  onSelect: (fieldKey: string) => void
}

export type GetActiveFieldLabelProps = {
  mapping: DrawerFormMapping
  nodeMap: NodeMap
}
