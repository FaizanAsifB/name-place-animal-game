/* eslint-disable react-refresh/only-export-components */
import { H3, H5 } from '@/components/typography/Headings'
import React from 'react'
import { useFetchSettings } from '../../../hooks/useFetchSettings'
import { Skeleton } from '@/components/ui/skeleton'

const SettingsList = () => {
  const { data, isPending } = useFetchSettings()

  if (isPending) {
    return (
      <Skeleton className="rounded-lg col-span-full md:row-start-3 md:col-start-4" />
    )
  }

  return (
    <section className="p-2 rounded-lg col-span-full bg-primary-dark md:row-start-3 md:col-start-4">
      <H3 className="mb-2 text-center md:mb-4">Lobby Settings</H3>
      <ul className="grid grid-cols-[auto,auto] gap-x-2 md:grid-cols-1 md:gap-2 xl:grid-cols-2">
        {data &&
          Object.entries(data?.settings).map(setting => (
            <li
              key={setting[0]}
              className="flex items-center gap-2 md:mx-auto xl:mx-4"
            >
              <H5>{setting[1].title}:</H5>
              <p>{setting[1].value}</p>
            </li>
          ))}
      </ul>
    </section>
  )
}
export default React.memo(SettingsList)
