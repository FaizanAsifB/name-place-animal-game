import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useContext, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AuthContext } from '../../../context/AuthContext'
import { useOnSnapShot } from '../../../hooks/useOnSnapShot'
import { getAllCategories, getCategoryCount } from '../utils/utils'
import AddCategory from './AddCategory'
import { Button } from '@/components/ui/button'
import { Categories, FireStoreError } from '@/lib/types'

const CategoriesList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const currentUser = useContext(AuthContext)
  const params = useParams()

  const { data, error } = useOnSnapShot({
    docRef: 'categories',
    roomId: params.roomId!,
  }) as { data: Categories; error: FireStoreError }

  const addedCategories = getAllCategories(data)
  const categoryCount = getCategoryCount(data?.custom[currentUser!.uid])

  // if (isPending) {
  //   return <span>Loading...</span>
  // }

  if (error) {
    return <span>Error: {error.message}</span>
  }
  return (
    <section className="col-span-2 rounded-lg bg-amber-700/50">
      <div className="flex justify-between">
        <h2>Available Categories</h2>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button variant={'ghost'}>
              + Add Categories {categoryCount}/2
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Custom Categories</DialogTitle>
              <DialogDescription>
                Add two categories of your choice.
              </DialogDescription>
            </DialogHeader>
            <AddCategory
              setIsModalOpen={setIsModalOpen}
              userCategories={data?.custom[currentUser!.uid]}
              allCategories={addedCategories}
              defaultCategories={data?.default}
            />
          </DialogContent>
        </Dialog>
      </div>
      <ul className="grid grid-cols-4 ">
        {data?.default.map((category: string) => (
          <li key={category}>{category}</li>
        ))}
        {addedCategories?.map(category => (
          <li key={category.title}>{category.title}</li>
        ))}
      </ul>
    </section>
  )
}
export default CategoriesList
