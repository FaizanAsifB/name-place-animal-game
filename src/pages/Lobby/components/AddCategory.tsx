import { DialogClose, DialogFooter } from '@/components/ui/dialog.tsx'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input.tsx'
import { zodResolver } from '@hookform/resolvers/zod'
import { Timestamp } from 'firebase/firestore'
import { Loader2 } from 'lucide-react'
import { Dispatch, SetStateAction, useContext, useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { GrGamepad } from 'react-icons/gr'
import { useParams } from 'react-router-dom'
import { Button } from '../../../components/ui/button.tsx'
import { AuthContext } from '../../../context/AuthContext'
import {
  AddedCategories,
  CustomCategoriesType,
  DefaultCategories,
  customCategoriesSchema,
} from '../../../lib/types'
import { submitCategoryInput } from '../../GameCreation/utils/http'

type AddCategoryProps = {
  userCategories: AddedCategories
  defaultCategories: DefaultCategories
  allCategories:
    | {
        addedBy: string
        title: string
        date: Timestamp
      }[]
    | undefined
  setIsModalOpen: Dispatch<SetStateAction<boolean>>
}

const AddCategory = ({
  userCategories,
  allCategories,
  setIsModalOpen,
  defaultCategories,
}: AddCategoryProps) => {
  const defaultValues = {
    category1: userCategories?.category1.title,
    category2: userCategories?.category2.title,
  }

  const form = useForm<CustomCategoriesType>({
    defaultValues,
    resolver: zodResolver(customCategoriesSchema),
  })

  const currentUser = useContext(AuthContext)
  const params = useParams()

  useEffect(() => {
    // form.setValue('category1', defaultValues.category1)
    // form.setValue('category2', defaultValues.category2)

    if (defaultValues.category1 && !defaultValues.category2)
      form.setFocus('category2')
    form.setFocus('category1')
  }, [defaultValues.category1, defaultValues.category2, form])

  // function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
  //   if (e.target.name === 'category1')
  //     form.setValue('category1', e.target.value)
  //   if (e.target.name === 'category2')
  //     form.setValue('category2', e.target.value)
  // }

  // function handleCancel() {
  //   setValue('category1', defaultValues.category1)
  //   setValue('category2', defaultValues.category2)
  //   clearErrors()
  // closeModal()
  // }

  function checkCategoriesExists(category: string, categoryField: string) {
    const exists =
      allCategories?.filter(
        c =>
          c.addedBy !== currentUser?.uid && c.title.toLowerCase() === category
      ).length !== 0
    if (exists || defaultCategories.includes(category))
      form.setError(categoryField, {
        type: 'manual',
        message: 'This category already exists',
      })

    // return exists
  }

  const onSubmit: SubmitHandler<CustomCategoriesType> = async data => {
    const { category1, category2 } = data

    checkCategoriesExists(category1.toLowerCase(), 'category1')
    checkCategoriesExists(category2.toLowerCase(), 'category2')

    if (
      form.getFieldState('category1').error ||
      form.getFieldState('category2').error
    )
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

    setIsModalOpen(false)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="category1"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category 1</FormLabel>
              <div className="relative">
                <FormControl>
                  <Input placeholder="e.g. space" {...field} />
                </FormControl>
                <FormMessage className="right-0" />
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category2"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category 2</FormLabel>
              <div className="relative">
                <FormControl>
                  <Input placeholder="e.g. video games" {...field} />
                </FormControl>
                <FormMessage className="right-0" />
              </div>
            </FormItem>
          )}
        />

        <DialogFooter>
          <Button disabled={form.formState.isSubmitting} type="submit">
            {form.formState.isSubmitting ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <GrGamepad />
            )}
            Add Categories
          </Button>

          <DialogClose asChild>
            <Button disabled={form.formState.isSubmitting}>Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </form>
    </Form>
  )
}
export default AddCategory
