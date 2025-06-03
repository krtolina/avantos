import { useMemo } from 'react'
import { useGraphDrawer } from '../../../hooks/use-graph-drawer'
import FormItemActive from '../../form/form-item-active'
import FormItemBasic from '../../form/form-item-basic'
import { getFieldKey, getMappingMap } from '../../../utils/graph-utils'

const GraphDrawerFields = () => {
  const { selectedNode, formMap, nodeMap, mappings, handleFieldSelect, handleRemoveMapping } = useGraphDrawer()

  const mappingMap = useMemo(() => getMappingMap(mappings), [mappings])

  if (!selectedNode || !formMap || !nodeMap) return null

  return (
    <ul className="flex flex-col gap-2">
      {Object.keys(formMap[selectedNode.data.component_id].field_schema.properties).map((key) => {
        const mapping = mappingMap[getFieldKey({ nodeId: selectedNode.id, fieldKey: key })]

        return mapping ? (
          <FormItemActive
            key={key}
            label={`${mapping.field.fieldKey}: ${nodeMap[mapping.target.nodeId].data.name}.${mapping.target.fieldKey}`}
            onRemove={() => handleRemoveMapping({ nodeId: selectedNode.id, fieldKey: key })}
          />
        ) : (
          <FormItemBasic
            key={key}
            label={key}
            onClick={() => handleFieldSelect({ nodeId: selectedNode.id, fieldKey: key })}
          />
        )
      })}
    </ul>
  )
}

export default GraphDrawerFields
