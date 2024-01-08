import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="flex justify-center gap-4 pb-2 text-base">
      <Link to="/">Terms</Link>
      <Link to="/">Privacy</Link>
      <Link to="/">Assets</Link>
    </footer>
  )
}
export default Footer
