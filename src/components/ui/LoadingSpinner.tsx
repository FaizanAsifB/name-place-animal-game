import { BTN_ICON_SIZE } from '@/config/gameConfig'
import { Loader2 } from 'lucide-react'

const LoadingSpinner = ({ size = BTN_ICON_SIZE }: { size?: number }) => {
  return <Loader2 size={size} className="animate-spin" />
}
export default LoadingSpinner
