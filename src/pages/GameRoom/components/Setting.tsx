type SettingProps = {
  icon?: React.ReactNode
  title: string
  description: string
  children: React.ReactNode
}

const Setting = ({ children, icon, title, description }: SettingProps) => {
  return (
    <li className="grid items-center gap-2 border-2 border-primary md:grid-cols-2">
      <div className="flex items-center gap-2">
        {icon}
        <div>
          <h2>{title}</h2>
          <p className="text-md">{description}</p>
        </div>
      </div>
      {children}
    </li>
  )
}
export default Setting
