import { ReactNode } from 'react'
import { H2 } from '../typography/Headings'

type GameHeaderProps = {
  children?: ReactNode
  title: string
}

//TODO CHANGE TITLE prop name

const GameHeader = ({ children, title }: GameHeaderProps) => {
  return (
    <header className="grid items-center grid-cols-4 pt-6 justify-items-center">
      <H2 className="col-start-1">{title}</H2>
      <h1 className="col-span-2 col-start-2 text-center lg:text-7xl">LOGO</h1>
      {children}
    </header>
  )
}
export default GameHeader
