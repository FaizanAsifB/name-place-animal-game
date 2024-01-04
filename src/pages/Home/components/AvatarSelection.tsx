import { useAtom } from 'jotai'
import { avatarAtom, avatarImages } from '../../../utils/utils'
import { RotateCcw } from 'lucide-react'

const AvatarSelection = () => {
  const [avatarIndex, setAvatarIndex] = useAtom(avatarAtom)

  function handleDpChange() {
    if (avatarIndex === avatarImages.length - 1) setAvatarIndex(0)
    setAvatarIndex(prev => prev + 1)
  }

  return (
    <div className="relative w-40 md:w-60 lg:w-64 xl:w-[22rem] aspect-square">
      <img
        src={avatarImages[avatarIndex].path}
        alt="character logo"
        className="absolute bottom-0 left-0 right-0 w-full min-h-full"
      />
      <button
        className="absolute bottom-0 right-0 mr-1"
        onClick={handleDpChange}
      >
        <RotateCcw size={24} />
      </button>
    </div>
  )
}
export default AvatarSelection
