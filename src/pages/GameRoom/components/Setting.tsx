type SettingProps = {
  icon?: React.ReactNode
  title: string
  description: string
  children: React.ReactNode
}

const Setting = ({ children, icon, title, description }: SettingProps) => {
  return (
    <li className="grid md:grid-cols-2">
      <div className="flex items-center gap-2">
        {icon}
        <div>
          <h5>{title}</h5>
          <p className="text-lg">{description}</p>
        </div>
      </div>
      {children}
    </li>
  )
}
export default Setting
