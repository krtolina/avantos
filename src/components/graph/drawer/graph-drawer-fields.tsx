import { useMemo } from 'react'
import { useGraphDrawer } from '../../../hooks/use-graph-drawer'
import { getActiveFieldLabel, getFieldKeyFromField, getMappingMap } from '../../../utils/graph-utils'
import FormFields from '../../form/form-fields'

const GraphDrawerFields = () => {
  const { selectedNode, formMap, nodeMap, mappings, handleFieldSelect, handleRemoveMapping, globalGroupMap } =
    useGraphDrawer()

  const mappingMap = useMemo(() => getMappingMap(mappings), [mappings])

  if (!selectedNode || !formMap || !nodeMap || !globalGroupMap) return null

  return (
    <FormFields
      fieldKeys={Object.keys(formMap[selectedNode.data.component_id].field_schema.properties)}
      isFieldActive={(fieldKey) => Boolean(mappingMap[getFieldKeyFromField({ nodeId: selectedNode.id, fieldKey })])}
      getActiveLabel={(fieldKey) =>
        getActiveFieldLabel({
          mapping: mappingMap[getFieldKeyFromField({ nodeId: selectedNode.id, fieldKey })],
          nodeMap,
          globalGroupMap,
        })
      }
      getBasicLabel={(fieldKey) => fieldKey}
      onRemove={(fieldKey) => handleRemoveMapping({ nodeId: selectedNode.id, fieldKey })}
      onSelect={(fieldKey) => handleFieldSelect({ nodeId: selectedNode.id, fieldKey })}
    />
  )
}

export default GraphDrawerFields
