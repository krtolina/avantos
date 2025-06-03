import { Drawer, DrawerContent } from '@heroui/react'
import { useGraphDrawer } from '../../../hooks/use-graph-drawer'
import GraphDrawerFooter from './graph-drawer-footer'
import GraphDrawerHeader from './graph-drawer-header'
import GraphDrawerBody from './graph-drawer-body'

const GraphDrawer = () => {
  const { selectedNode, handleCloseDrawer } = useGraphDrawer()

  return (
    <Drawer isOpen={Boolean(selectedNode)} onClose={handleCloseDrawer} scrollBehavior="inside" size="xl">
      <DrawerContent>
        <>
          <GraphDrawerHeader />
          <GraphDrawerBody />
          <GraphDrawerFooter />
        </>
      </DrawerContent>
    </Drawer>
  )
}

export default GraphDrawer
