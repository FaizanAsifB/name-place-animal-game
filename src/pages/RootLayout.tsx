import { Outlet } from 'react-router-dom'

const RootLayout = () => {
  return (
    <div className="h-screen bg-cover lg:p-20 bg-main-bg font-display">
      <main className="container h-full lg:border-2">
        <Outlet />
      </main>
    </div>
  )
}
export default RootLayout
