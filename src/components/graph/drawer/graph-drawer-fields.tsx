import { useMemo } from 'react'
import { useGraphDrawer } from '../../../hooks/use-graph-drawer'
import { getActiveFieldLabel, getFieldKeyFromField, getMappingMap } from '../../../utils/graph-utils'
import FormFields from '../../form/form-fields'

const GraphDrawerFields = () => {
  const { selectedNode, nodeMap, mappings, handleFieldSelect, handleRemoveMapping } = useGraphDrawer()

  const mappingMap = useMemo(() => getMappingMap(mappings), [mappings])

  if (!selectedNode || !nodeMap) return null

  return (
    <FormFields
      fieldKeys={selectedNode.fields}
      isFieldActive={(fieldKey) => Boolean(mappingMap[getFieldKeyFromField({ nodeId: selectedNode.id, fieldKey })])}
      getActiveLabel={(fieldKey) =>
        getActiveFieldLabel({
          mapping: mappingMap[getFieldKeyFromField({ nodeId: selectedNode.id, fieldKey })],
          nodeMap,
        })
      }
      getBasicLabel={(fieldKey) => fieldKey}
      onRemove={(fieldKey) => handleRemoveMapping({ nodeId: selectedNode.id, fieldKey })}
      onSelect={(fieldKey) => handleFieldSelect({ nodeId: selectedNode.id, fieldKey })}
    />
  )
}

export default GraphDrawerFields
