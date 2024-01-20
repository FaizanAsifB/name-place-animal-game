import { H1 } from '@/components/typography/Headings'
import MainHeader from '@/layout/MainHeader.tsx'
import SettingsForm from './SettingsForm.tsx'

const GameCreation = () => {
  return (
    <>
      <MainHeader hasHomeButton />
      <div className="p-8 rounded-lg bg-bg-primary">
        <H1 className="text-center">Game Settings</H1>
        <SettingsForm />
      </div>
    </>
  )
}
export default GameCreation
