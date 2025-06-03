import { createContext, useState, useMemo, useCallback } from 'react'
import {
  getNodeMap,
  getFormMap,
  getPredecessorsMap,
  getCanvasNodesFromBlueprintGraph,
  getCanvasEdgesFromBlueprintGraph,
} from '../utils/graph-utils'
import { useReadBlueprintGraph } from '../api/blueprint-graph'
import type { BlueprintNode } from '../types/blueprint-graph'
import type { DrawerFormField, DrawerFormMapping, GraphDrawerContextType } from '../types/drawer-form'

type Props = {
  children: React.ReactNode
}

const GraphDrawerContext = createContext<GraphDrawerContextType | null>(null)

const GraphDrawerProvider = ({ children }: Props) => {
  const { data, isLoading } = useReadBlueprintGraph({
    tenantId: 'MOCK',
    actionBlueprintId: 'MOCK',
  })

  const canvas = useMemo(() => {
    if (!data) return
    const canvasNodes = getCanvasNodesFromBlueprintGraph(data)
    const canvasEdges = getCanvasEdgesFromBlueprintGraph(data)
    return { canvasNodes, canvasEdges }
  }, [data])

  const [selectedNode, setSelectedNode] = useState<BlueprintNode>()
  const [selectedField, setSelectedField] = useState<DrawerFormField>()
  const [selectedMapping, setSelectedMapping] = useState<DrawerFormField>()
  const [mappings, setMappings] = useState<DrawerFormMapping[]>([])

  const utilityMaps = useMemo(() => {
    if (!data) return
    const nodeMap = getNodeMap(data)
    const formMap = getFormMap(data)
    const predecessorsMap = getPredecessorsMap(data)
    return { nodeMap, formMap, predecessorsMap }
  }, [data])

  const handleOpenDrawer = useCallback(
    (id: string) => {
      if (!utilityMaps) return
      setSelectedNode(utilityMaps.nodeMap[id])
    },
    [utilityMaps]
  )

  const handleCloseDrawer = useCallback(() => {
    setSelectedNode(undefined)
    setSelectedField(undefined)
    setSelectedMapping(undefined)
  }, [])

  const handleFieldSelect = useCallback((field: DrawerFormField) => {
    setSelectedField(field)
  }, [])

  const handleRemoveFieldSelection = useCallback(() => {
    setSelectedField(undefined)
    setSelectedMapping(undefined)
  }, [])

  const handleMappingSelect = useCallback((mapping: DrawerFormField) => {
    setSelectedMapping(mapping)
  }, [])

  const handleRemoveMappingSelection = useCallback(() => {
    setSelectedMapping(undefined)
  }, [])

  const handleAddMapping = useCallback(() => {
    if (!selectedField || !selectedMapping) return
    setMappings((prev) => [...prev, { field: selectedField, target: selectedMapping }])
    setSelectedField(undefined)
    setSelectedMapping(undefined)
  }, [selectedField, selectedMapping])

  const handleRemoveMapping = useCallback(({ fieldKey, nodeId }: DrawerFormField) => {
    setMappings((prev) => prev.filter(({ field }) => !(field.fieldKey === fieldKey && field.nodeId === nodeId)))
  }, [])

  return (
    <GraphDrawerContext.Provider
      value={{
        isLoading,
        selectedNode,
        setSelectedNode,
        selectedField,
        setSelectedField,
        selectedMapping,
        setSelectedMapping,
        mappings,
        setMappings,
        nodeMap: utilityMaps ? utilityMaps.nodeMap : undefined,
        formMap: utilityMaps ? utilityMaps.formMap : undefined,
        predecessorsMap: utilityMaps ? utilityMaps.predecessorsMap : undefined,
        canvasNodes: canvas ? canvas.canvasNodes : undefined,
        canvasEdges: canvas ? canvas.canvasEdges : undefined,
        handleOpenDrawer,
        handleCloseDrawer,
        handleFieldSelect,
        handleRemoveFieldSelection,
        handleMappingSelect,
        handleRemoveMappingSelection,
        handleAddMapping,
        handleRemoveMapping,
      }}
    >
      {children}
    </GraphDrawerContext.Provider>
  )
}

export { GraphDrawerContext, GraphDrawerProvider }
