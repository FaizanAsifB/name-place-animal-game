import { Button } from '@/components/ui/button'
import Header from '@/layout/Header'
import { Home } from 'lucide-react'
import { Link } from 'react-router-dom'
import SettingsForm from './SettingsForm'

const GameCreation = () => {
  return (
    <>
      <Header>
        <Button
          asChild
          className="col-start-1 row-start-1 w-fit"
          variant={'outline'}
        >
          <Link to="/">
            <Home />
            Home
          </Link>
        </Button>
      </Header>
      <div className="py-12 rounded-lg bg-bg-primary">
        <h1 className="mb-12">Game Settings</h1>
        <SettingsForm />
      </div>
    </>
  )
}
export default GameCreation
