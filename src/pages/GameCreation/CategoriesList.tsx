import { Checkbox } from '@/components/ui/checkbox'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Control } from 'react-hook-form'
import { SettingsInput } from './lib/types'
// import { DefaultCategoriesList, SettingsInput } from './lib/types'

type CategoriesListProps = {
  control: Control<SettingsInput>
}
const defaultCategories: Record<string, string>[] = [
  { id: 'name', label: 'Name' },
  { id: 'place', label: 'Place' },
  { id: 'animal', label: 'Animal' },
  { id: 'thing', label: 'Thing' },
  { id: 'occupations', label: 'Occupations' },
  { id: 'technology', label: 'Technology' },
]

const CategoriesList = ({ control }: CategoriesListProps) => {
  return (
    <FormField
      control={control}
      name="defaultCategories"
      render={() => (
        <FormItem className="relative flex flex-wrap items-center justify-center gap-4 space-y-0">
          {defaultCategories.map(category => (
            <FormField
              key={category.id}
              control={control}
              name="defaultCategories"
              render={({ field: { onChange, value } }) => {
                return (
                  <FormItem
                    key={category.id}
                    className="flex items-center gap-1 space-y-0 "
                  >
                    <FormControl>
                      <Checkbox
                        disabled={
                          !value?.includes(category.id) && value.length === 4
                        }
                        checked={value?.includes(category.id)}
                        onCheckedChange={checked => {
                          return checked
                            ? onChange([...value, category.id])
                            : onChange(
                                value?.filter(value => value !== category.id)
                              )
                        }}
                      />
                    </FormControl>
                    <FormLabel className="font-normal lg:text-lg">
                      {category.label}
                    </FormLabel>
                  </FormItem>
                )
              }}
            />
          ))}
          <FormMessage className="justify-center w-full text-center" />
        </FormItem>
      )}
    />
  )
}
export default CategoriesList
