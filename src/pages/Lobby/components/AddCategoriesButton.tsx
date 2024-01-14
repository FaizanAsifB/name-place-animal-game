import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { addedCategoriesAtom, categoriesAtom } from '@/context/atoms'
import { useAtomValue } from 'jotai'
import { Pencil, Plus } from 'lucide-react'
import { useState } from 'react'
import { getCategoryCount } from '../utils/utils'
import AddCategories from './AddCategories'
import { User } from 'firebase/auth'

type AddCategoriesButton = {
  currentUser: User | null
}

const AddCategoriesButton = ({ currentUser }: AddCategoriesButton) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const categoriesData = useAtomValue(categoriesAtom)
  const addedCategories = useAtomValue(addedCategoriesAtom)

  const categoryCount = getCategoryCount(
    categoriesData?.custom?.[currentUser!.uid]
  )

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button variant={'ghost'} size={'icon'} className="px-2">
                {categoryCount === 2 ? (
                  <Pencil height={16} width={16} />
                ) : (
                  <Plus height={16} width={16} />
                )}
                {categoryCount}/2
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Add two categories of your choice</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Custom Categories</DialogTitle>
          <DialogDescription>
            Add two categories of your choice.
          </DialogDescription>
        </DialogHeader>
        <AddCategories
          setIsModalOpen={setIsModalOpen}
          userCategories={categoriesData?.custom?.[currentUser!.uid]}
          allCategories={addedCategories}
          defaultCategories={categoriesData?.default}
        />
      </DialogContent>
    </Dialog>
  )
}
export default AddCategoriesButton
