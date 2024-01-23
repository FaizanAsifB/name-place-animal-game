import { H3 } from '@/components/typography/Headings'
import { addedCategoriesAtom, categoriesAtom } from '@/context/atoms'
import { useAtomValue } from 'jotai'

const CategoriesList = () => {
  const categoriesData = useAtomValue(categoriesAtom)
  const addedCategories = useAtomValue(addedCategoriesAtom)

  return (
    <section className="p-2 rounded-lg col-span-full bg-primary-dark md:col-start-4 md:row-span-2 ">
      <H3 className="mb-2 text-center">Categories</H3>

      <ul className="grid grid-cols-4 capitalize md:grid-cols-2 md:gap-4 md:text-center lg:grid-cols-3">
        {categoriesData?.default?.map(category => (
          <li key={category.id}>{category.title}</li>
        ))}
        {addedCategories?.map(category => (
          <li key={category.title}>{category.title}</li>
        ))}
      </ul>
    </section>
  )
}
export default CategoriesList
