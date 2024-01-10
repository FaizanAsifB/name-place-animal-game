import { H3 } from '@/components/typography/Headings'
import { addedCategoriesAtom, categoriesAtom } from '@/context/atoms'
import { useAtomValue } from 'jotai'

const CategoriesList = () => {
  // const params = useParams()

  const categoriesData = useAtomValue(categoriesAtom)
  const addedCategories = useAtomValue(addedCategoriesAtom)

  console.log(categoriesData)

  // const addedCategories = getAllCategories(data)

  // if (isPending) {
  //   return <span>Loading...</span>
  // }

  // if (error) {
  //   return <span>Error: {error.message}</span>
  // }
  return (
    <section className="col-span-3 rounded-lg bg-primary-dark">
      <div className="flex justify-between">
        <H3 className="text-center">Available Categories</H3>
        {/* <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
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
        </Dialog> */}
      </div>
      <ul className="grid grid-cols-4 ">
        {categoriesData?.default?.map((category: string) => (
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
