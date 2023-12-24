import { PlayerData } from '../../lib/types'
import { getUserInfo } from '../../utils/helpers'
type UserInfoProps = {
  userId: string
  users: PlayerData[]
}

const UserInfo = ({ userId, users }: UserInfoProps) => {
  const user = getUserInfo(users, userId)
  return (
    <p className="flex">
      <img src={user?.photoUrl} alt="" className="w-8 h-8" />
      <span>{user?.displayName}</span>
    </p>
  )
}
export default UserInfo
