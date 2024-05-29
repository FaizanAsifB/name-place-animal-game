import { H3 } from '@/components/typography/Headings'
import { P } from '@/components/typography/TextContent'

type SettingProps = {
  icon?: React.ReactNode
  title: string
  description: string
  children: React.ReactNode
}

const Setting = ({ children, icon, title, description }: SettingProps) => {
  return (
    <li className="space-y-6 text-center lg:text-start lg:grid lg:grid-cols-2 lg:items-center">
      <div className="lg:grid lg:gap-2">
        <H3 className="flex items-center justify-center gap-1 lg:justify-start ">
          {icon}
          {title}
        </H3>
        <P className="hidden text-base lg:block">{description}</P>
      </div>

      {children}
    </li>
  )
}
export default Setting
