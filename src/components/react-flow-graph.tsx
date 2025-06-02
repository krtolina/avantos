import { Background, ReactFlow } from '@xyflow/react'
import { useReadBlueprintGraph } from '../api/blueprint-graph'
import { mapBlueprintGraphToEdges, mapBlueprintGraphToNodes } from '../utils/mapper'
import { useMemo } from 'react'
import Loader from './loader'

const ReactFlowGraph = () => {
  const { data, isLoading } = useReadBlueprintGraph({
    tenantId: 'MOCK',
    actionBlueprintId: 'MOCK',
  })

  const nodes = useMemo(() => (data ? mapBlueprintGraphToNodes(data) : []), [data])
  const edges = useMemo(() => (data ? mapBlueprintGraphToEdges(data) : []), [data])

  if (isLoading) return <Loader />

  return (
    <ReactFlow nodes={nodes} edges={edges} colorMode="dark" fitView>
      <Background />
    </ReactFlow>
  )
}

export default ReactFlowGraph
