import { createContext, useState, useMemo, useCallback } from 'react'
import {
  getNodeMap,
  getFormMap,
  getPredecessorsMap,
  getCanvasNodesFromBlueprintGraph,
  getCanvasEdgesFromBlueprintGraph,
  getGlobalGroupMap,
} from '../utils/graph-utils'
import { useReadBlueprintGraph, useReadGlobalGroups } from '../api/blueprint-graph'
import type { BlueprintNode } from '../types/blueprint-graph'
import type { DrawerFormField, DrawerFormMapping, GraphDrawerContextType } from '../types/graph-drawer'

type Props = {
  children: React.ReactNode
}

const GraphDrawerContext = createContext<GraphDrawerContextType | null>(null)

const GraphDrawerProvider = ({ children }: Props) => {
  const { data: graph, isLoading: isLoadingGraph } = useReadBlueprintGraph({
    tenantId: 'MOCK',
    actionBlueprintId: 'MOCK',
  })

  const { data: globalGroups, isLoading: isLoadingGlobalGroups } = useReadGlobalGroups()

  const canvas = useMemo(() => {
    if (!graph) return
    const canvasNodes = getCanvasNodesFromBlueprintGraph(graph)
    const canvasEdges = getCanvasEdgesFromBlueprintGraph(graph)
    return { canvasNodes, canvasEdges }
  }, [graph])

  const [selectedNode, setSelectedNode] = useState<BlueprintNode>()
  const [selectedField, setSelectedField] = useState<DrawerFormField>()
  const [selectedMapping, setSelectedMapping] = useState<DrawerFormField>()
  const [mappings, setMappings] = useState<DrawerFormMapping[]>([])

  const utilityMaps = useMemo(() => {
    if (!graph || !globalGroups) return undefined
    const nodeMap = getNodeMap(graph)
    const formMap = getFormMap(graph)
    const predecessorsMap = getPredecessorsMap(graph)
    const globalGroupMap = getGlobalGroupMap(globalGroups)
    return { nodeMap, formMap, predecessorsMap, globalGroupMap }
  }, [graph, globalGroups])

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
        isLoading: isLoadingGraph || isLoadingGlobalGroups,
        selectedNode,
        setSelectedNode,
        selectedField,
        setSelectedField,
        selectedMapping,
        setSelectedMapping,
        mappings,
        setMappings,
        globalGroups,
        nodeMap: utilityMaps ? utilityMaps.nodeMap : undefined,
        formMap: utilityMaps ? utilityMaps.formMap : undefined,
        predecessorsMap: utilityMaps ? utilityMaps.predecessorsMap : undefined,
        globalGroupMap: utilityMaps ? utilityMaps.globalGroupMap : undefined,
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
