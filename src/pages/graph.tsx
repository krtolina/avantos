import GraphCanvas from '../components/graph/graph-canvas'
import { GraphDrawerProvider } from '../contexts/graph-drawer-context'
import GraphLayout from '../layouts/graph-layout'

const Graph = () => {
  return (
    <GraphLayout>
      <GraphDrawerProvider>
        <GraphCanvas />
      </GraphDrawerProvider>
    </GraphLayout>
  )
}

export default Graph
