import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getUserInfo } from '@/utils/helpers'

import { useFetchPlayers } from '@/hooks/useFetchPlayers'

type UserInfoProps = {
  userId: string
}

const UserInfo = ({ userId }: UserInfoProps) => {
  const { users, isError, error, isPending } = useFetchPlayers()

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
