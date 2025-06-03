import { Background, ReactFlow } from '@xyflow/react'
import Loader from '../loader/loader'
import GraphDrawer from './drawer/graph-drawer'
import { useGraphDrawer } from '../../hooks/use-graph-drawer'

const GraphCanvas = () => {
  const { isLoading, canvasEdges, canvasNodes, handleOpenDrawer } = useGraphDrawer()

  if (isLoading) return <Loader />

  return (
    <>
      <ReactFlow
        nodes={canvasNodes}
        edges={canvasEdges}
        colorMode="dark"
        fitView
        onNodeClick={(_, node) => handleOpenDrawer(node.id)}
      >
        <Background />
      </ReactFlow>
      <GraphDrawer />
    </>
  )
}

export default GraphCanvas
