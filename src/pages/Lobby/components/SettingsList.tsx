/* eslint-disable react-refresh/only-export-components */
import React from 'react'
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
    <section className="col-span-3 rounded-lg bg-primary-dark">
      <h2 className="text-center">Lobby Settings</h2>
      <ul className="grid grid-cols-2 ">
        {Object.entries(data?.settings).map(setting => (
          <li key={setting[0]} className="flex">
            <h5>{setting[0]}</h5>
            <p>{setting[1]}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
export default React.memo(SettingsList)
