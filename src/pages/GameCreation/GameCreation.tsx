import Header from '@/layout/Header'
import SettingsForm from './SettingsForm'

const GameCreation = () => {
  return (
    <>
      <Header />
      <div className="py-12 rounded-lg bg-bg-primary">
        <h1 className="mb-12">Game Settings</h1>
        <SettingsForm />
      </div>
    </>
  )
}
export default GameCreation
