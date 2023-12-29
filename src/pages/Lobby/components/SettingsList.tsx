import { useFetchSettings } from '../../../hooks/useFetchSettings'

const SettingsList = () => {
  const { data, isPending, isError, error } = useFetchSettings()

  if (isPending) {
    return <span>Loading...</span>
  }

  if (isError) {
    return <span>Error: {error.message}</span>
  }
  console.log(Object.entries(data?.settings))
  return (
    <section className="col-span-2 rounded-lg bg-amber-700/50">
      <h2 className="text-center">Lobby Settings</h2>
      <ul className="grid grid-cols-2 ">
        {Object.entries(data?.settings).map(setting => (
          <li key={setting[0]} className="flex">
            <h5>{setting[0]}</h5>
            <p>{setting[1]}</p>
          </li>
        ))}
        {/* <li>
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
        </li> */}
      </ul>
    </section>
  )
}
export default SettingsList
