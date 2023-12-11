import { useContext, useState } from 'react'
import { useParams } from 'react-router-dom'
import Modal from '../../../components/ui/Modal'
import { AuthContext } from '../../../context/AuthContext'
import { useOnSnapShot } from '../../../hooks/useOnSnapShot'
import { getAllCategories, getCategoryCount } from '../utils/utils'
import AddCategory from './AddCategory'

const CategoriesList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const currentUser = useContext(AuthContext)
  const params = useParams()

  const { data, error } = useOnSnapShot({
    docRef: 'categories',
    roomId: params.roomId!,
  })

  const addedCategories = getAllCategories(data)
  const categoryCount = getCategoryCount(data?.custom[currentUser!.uid])

  function handleOpenModal() {
    setIsModalOpen(true)
  }

  function closeModal() {
    setIsModalOpen(false)
  }

  // if (isPending) {
  //   return <span>Loading...</span>
  // }

  if (error) {
    return <span>Error: {error.message}</span>
  }

  return (
    <>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <AddCategory
          closeModal={closeModal}
          categoriesData={data?.custom[currentUser!.uid]}
        />
      </Modal>
      <div className="bg-amber-700/50">
        <header className="flex justify-between">
          <h2>Available Categories</h2>
          <button onClick={handleOpenModal}>
            Add Categories {categoryCount}/2
          </button>
        </header>
        <ul className="grid grid-cols-4 ">
          {data?.default.map((category: string) => (
            <li key={category}>{category}</li>
          ))}
          {addedCategories?.map(category => (
            <li key={category.title}>{category.title}</li>
          ))}
        </ul>
      </div>
    </>
  )
}
export default CategoriesList
