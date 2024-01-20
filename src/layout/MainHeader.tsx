import { Button } from '@/components/ui/button'
import { Home } from 'lucide-react'
import { ReactNode } from 'react'
import { Link } from 'react-router-dom'

type MainHeaderProps = {
  children?: ReactNode
  hasHomeButton?: true | undefined
  onClick?: () => void
}

const MainHeader = ({ children, hasHomeButton, onClick }: MainHeaderProps) => {
  return (
    <header className="grid items-center grid-cols-4 py-8 ">
      {hasHomeButton && (
        <Button
          asChild
          className="col-start-1 row-start-1 w-fit"
          variant={'outline'}
          size={'md'}
          onClick={onClick}
        >
          <Link to="/">
            <Home />
            Home
          </Link>
        </Button>
      )}
      <h1 className="col-span-2 col-start-2 text-center lg:text-9xl">LOGO</h1>
      {children}
    </header>
  )
}
export default MainHeader
