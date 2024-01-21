import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getUserInfo } from '@/utils/helpers'

import { useFetchPlayers } from '@/hooks/useFetchPlayers'
import { twMerge } from 'tailwind-merge'
import LoadingSpinner from './LoadingSpinner'

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
    <>
      {isPending ? (
        <LoadingSpinner />
      ) : (
        <article
          className={twMerge(
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
          <div>
            <span>{displayName}</span>
          </div>
        </article>
      )}
    </>
  )
}
export default UserInfo
