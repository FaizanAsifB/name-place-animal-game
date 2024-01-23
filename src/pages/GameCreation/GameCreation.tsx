import { H1 } from '@/components/typography/Headings'
import Logo from '@/components/ui/Logo.tsx'
import SettingsForm from './SettingsForm.tsx'

import HomeButton from '@/components/ui/HomeButton.tsx'

const GameCreation = () => {
  return (
    <>
      <header className="grid items-center grid-cols-4 py-8 ">
        <HomeButton />
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
