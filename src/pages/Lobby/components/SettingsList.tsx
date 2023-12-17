import { useFetchSettings } from '../../../hooks/useFetchSettings'

const SettingsList = () => {
  const { data, isPending, isError, error } = useFetchSettings()

  if (isPending) {
    return <span>Loading...</span>
  }

  if (isError) {
    return <span>Error: {error.message}</span>
  }

  return (
    <div className="bg-amber-700/50">
      <h2>Lobby Settings</h2>
      <ul className="grid grid-cols-4 ">
        <li>
          <h5>Rounds</h5>
          <p>{data?.settings.rounds}</p>
        </li>
        <li>
          <h5>Time Per Round</h5>
          <p>{data?.settings.roundTime}</p>
        </li>
        <li>
          <h5>End Mode</h5>
          <p>
            {data?.settings.endMode === 'ROUND-TIMER'
              ? 'Round Timer'
              : 'Fastest Finger'}
          </p>
        </li>
        <li></li>
      </ul>
    </div>
  )
}
export default SettingsList
