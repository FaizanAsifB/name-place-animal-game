import { Toaster as Sonner } from '@/components/ui/sonner'
import { Toaster } from '@/components/ui/toaster'

import { Outlet } from 'react-router-dom'

const RootLayout = () => {
  return (
    <main className="flex flex-col flex-1 px-8 xl:container lg:border-main-border lg:border-2 lg:shadow-main lg:rounded-lg font-test lg:px-4">
      <Outlet />
      <Toaster />
      <Sonner expand closeButton richColors />
    </main>
  )
}
export default RootLayout
