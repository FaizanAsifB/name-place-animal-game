import { H1 } from '@/components/typography/Headings'
import { Button } from '@/components/ui/button'
import Header from '@/layout/Header'
import { Home } from 'lucide-react'
import { Link } from 'react-router-dom'
import SettingsForm from './SettingsForm.tsx'

const GameCreation = () => {
  return (
    <>
      <Header>
        <Button
          asChild
          className="col-start-1 row-start-1 w-fit"
          variant={'outline'}
          size={'md'}
        >
          <Link to="/">
            <Home />
            Home
          </Link>
        </Button>
      </Header>
      <div className="p-8 rounded-lg bg-bg-primary">
        <H1 className="text-center">Game Settings</H1>
        <SettingsForm />
      </div>
    </>
  )
}
export default GameCreation
