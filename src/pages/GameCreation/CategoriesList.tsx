import { Checkbox } from '@/components/ui/checkbox'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { DEFAULT_CATEGORIES } from '@/config/gameConfig'
import { SettingsInput } from '@/lib/types'
import { Control } from 'react-hook-form'

type CategoriesListProps = {
  control: Control<SettingsInput>
}

const CategoriesList = ({ control }: CategoriesListProps) => {
  return (
    <FormField
      control={control}
      name="defaultCategories"
      render={() => (
        <FormItem className="relative flex flex-wrap items-center justify-center gap-4 space-y-0">
          {DEFAULT_CATEGORIES.map(category => (
            <FormField
              key={category.id}
              control={control}
              name="defaultCategories"
              render={({ field: { onChange, value } }) => {
                value?.find(item => {
                  return item.title === category.title
                })
                return (
                  <FormItem
                    key={category.id}
                    className="flex items-center gap-1 space-y-0 "
                  >
                    <FormControl>
                      <Checkbox
                        disabled={
                          !value?.find(item => item.title === category.title) &&
                          value.length === 4
                        }
                        checked={
                          !!value?.find(item => item.title === category.title)
                        }
                        onCheckedChange={checked => {
                          return checked
                            ? onChange([...value, category])
                            : onChange(
                                value?.filter(
                                  value => value.title !== category.title
                                )
                              )
                        }}
                      />
                    </FormControl>
                    <FormLabel className="font-normal capitalize lg:text-lg">
                      {category.title}
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
