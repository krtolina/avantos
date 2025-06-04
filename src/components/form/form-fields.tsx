import type { FormFieldProps } from '../../types/graph'
import FormItemActive from './form-item-active'
import FormItemBasic from './form-item-basic'

const FormFields = ({
  fieldKeys,
  isFieldActive,
  getActiveLabel,
  onRemove,
  onSelect,
  getBasicLabel,
}: FormFieldProps) => {
  return (
    <ul className="flex flex-col gap-2">
      {fieldKeys.map((key) =>
        isFieldActive(key) ? (
          <FormItemActive key={key} label={getActiveLabel(key)} onRemove={() => onRemove(key)} />
        ) : (
          <FormItemBasic key={key} label={getBasicLabel(key)} onClick={() => onSelect(key)} />
        )
      )}
    </ul>
  )
}

export default FormFields
