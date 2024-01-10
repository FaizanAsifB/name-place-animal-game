import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { FirebaseUser } from '@/context/AuthContext'
import { addedCategoriesAtom, categoriesAtom } from '@/context/atoms'
import { useAtomValue } from 'jotai'
import { useState } from 'react'
import { getCategoryCount } from '../utils/utils'
import AddCategories from './AddCategories'

type AddCategoriesButton = {
  currentUser: FirebaseUser | null
}

const AddCategoriesButton = ({ currentUser }: AddCategoriesButton) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const categoriesData = useAtomValue(categoriesAtom)
  const addedCategories = useAtomValue(addedCategoriesAtom)

  console.log(categoriesData)

  const categoryCount = getCategoryCount(
    categoriesData?.custom?.[currentUser!.uid]
  )

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        <Button variant={'ghost'}>
          + <span className="hidden">Add Categories</span> {categoryCount}/2
        </Button>
      </DialogTrigger>
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
