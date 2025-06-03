import { DrawerBody } from '@heroui/react'
import { useGraphDrawer } from '../../../hooks/use-graph-drawer'
import GraphDrawerTargets from './graph-drawer-targets'
import GraphDrawerFields from './graph-drawer-fields'

const GraphDrawerBody = () => {
  const { selectedField } = useGraphDrawer()

  return <DrawerBody>{selectedField ? <GraphDrawerTargets /> : <GraphDrawerFields />}</DrawerBody>
}

export default GraphDrawerBody
