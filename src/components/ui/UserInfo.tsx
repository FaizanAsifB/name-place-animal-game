import { CircularProgress } from '@mui/material'
import { useFetchPlayers } from '../../hooks/useFetchPlayers'
import { getUserInfo } from '../../utils/helpers'
type UserInfoProps = {
  userId: string
}

const UserInfo = ({ userId }: UserInfoProps) => {
  const { userInfo, isError, error, isPending } = useFetchPlayers(userId)

  let content

  if (isError) content = error?.message
  else if (isPending) content = <CircularProgress />
  else {
    content = (
      <>
        <img src={userInfo.photoUrl} alt="" className="w-8 h-8" />
        <span>{userInfo.displayName}</span>
      </>
    )
  }

  return <p className="flex">{content}</p>
}
export default UserInfo
