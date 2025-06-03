import { Button } from '@heroui/react'
import { X } from 'lucide-react'

type Props = {
  label: string
  onRemove?: VoidFunction
}

const FormItemActive = ({ label, onRemove }: Props) => {
  return (
    <li className="flex items-center gap-2 w-full justify-between px-4 py-1 bg-zinc-700 rounded-xl">
      <p className="text-sm">{label}</p>
      <Button size="sm" variant="light" color="danger" isIconOnly onPress={onRemove}>
        <X className="h-5 w-5" />
      </Button>
    </li>
  )
}

export default FormItemActive
