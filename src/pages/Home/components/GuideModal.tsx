import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { BTN_ICON_SIZE } from '@/config/gameConfig'
import { Info } from 'lucide-react'
import Guide from '../Guide'

const GuideModal = () => {
  return (
    <Dialog>
      <DialogTrigger className="col-start-1 row-start-1 lg:hidden" asChild>
        <Button variant={'ghost'} size={'none'}>
          <Info size={BTN_ICON_SIZE} strokeWidth={3} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <Guide className="max-w-[22rem] my-6 mx-auto" />
      </DialogContent>
    </Dialog>
  )
}
export default GuideModal
