export type BlueprintGraph = {
  id: string
  tenant_id: string
  name: string
  description: string
  category: string
  nodes: BlueprintNode[]
  edges: BlueprintEdge[]
  forms: BlueprintForm[]
  branches: unknown[]
  triggers: unknown[]
}

// ----------------------------------------------------------

export type BlueprintNode = {
  id: string
  type: string
  position: NodePosition
  data: BlueprintNodeData
}

export type BlueprintNodeData = {
  id: string
  component_key: string
  component_type: string
  component_id: string
  name: string
  prerequisites: string[]
  permitted_roles: string[]
  input_mapping: Record<string, unknown>
  sla_duration: BlueprintNodeDuration
  approval_required: boolean
  approval_roles: string[]
}

export type NodePosition = {
  x: number
  y: number
}

export type BlueprintNodeDuration = {
  number: number
  unit: string
}

// ----------------------------------------------------------

export type BlueprintEdge = {
  source: string
  target: string
}

// ----------------------------------------------------------

export type BlueprintForm = {
  id: string
  name: string
  description: string
  is_reusable: boolean
  field_schema: BlueprintFormFieldSchema
  ui_schema: BlueprintFormUiSchema
  dynamic_field_config: Record<string, BlueprintFormDynamicFieldConfig>
}

export type BlueprintFormFieldSchema = {
  type: string
  properties: Record<string, BlueprintFormField>
  required: string[]
}

export type BlueprintFormField = {
  avantos_type: string
  title?: string
  type: string
  format?: string
  items?: BlueprintFormFieldItems
  enum?: string[] | Record<string, string>[] | null
  uniqueItems?: boolean
}

export type BlueprintFormFieldItems = {
  enum: string[]
  type: string
}

export type BlueprintFormUiSchema = {
  type: string
  elements: BlueprintFormElement[]
}

export type BlueprintFormElement = {
  type: string
  scope: string
  label: string
  options?: Record<string, unknown>
}

export type BlueprintFormDynamicFieldConfig = {
  selector_field: string
  payload_fields: Record<string, BlueprintFormPayloadField>
  endpoint_id: string
}

export type BlueprintFormPayloadField = { type: string; value: string }
