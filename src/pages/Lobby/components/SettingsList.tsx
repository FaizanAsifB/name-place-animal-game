/* eslint-disable react-refresh/only-export-components */
import { H3, H5 } from '@/components/typography/Headings'
import { P } from '@/components/typography/TextContent'
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
      <H3 className="text-center">Lobby Settings</H3>
      <ul className="grid grid-cols-2 ">
        {Object.entries(data?.settings).map(setting => (
          <li key={setting[0]} className="flex items-center gap-2">
            <H5>{setting[1].title}:</H5>
            <p>{setting[1].value}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
export default React.memo(SettingsList)
