import { Outlet } from 'react-router-dom'
import Header from './Header'

const RootLayout = () => {
  return (
    <div className="grid min-h-screen grid-cols-layout bg-primary-gradient font-display lg:py-28">
      <main className="flex flex-col col-start-2 space-y-8 text-lg lg:border-2 lg:text-2xl lg:space-y-16 text-light lg:px-8">
        <Header />
        <Outlet />
      </main>
    </div>
  )
}
export default RootLayout
