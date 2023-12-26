import { CircularProgress } from '@mui/material'
import { useFetchPlayers } from '../../hooks/useFetchPlayers'
import { getUserInfo } from '../../utils/helpers'
type UserInfoProps = {
  userId: string
}

const UserInfo = ({ userId }: UserInfoProps) => {
  const { userInfo, isError, error, isPending } = useFetchPlayers()

  let content

  if (isError) content = error?.message
  else if (isPending) content = <CircularProgress />
  else {
    const { displayName, photoUrl } = getUserInfo(userInfo, userId)

    content = (
      <>
        <img src={photoUrl} alt="" className="w-8 h-8" />
        <span>{displayName}</span>
      </>
    )
  }

  return <p className="flex">{content}</p>
}
export default UserInfo
