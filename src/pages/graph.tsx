import GraphCanvas from '../components/graph/graph-canvas'
import { GraphDrawerProvider } from '../context/graph-drawer-context'
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
