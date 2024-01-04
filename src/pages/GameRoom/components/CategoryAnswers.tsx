import { Button } from '@/components/ui/button'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { UseFormReturn, useFieldArray } from 'react-hook-form'

import { AnswerInputs } from '../../../lib/types'

type CategoryAnswers = {
  category: string
  form: UseFormReturn<AnswerInputs, undefined>
}

const CategoryAnswers = ({ category, form }: CategoryAnswers) => {
  const { fields, append } = useFieldArray({
    name: category,
    control: form.control,
  })

  function validateAnswer() {
    if (!form.getValues(category).at(-1)?.answer) {
      return form.setError(category, {
        type: 'manual',
        message: 'Fill this field before adding a new one',
      })
    }
    return append({ answer: '' })
  }

  function handleEnter(e: React.KeyboardEvent<HTMLInputElement>) {
    e.nativeEvent.stopImmediatePropagation()
    if (e.code === 'NumpadEnter' || e.code === 'Enter') {
      e.preventDefault()
      validateAnswer()
    }
  }

  return (
    <li className="flex">
      <Label htmlFor={'field'}>{category}</Label>
      {fields.map((field, i) => (
        <FormField
          control={form.control}
          key={field.id}
          name={`${category}.${i}.answer`}
          render={({ field }) => (
            <FormItem>
              <div className="relative">
                <FormLabel className={cn('sr-only')}>{category}</FormLabel>
                <FormControl>
                  <Input {...field} onKeyDown={e => handleEnter(e)} />
                </FormControl>
                {i === fields.length - 1 && (
                  <FormMessage className="right-0">
                    {form.formState.errors[category]?.message}
                  </FormMessage>
                )}
              </div>
            </FormItem>
          )}
        />
      ))}

      <Button
        type="button"
        onClick={e => {
          e.preventDefault()
          validateAnswer()
        }}
      >
        +
      </Button>
    </li>
  )
}
export default CategoryAnswers
