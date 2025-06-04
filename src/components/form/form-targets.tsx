import { Accordion, AccordionItem } from '@heroui/react'
import FormItemBasic from './form-item-basic'
import type { FormTargetProps } from '../../types/graph-drawer'

const FormTargets = ({
  groupIds,
  getGroupTitle,
  getTargetKeys,
  isTargetSelected,
  onTargetSelect,
  getTargetLabel,
}: FormTargetProps) => {
  return (
    <Accordion selectionMode="multiple">
      {groupIds.map((groupId) => (
        <AccordionItem key={groupId} title={getGroupTitle(groupId)}>
          <ul className="flex flex-col gap-2">
            {getTargetKeys(groupId).map((key) => (
              <FormItemBasic
                key={key}
                label={getTargetLabel(groupId, key)}
                isSelected={isTargetSelected(groupId, key)}
                onClick={() => onTargetSelect(groupId, key)}
              />
            ))}
          </ul>
        </AccordionItem>
      ))}
    </Accordion>
  )
}

export default FormTargets
