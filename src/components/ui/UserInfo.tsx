import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getUserInfo } from '@/utils/helpers'

import { useFetchPlayers } from '@/hooks/useFetchPlayers'
import { Loader2 } from 'lucide-react'

type UserInfoProps = {
  userId: string
}

const UserInfo = ({ userId }: UserInfoProps) => {
  const { users, /* isError, error, */ isPending } = useFetchPlayers()

  const { displayName, photoUrl } = getUserInfo(users, userId)

  return (
    <div className="flex">
      {isPending ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <p className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={photoUrl} />
            <AvatarFallback>
              <img src="/images/avatars/emptyAvatar.svg" alt="empty slot" />
            </AvatarFallback>
          </Avatar>
          <span>{displayName}</span>
        </p>
      )}
    </div>
  )
}
export default UserInfo
