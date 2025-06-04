import { Accordion, AccordionItem } from '@heroui/react'
import FormItemBasic from './form-item-basic'
import type { FormTargetProps } from '../../types/graph'

const FormTargets = ({
  nodeIds,
  getNodeTitle,
  getFieldKeys,
  isFieldSelected,
  onFieldSelect,
  getFieldLabel,
}: FormTargetProps) => {
  return (
    <Accordion selectionMode="multiple">
      {nodeIds.map((nodeId) => (
        <AccordionItem key={nodeId} title={getNodeTitle(nodeId)}>
          <ul className="flex flex-col gap-2">
            {getFieldKeys(nodeId).map((key) => (
              <FormItemBasic
                key={key}
                label={getFieldLabel(nodeId, key)}
                isSelected={isFieldSelected(nodeId, key)}
                onClick={() => onFieldSelect(nodeId, key)}
              />
            ))}
          </ul>
        </AccordionItem>
      ))}
    </Accordion>
  )
}

export default FormTargets
