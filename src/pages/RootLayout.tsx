import { Toaster } from '@/components/ui/toaster'
import { Outlet } from 'react-router-dom'

const RootLayout = () => {
  return (
    <div className="bg-cover bg-main-bg font-display">
      <main className="flex min-h-screen p-4 md:p-8 xl:container lg:p-8 ">
        <div className="flex flex-col flex-1 lg:border-2">
          <Outlet />
        </div>
      </main>
      <Toaster />
    </div>
  )
}
export default RootLayout
