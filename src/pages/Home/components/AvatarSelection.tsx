import { getAvatarPath } from '@/utils/helpers'
import { useAtom } from 'jotai'
import { RefreshCw } from 'lucide-react'
import { avatarAtom } from '../../../context/atoms'
import data from '../../../data/data.json' /* assert { type: 'json' } */

const AvatarSelection = () => {
  const [avatarIndex, setAvatarIndex] = useAtom(avatarAtom)

  function handleDpChange() {
    if (avatarIndex === data.avatarImages.length - 1) return setAvatarIndex(0)
    return setAvatarIndex(prev => prev + 1)
  }

  return (
    <div className="relative w-40 md:text-lg lg:text-xl md:w-60 lg:w-64 xl:w-72 aspect-square">
      <img
        src={getAvatarPath(avatarIndex)}
        alt="character logo"
        className="w-full h-full"
      />
      <button
        className="absolute bottom-0 right-0 p-1 border-4 rounded-full border-primary bg-primary hover:bg-accent hover:text-secondary-foreground active:scale-90"
        onClick={handleDpChange}
      >
        <RefreshCw size={'1.5em'} strokeWidth={2.5} />
      </button>
    </div>
  )
}
export default AvatarSelection
