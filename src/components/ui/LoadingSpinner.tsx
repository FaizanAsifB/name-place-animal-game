import { Loader2 } from 'lucide-react'
import { twMerge } from 'tailwind-merge'

const LoadingSpinner = ({ className = '' }: { className?: string }) => {
  return (
    <Loader2 className={twMerge('animate-spin size-8 lg:size-10', className)} />
  )
}
export default LoadingSpinner
