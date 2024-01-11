import { ReactNode } from 'react'

const MainHeader = ({ children }: { children?: ReactNode }) => {
  return (
    <header className="grid items-center grid-cols-4 py-8 ">
      <h1 className="col-span-2 col-start-2 text-center lg:text-7xl">LOGO</h1>
      {children}
    </header>
  )
}
export default MainHeader
