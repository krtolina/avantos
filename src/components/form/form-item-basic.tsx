import { Button } from '@heroui/react'
import { Database } from 'lucide-react'

type Props = {
  label: string
  isSelected?: boolean
  onClick?: () => void
}

const FormItemBasic = ({ isSelected, onClick, label }: Props) => {
  return (
    <li className="flex items-center justify-between">
      <Button
        variant={isSelected ? 'solid' : 'flat'}
        className="flex items-center gap-2 w-full justify-start"
        startContent={<Database className="h-5 w-5 text-gray-500" />}
        onPress={onClick}
      >
        {label}
      </Button>
    </li>
  )
}

export default FormItemBasic
