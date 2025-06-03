import { useContext } from 'react'
import { GraphDrawerContext } from '../contexts/graph-drawer-context'

export const useGraphDrawer = () => {
  const context = useContext(GraphDrawerContext)
  if (!context) throw new Error('useGraphDrawer must be used within a GraphDrawerProvider')
  return context
}
