import { DrawerHeader } from '@heroui/react'
import { useGraphDrawer } from '../../../hooks/use-graph-drawer'

const GraphDrawerHeader = () => {
  const { selectedField, selectedNode } = useGraphDrawer()

  if (!selectedNode) return null

  return (
    <DrawerHeader className="flex flex-col gap-1">
      <p>Prefill</p>
      <p className="text-sm font-normal text-gray-500">
        {selectedField ? (
          <>
            Select mapping for <strong>{selectedField.fieldKey}</strong> in <strong>{selectedNode.title}</strong>
          </>
        ) : (
          <>
            Prefill fields for <strong>{selectedNode.title}</strong>
          </>
        )}
      </p>
    </DrawerHeader>
  )
}

export default GraphDrawerHeader
