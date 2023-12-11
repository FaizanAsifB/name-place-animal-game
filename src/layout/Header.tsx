import { Link, useMatch } from 'react-router-dom'
import img from '../assets/imgs/note-1173544_640.png'

const Header = () => {
  const match = useMatch('game-creation')

  return (
    <div className="flex items-center justify-between py-4">
      {match && (
        <Link to="/" className="btn">
          Back
        </Link>
      )}
      <img src={img} alt="" className="w-12 ml-auto aspect-square md:w-24" />
    </div>
  )
}
export default Header
