import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Info } from 'lucide-react'
import Guide from '../Guide'

const GuideModal = () => {
  return (
    <Dialog>
      <DialogTrigger
        className="h-6 col-start-1 row-start-1 w-fit lg:hidden"
        asChild
      >
        <Button variant={'icon'} size={'icon'}>
          <Info />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <Guide className="max-w-[22rem] my-6 mx-auto" />
      </DialogContent>
    </Dialog>
  )
}
export default GuideModal
