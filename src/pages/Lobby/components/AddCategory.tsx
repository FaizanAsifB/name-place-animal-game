import { zodResolver } from '@hookform/resolvers/zod'
import { DocumentData, Timestamp } from 'firebase/firestore'
import { useContext, useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { CgSpinner } from 'react-icons/cg'
import { GrGamepad } from 'react-icons/gr'
import { useParams } from 'react-router-dom'
import Button from '../../../components/ui/Button'
import FormInput from '../../../components/ui/FormInput'
import { AuthContext } from '../../../context/AuthContext'
import {
  CustomCategoriesType,
  customCategoriesSchema,
} from '../../../lib/types'
import { submitCategoryInput } from '../../GameCreation/utils/http'

type AddCategoryProps = {
  closeModal: () => void
  categoriesData: DocumentData | undefined
  allCategories:
    | {
        addedBy: string
        title: string
        date: Timestamp
      }[]
    | undefined
}

const AddCategory = ({
  closeModal,
  categoriesData,
  allCategories,
}: AddCategoryProps) => {
  const defaultValues = {
    category1: categoriesData?.category1.title,
    category2: categoriesData?.category2.title,
  }

  const {
    handleSubmit,
    register,
    setValue,
    setFocus,
    clearErrors,
    setError,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<CustomCategoriesType>({
    defaultValues,
    resolver: zodResolver(customCategoriesSchema),
  })

  const currentUser = useContext(AuthContext)
  const params = useParams()

  useEffect(() => {
    setValue('category1', defaultValues.category1)
    setValue('category2', defaultValues.category2)

    if (defaultValues.category1 && !defaultValues.category2)
      setFocus('category2')
    setFocus('category1')
  }, [defaultValues.category1, defaultValues.category2, setFocus, setValue])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.name === 'category1') setValue('category1', e.target.value)
    if (e.target.name === 'category2') setValue('category2', e.target.value)
  }

  function handleCancel() {
    setValue('category1', defaultValues.category1)
    setValue('category2', defaultValues.category2)
    clearErrors()
    closeModal()
  }

  function filterCategories(category: string, categoryNr: string) {
    const exists =
      allCategories?.filter(
        c => c.addedBy !== currentUser?.uid && c.title === category
      ).length !== 0
    exists &&
      setError(`category${categoryNr}`, {
        type: 'manual',
        message: 'This category already exists',
      })

    return exists
  }

  const onSubmit: SubmitHandler<CustomCategoriesType> = async data => {
    const { category1, category2 } = data
    // console.log(filterCategories(category1))

    filterCategories(category1, '1')
    filterCategories(category2, '2')

    if (filterCategories(category1, '1') || filterCategories(category2, '2'))
      return

    if (category1 !== defaultValues.category1) {
      await submitCategoryInput(params.roomId!, currentUser!.uid, {
        name: 'category1',
        title: category1,
      })
    }

    if (category2 !== defaultValues.category1) {
      await submitCategoryInput(params.roomId!, currentUser!.uid, {
        name: 'category2',
        title: category2,
      })
    }

    isSubmitSuccessful && closeModal()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <FormInput
        label="Category 1"
        register={{
          ...register('category1', {
            onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
              handleChange(e),
            onBlur: () => clearErrors('category1'),
          }),
        }}
        name="category1"
        //!Errors keep on appearing if they have occurred once
        error={errors.category1?.message}
        type="text"
        placeholder="e.g. space"
      />

      <FormInput
        label="Category 2"
        register={{
          ...register('category2', {
            onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
              handleChange(e),
            onBlur: () => clearErrors('category2'),
          }),
        }}
        name="category2"
        //!Errors keep on appearing if they have occurred once
        error={errors.category2?.message}
        type="text"
        placeholder="e.g. video games"
      />
      <div>
        <Button disabled={isSubmitting} type="submit" icon={<GrGamepad />}>
          {isSubmitting ? <CgSpinner /> : 'Add Categories'}
        </Button>
        <Button onClick={handleCancel}>Cancel</Button>
      </div>
    </form>
  )
}
export default AddCategory
