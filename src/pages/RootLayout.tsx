import { Outlet } from 'react-router-dom'
import Header from '../layout/Header'

const RootLayout = () => {
  return (
    <div className="grid min-h-screen bg-cover grid-cols-layout bg-main-bg font-display lg:py-28">
      <main className="flex flex-col col-start-2 text-lg lg:border-2 lg:text-2xl text-light lg:px-8">
        <Header />
        <Outlet />
      </main>
    </div>
  )
}
export default RootLayout
