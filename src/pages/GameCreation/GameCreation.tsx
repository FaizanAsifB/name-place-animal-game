import Header from '@/layout/Header'
import SettingsForm from './SettingsForm'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'

const GameCreation = () => {
  return (
    <>
      <Header>
        <Button asChild className="w-fit">
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
