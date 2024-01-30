import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'

import { Outlet } from 'react-router-dom'

const RootLayout = () => {
  return (
    <div className="bg-cover bg-main-bg font-display">
      <main className="flex min-h-screen p-4 md:p-6 xl:container lg:p-8 ">
        <div className="flex flex-col flex-1 lg:border-main-border lg:border-2 lg:shadow-main lg:px-8 lg:rounded-lg">
          <Outlet />
        </div>
      </main>
      <Toaster />
      <Sonner expand closeButton richColors />
    </div>
  )
}
export default RootLayout
