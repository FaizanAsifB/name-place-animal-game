import { Button } from '@/components/ui/button'
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
import { useParams } from 'react-router-dom'
import { AuthContext } from '../../../context/AuthContext'
import {
  AddedCategories,
  CustomCategoriesType,
  DefaultCategories,
  customCategoriesSchema,
} from '../../../lib/types'
import { submitCategoryInput } from '../../../utils/http'

type AddCategoriesProps = {
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

const AddCategories = ({
  userCategories,
  allCategories,
  setIsModalOpen,
  defaultCategories,
}: AddCategoriesProps) => {
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
    if (defaultValues.category1 && !defaultValues.category2)
      form.setFocus('category2')
    form.setFocus('category1')
  }, [defaultValues.category1, defaultValues.category2, form])

  function checkCategoriesExists(category: string, categoryField: string) {
    const exists =
      allCategories?.filter(
        c =>
          c.addedBy !== currentUser?.uid && c.title.toLowerCase() === category
      ).length !== 0
    if (
      exists ||
      defaultCategories.findIndex(item => item.title === category) !== -1
    )
      form.setError(categoryField, {
        type: 'manual',
        message: 'This category already exists',
      })
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

    if (form.getFieldState('category1').isDirty) {
      await submitCategoryInput(params.roomId!, currentUser!.uid, {
        name: 'category1',
        title: category1,
      })
    }

    if (form.getFieldState('category2').isDirty) {
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

        <DialogFooter className="pt-4">
          <DialogClose asChild>
            <Button
              variant={'secondary'}
              size={'md'}
              disabled={form.formState.isSubmitting}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            variant={'secondary'}
            size={'md'}
            disabled={form.formState.isSubmitting}
            type="submit"
          >
            {form.formState.isSubmitting && (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            )}
            Add Categories
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}
export default AddCategories
