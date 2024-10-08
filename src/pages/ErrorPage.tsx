import { H1 } from '@/components/typography/Headings'
import { P } from '@/components/typography/TextContent'
import { Button } from '@/components/ui/button'
import { ErrorResponse, Link, useRouteError } from 'react-router-dom'

const Error = () => {
  const error = useRouteError() as ErrorResponse

  let title = 'An error occurred!'
  let message = 'Something went wrong!'

  if (error.status === 500) {
    message = error.data.message
  }

  if (error.status === 404) {
    title = 'Not found!'
    message = 'Could not find resource or page.'
  }

  console.error(error)
  return (
    <main className="grid min-h-screen bg-cover bg-main-bg font-display place-items-center">
      <div className="p-8 space-y-12 text-center border-2 rounded-lg bg-bg-primary">
        <H1>{title}</H1>
        <P>{message}</P>
        <div className="flex justify-between">
          <Button variant={'outline'} asChild>
            <Link to="/">Home</Link>
          </Button>
          <Button variant={'outline'} onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    </main>
  )
}
export default Error
