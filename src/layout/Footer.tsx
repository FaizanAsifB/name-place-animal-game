import { Muted } from '@/components/typography/TextContent'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="flex justify-center row-start-3 gap-4 pt-8 pb-4 text-base col-span-full">
      <Link to="/">
        <Muted>Terms</Muted>
      </Link>
      <Link to="/">
        <Muted>Privacy</Muted>
      </Link>
      <Link to="/">
        <Muted>Assets</Muted>
      </Link>
    </footer>
  )
}
export default Footer
