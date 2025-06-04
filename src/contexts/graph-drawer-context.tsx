import { createContext, useState, useMemo, useCallback } from 'react'
import { getCanvasNodes, getCanvasEdges, getNodeMap } from '../utils/graph-utils'
import { useReadGraphNodes, useReadGlobalNodes, useReadGraphEdges } from '../api/blueprint-graph'
import type { DrawerFormField, DrawerFormMapping, GraphNode, GraphDrawerContextType } from '../types/graph'

type Props = {
  children: React.ReactNode
}

const GraphDrawerContext = createContext<GraphDrawerContextType | null>(null)

const MOCK_PARAMS = {
  tenantId: 'MOCK',
  actionBlueprintId: 'MOCK',
}

const GraphDrawerProvider = ({ children }: Props) => {
  const { data: nodes, isLoading: isLoadingNodes } = useReadGraphNodes(MOCK_PARAMS)

  const { data: edges, isLoading: isLoadingEdges } = useReadGraphEdges(MOCK_PARAMS)

  const { data: globalNodes, isLoading: isLoadingGlobalNodes } = useReadGlobalNodes()

  const [selectedNode, setSelectedNode] = useState<GraphNode>()
  const [selectedField, setSelectedField] = useState<DrawerFormField>()
  const [selectedMapping, setSelectedMapping] = useState<DrawerFormField>()
  const [mappings, setMappings] = useState<DrawerFormMapping[]>([])

  const data = useMemo(() => {
    if (!nodes || !edges || !globalNodes) return undefined
    const nodeMap = getNodeMap([...nodes, ...globalNodes])
    const canvasNodes = getCanvasNodes(Object.values(nodeMap))
    const canvasEdges = getCanvasEdges(edges)
    return { nodeMap, canvasNodes, canvasEdges }
  }, [nodes, edges, globalNodes])

  const handleOpenDrawer = useCallback(
    (id: string) => {
      if (!data) return
      setSelectedNode(data.nodeMap[id])
    },
    [data]
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
        isLoading: isLoadingNodes || isLoadingEdges || isLoadingGlobalNodes,
        selectedNode,
        setSelectedNode,
        selectedField,
        setSelectedField,
        selectedMapping,
        setSelectedMapping,
        mappings,
        setMappings,
        nodeMap: data ? data.nodeMap : undefined,
        canvasNodes: data ? data.canvasNodes : undefined,
        canvasEdges: data ? data.canvasEdges : undefined,
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
