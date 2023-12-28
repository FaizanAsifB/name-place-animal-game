import { useMatch, useNavigate } from 'react-router-dom'
import img from '../assets/imgs/note-1173544_640.png'
import Button from '../components/ui/Button'

const Header = () => {
  const match = useMatch('game-creation')
  const navigate = useNavigate()

  return (
    <div className="flex items-center justify-between py-4">
      {match && <Button onClick={() => navigate('/')}>Back</Button>}
      <img src={img} alt="" className="w-12 ml-auto aspect-square md:w-24" />
    </div>
  )
}
export default Header
