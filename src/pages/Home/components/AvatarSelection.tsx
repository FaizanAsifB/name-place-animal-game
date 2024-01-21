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
    <div className="relative w-40 md:w-60 lg:w-64 xl:w-72 aspect-square">
      <img
        src={data.avatarImages[avatarIndex].path}
        alt="character logo"
        className="w-full h-full"
      />
      <button
        className="absolute bottom-0 right-0 p-1 bg-white border-4 border-white rounded-full hover:bg-orange-400"
        onClick={handleDpChange}
      >
        <RefreshCw size={30} strokeWidth={2.5} />
      </button>
    </div>
  )
}
export default AvatarSelection
