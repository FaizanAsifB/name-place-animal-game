import { H3 } from '@/components/typography/Headings'
import { addedCategoriesAtom, categoriesAtom } from '@/context/atoms'
import { useAtomValue } from 'jotai'

const CategoriesList = () => {
  // const params = useParams()

  const categoriesData = useAtomValue(categoriesAtom)
  const addedCategories = useAtomValue(addedCategoriesAtom)

  // const addedCategories = getAllCategories(data)

  // if (isPending) {
  //   return <span>Loading...</span>
  // }

  // if (error) {
  //   return <span>Error: {error.message}</span>
  // }

  return (
    <section className="p-2 rounded-lg col-span-full bg-primary-dark md:col-start-4 md:row-span-2 ">
      <H3 className="mb-2 text-center">Categories</H3>
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

      <ul className="grid grid-cols-4 capitalize md:grid-cols-2 md:gap-4 md:text-center lg:grid-cols-3">
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
