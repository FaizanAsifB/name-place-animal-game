import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getUserInfo } from '@/utils/helpers'
import { PlayerData } from '@/lib/types'

type UserInfoProps = {
  userId: string
  users: PlayerData[]
}

const UserInfo = ({ userId, users }: UserInfoProps) => {
  const { displayName, photoUrl } = getUserInfo(users, userId)

  return (
    <p className="flex">
      <Avatar>
        <AvatarImage src={photoUrl} />
        <AvatarFallback>
          <img src="/images/avatars/emptyAvatar.svg" alt="empty slot" />
        </AvatarFallback>
      </Avatar>
      <span>{displayName}</span>
    </p>
  )
}
export default UserInfo
