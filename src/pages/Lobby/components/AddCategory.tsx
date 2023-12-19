import { zodResolver } from '@hookform/resolvers/zod'
import { DocumentData } from 'firebase/firestore'
import { useContext, useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { GrGamepad } from 'react-icons/gr'
import { useParams } from 'react-router-dom'
import Button from '../../../components/ui/Button'
import FormInput from '../../../components/ui/FormInput'
import { AuthContext } from '../../../context/AuthContext'
import {
  CustomCategoriesSchema,
  customCategoriesSchema,
} from '../../../lib/types'
import { submitCategoryInput } from '../../GameCreation/utils/http'

type AddCategoryProps = {
  closeModal: () => void
  categoriesData: DocumentData | undefined
}

const AddCategory = ({ closeModal, categoriesData }: AddCategoryProps) => {
  const {
    handleSubmit,
    register,
    setValue,
    setFocus,
    getFieldState,
    clearErrors,
    setError,
    getValues,
    formState: { errors /* isSubmitting, isDirty */ },
  } = useForm({
    defaultValues: {
      category1: '',
      category2: '',
    },
    resolver: zodResolver(customCategoriesSchema),
  })

  const currentUser = useContext(AuthContext)
  const params = useParams()

  useEffect(() => {
    const inputValues = getValues(['category1', 'category2'])

    if (categoriesData && inputValues[0] === '' && inputValues[1] === '') {
      setValue('category1', categoriesData.category1.title)
      setValue('category2', categoriesData.category2.title)
    }
    getFieldState('category1').isTouched &&
    !getFieldState('category2').isTouched
      ? setFocus('category2')
      : setFocus('category1')
  }, [categoriesData, setValue, setFocus, getFieldState, getValues])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.name === 'category1') setValue('category1', e.target.value)
    if (e.target.name === 'category2') setValue('category2', e.target.value)
  }

  function handleCancel() {
    setValue('category1', categoriesData?.category1.title)
    setValue('category2', categoriesData?.category2.title)
    clearErrors()
    closeModal()
  }

  const onSubmit: SubmitHandler<CustomCategoriesSchema> = async data => {
    const { category1, category2 } = data

    if (
      category1 &&
      category1 === categoriesData?.category1.title &&
      !getFieldState('category2').isTouched
    ) {
      setError('category1', {
        type: 'manual',
        message: 'Enter a new category!',
      })
    } else
      await submitCategoryInput(params.roomId!, currentUser!.uid, {
        name: 'category1',
        title: category1,
      })

    // if (category2 && category2 === categoriesData?.category2.title) {
    //   setError('category2', {
    //     type: 'manual',
    //     message: 'Enter a new category!',
    //   })
    // } else
    await submitCategoryInput(params.roomId!, currentUser!.uid, {
      name: 'category2',
      title: category2,
    })

    closeModal()

    // if (!category1 && !category2)
    //   setError('root', {
    //     type: 'manual',
    //     message: 'At least one field must have a value',
    //   })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <FormInput
        label="Category 1"
        register={{
          ...register('category1', {
            onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
              handleChange(e),
            // onBlur: () => clearErrors('category1'),
          }),
        }}
        name="category1"
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
            // onBlur: () => clearErrors('category2'),
          }),
        }}
        name="category2"
        error={errors.category2?.message}
        type="text"
        placeholder="e.g. video games"
      />
      <div>
        <Button type="submit" icon={<GrGamepad />}>
          Add Categories
        </Button>
        <Button onClick={handleCancel}>Cancel</Button>
      </div>
    </form>
  )
}
export default AddCategory
