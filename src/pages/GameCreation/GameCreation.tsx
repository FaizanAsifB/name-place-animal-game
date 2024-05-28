import { H1 } from '@/components/typography/Headings'
import Logo from '@/components/ui/Logo.tsx'
import SettingsForm from './SettingsForm.tsx'

import { Button } from '@/components/ui/button.tsx'
import { Home } from 'lucide-react'
import { Link } from 'react-router-dom'

const GameCreation = () => {
  return (
    <>
      <header className="grid items-center grid-cols-4 py-8 ">
        <Button
          className="col-start-1 row-start-1 w-fit hover:bg-orange-700/40"
          variant={'outline'}
          size={'md'}
          asChild
        >
          <Link to="/" replace>
            <Home />
            Home
          </Link>
        </Button>
        <Logo />
      </header>
      <div className="p-8 rounded-lg bg-bg-primary">
        <H1 className="text-center">Game Settings</H1>
        <SettingsForm />
      </div>
    </>
  )
}
export default GameCreation
