import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getUserInfo } from '@/utils/helpers'

import { useFetchPlayers } from '@/hooks/useFetchPlayers'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import { P } from '../typography/TextContent'

type UserInfoProps = {
  userId: string
  className?: string
  avatarSize?: string
}

const UserInfo = ({
  userId,
  className = '',
  avatarSize = '',
}: UserInfoProps) => {
  const { users, /* isError, error, */ isPending } = useFetchPlayers()

  const { displayName, photoUrl } = getUserInfo(users, userId)

  return (
    <div /*  className="flex" */>
      {isPending ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <P
          className={cn(
            'flex items-center gap-2 uppercase font-semibold ',
            className
          )}
        >
          <Avatar className={avatarSize}>
            <AvatarImage src={photoUrl} />
            <AvatarFallback>
              <img src="/images/avatars/emptyAvatar.svg" alt="empty slot" />
            </AvatarFallback>
          </Avatar>
          <span>{displayName}</span>
        </P>
      )}
    </div>
  )
}
export default UserInfo
