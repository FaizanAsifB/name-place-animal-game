import { Outlet } from 'react-router-dom'

const RootLayout = () => {
  return (
    <div className="min-h-screen bg-cover grid-cols-layout bg-main-bg font-display lg:py-28">
      <main className="container min-h-screen col-span-1 col-start-2 lg:border-2 text-light lg:px-8">
        <Outlet />
      </main>
    </div>
  )
}
export default RootLayout
