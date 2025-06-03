import { Button, DrawerFooter } from '@heroui/react'
import { useGraphDrawer } from '../../../hooks/use-graph-drawer'

const GraphDrawerFooter = () => {
  const { selectedField, selectedMapping, handleCloseDrawer, handleRemoveFieldSelection, handleAddMapping } =
    useGraphDrawer()

  return (
    <DrawerFooter>
      {selectedField ? (
        <Button color="danger" variant="flat" key="back" onPress={handleRemoveFieldSelection}>
          Back
        </Button>
      ) : (
        <Button color="danger" variant="flat" key="cancel" onPress={handleCloseDrawer}>
          Close
        </Button>
      )}
      {selectedField ? (
        <Button color="primary" isDisabled={!selectedMapping} onPress={handleAddMapping}>
          Select
        </Button>
      ) : null}
    </DrawerFooter>
  )
}

export default GraphDrawerFooter
