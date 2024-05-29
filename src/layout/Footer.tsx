import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="flex items-end justify-center gap-4 pt-8 pb-4 text-sm lg:text-base col-span-full text-foreground/40">
      <Link to="/">Terms</Link>
      <Link to="/">Privacy</Link>
      <Link to="/credits">Credits</Link>
    </footer>
  )
}
export default Footer
