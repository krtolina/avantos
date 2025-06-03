import { Accordion, AccordionItem } from '@heroui/react'
import FormItemBasic from '../../form/form-item-basic'
import { useGraphDrawer } from '../../../hooks/use-graph-drawer'

const GraphDrawerTargets = () => {
  const { selectedNode, predecessorsMap, formMap, selectedMapping, handleMappingSelect } = useGraphDrawer()

  if (!selectedNode || !predecessorsMap || !formMap) return null

  return (
    <Accordion selectionMode="multiple">
      {predecessorsMap[selectedNode.id].map((node) => (
        <AccordionItem key={node.id} title={node.data.name}>
          <ul className="flex flex-col gap-2">
            {Object.keys(formMap[node.data.component_id].field_schema.properties).map((key) => (
              <FormItemBasic
                key={key}
                isSelected={Boolean(
                  selectedMapping && selectedMapping.fieldKey === key && selectedMapping.nodeId === node.id
                )}
                onClick={() => handleMappingSelect({ nodeId: node.id, fieldKey: key })}
                label={key}
              />
            ))}
          </ul>
        </AccordionItem>
      ))}
    </Accordion>
  )
}

export default GraphDrawerTargets
