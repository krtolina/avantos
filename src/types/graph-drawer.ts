import type { Edge, Node } from '@xyflow/react'
import type { BlueprintNode, BlueprintForm } from './blueprint-graph'

export type DrawerFormField = { nodeId: string; fieldKey: string }
export type DrawerFormMapping = { field: DrawerFormField; target: DrawerFormField }

export type GraphDrawerContextType = {
  isLoading: boolean
  selectedNode?: BlueprintNode
  setSelectedNode: (node?: BlueprintNode) => void
  selectedField?: DrawerFormField
  setSelectedField: (field?: DrawerFormField) => void
  selectedMapping?: DrawerFormField
  setSelectedMapping: (field?: DrawerFormField) => void
  mappings: DrawerFormMapping[]
  setMappings: (mappings: DrawerFormMapping[]) => void
  nodeMap?: Record<string, BlueprintNode>
  formMap?: Record<string, BlueprintForm>
  predecessorsMap?: Record<string, BlueprintNode[]>
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
