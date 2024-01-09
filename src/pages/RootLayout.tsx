import { Outlet } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'

const RootLayout = () => {
  return (
    <div className="bg-cover bg-main-bg font-display">
      <main className="flex min-h-screen px-4 md:px-8 xl:container lg:py-8 ">
        <div className="flex flex-col flex-1 lg:border-2 lg:px-6">
          <Outlet />
        </div>
      </main>
      <Toaster />
    </div>
  )
}
export default RootLayout
