import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { updateGameState } from '@/utils/http'
import { Home } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Button } from './button'

const HomeButton = ({ isHost }: { isHost?: boolean | undefined }) => {
  const navigate = useNavigate()
  const params = useParams()

  function handleGoToHome() {
    //TODO implement delete lobby logic
    //Delete lobby data
    updateGameState('CANCELLED', params.roomId)
    //Return to Home
    navigate('/', { replace: true })
  }
  return (
    <>
      {isHost ? (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              className="col-start-1 row-start-1 w-fit"
              variant={'outline'}
              size={'md'}
            >
              <Home />
              Home
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                Leaving the lobby as the host will cancel it for all players!
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleGoToHome}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ) : (
        <Button
          asChild
          className="col-start-1 row-start-1 w-fit"
          variant={'outline'}
          size={'md'}
        >
          <Link to="/">
            <Home />
            Home
          </Link>
        </Button>
      )}
    </>
  )
}
export default HomeButton
