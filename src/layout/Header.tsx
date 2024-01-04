import { Button } from '@/components/ui/button'
import { Undo2 } from 'lucide-react'
import { Link, useMatch } from 'react-router-dom'
import img from '../assets/imgs/note-1173544_640.png'

const Header = () => {
  const match = useMatch('game-creation')

  return (
    <div className="flex items-center justify-between py-8">
      {match && (
        <Button asChild>
          <Link to="/">
            <Undo2 />
            Back
          </Link>
        </Button>
      )}
      <img src={img} alt="" className="w-12 ml-auto aspect-square md:w-24" />
    </div>
  )
}
export default Header
