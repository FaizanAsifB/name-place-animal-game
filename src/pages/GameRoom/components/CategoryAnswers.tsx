import {
  Control,
  FieldErrors,
  UseFormClearErrors,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetError,
  UseFormWatch,
  useFieldArray,
} from 'react-hook-form'
import ErrorText from '../../../components/forms/ErrorText'
import { AnswerInputs } from './FieldArrayTest'

type CategoryAnswers = {
  category: string
  register: UseFormRegister<AnswerInputs>
  control: Control<AnswerInputs>
  errors: FieldErrors<AnswerInputs>
  setError: UseFormSetError<AnswerInputs>
  watch: UseFormWatch<AnswerInputs>
  getValues: UseFormGetValues<AnswerInputs>
  clearErrors: UseFormClearErrors<AnswerInputs>
}

const CategoryAnswers = ({
  category,
  register,
  control,
  errors,
  setError,
  clearErrors,
  getValues,
}: CategoryAnswers) => {
  const { fields, append } = useFieldArray({
    name: category,
    control,
  })

  function validateAnswer() {
    // if (!fields[fields.length - 1].answer)
    if (!getValues(category).at(-1)?.answer) {
      setError(category, {
        type: 'manual',
        message: 'Fill an answer before adding a new field',
      })
    } else append({ answer: '' })
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
      <label htmlFor="field" className="capitalize">
        {category}
      </label>
      {fields.map((field, i) => {
        return (
          <div key={field.id} className="relative">
            <input
              type="text"
              {...register(`${category}.${i}.answer` as const, {
                onBlur: () => clearErrors(category),
                onChange: () => clearErrors(category),
              })}
              onKeyDown={e => handleEnter(e)}
            />
            {i === fields.length - 1 && (
              <ErrorText align={'right'}>{errors[category]?.message}</ErrorText>
            )}
          </div>
        )
      })}
      <button
        type="button"
        onClick={e => {
          e.preventDefault()
          validateAnswer()
        }}
      >
        +
      </button>
    </li>
  )
}
export default CategoryAnswers
