import type { Edge, Node } from '@xyflow/react'
import type { BlueprintNode, BlueprintForm } from './blueprint-graph'

export type DrawerFormField = { nodeId: string; fieldKey: string }

export type DrawerFormMapping = { field: DrawerFormField; target: DrawerFormField }

export type FormTargetProps = {
  groupIds: string[]
  getGroupTitle: (groupId: string) => string
  getTargetKeys: (groupId: string) => string[]
  getTargetLabel: (groupId: string, targetKey: string) => string
  isTargetSelected: (groupId: string, targetKey: string) => boolean
  onTargetSelect: (groupId: string, targetKey: string) => void
}

export type FormFieldProps = {
  fieldKeys: string[]
  isFieldActive: (fieldKey: string) => boolean
  getActiveLabel: (fieldKey: string) => string
  getBasicLabel: (fieldKey: string) => string
  onRemove: (fieldKey: string) => void
  onSelect: (fieldKey: string) => void
}

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
  globalGroups?: GlobalGroup[]
  nodeMap?: Record<string, BlueprintNode>
  formMap?: Record<string, BlueprintForm>
  predecessorsMap?: Record<string, BlueprintNode[]>
  globalGroupMap?: Record<string, GlobalGroup>
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

export type GlobalGroup = {
  id: string
  title: string
  targets: string[]
}

export type GetCommonTargetProps = {
  selectedMapping?: DrawerFormField
  handleMappingSelect: (field: DrawerFormField) => void
}

export type GetDagTargetProps = GetCommonTargetProps & {
  selectedNode: BlueprintNode
  predecessorsMap: Record<string, BlueprintNode[]>
  formMap: Record<string, BlueprintForm>
  nodeMap: Record<string, BlueprintNode>
}

export type GetGlobalTargetProps = GetCommonTargetProps & {
  globalGroups: GlobalGroup[]
  globalGroupMap: Record<string, GlobalGroup>
}

export type GetActiveFieldLabelProps = {
  mapping: DrawerFormMapping
  nodeMap: Record<string, BlueprintNode>
  globalGroupMap: Record<string, GlobalGroup>
}
