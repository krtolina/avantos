import '@xyflow/react/dist/style.css'
import Graph from './pages/graph'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './utils/query-client'

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Graph />
    </QueryClientProvider>
  )
}

export default App
