import { Spinner } from '@heroui/react'

const Loader = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <Spinner variant="wave" size="lg" />
    </div>
  )
}

export default Loader
