import { Checkbox } from '@/components/ui/checkbox'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { defaultCategories } from '@/config/appConfig'
import { Control } from 'react-hook-form'
import { SettingsInput } from './lib/types'

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
          {defaultCategories.map(category => (
            <FormField
              key={category.id}
              control={control}
              name="defaultCategories"
              render={({ field: { onChange, value } }) => {
                value?.find(item => {
                  return item.label === category.label
                })
                return (
                  <FormItem
                    key={category.id}
                    className="flex items-center gap-1 space-y-0 "
                  >
                    <FormControl>
                      <Checkbox
                        disabled={
                          !value?.find(item => item.label === category.label) &&
                          value.length === 4
                        }
                        checked={
                          !!value?.find(item => item.label === category.label)
                        }
                        onCheckedChange={checked => {
                          return checked
                            ? onChange([...value, category])
                            : onChange(
                                value?.filter(
                                  value => value.label !== category.label
                                )
                              )
                        }}
                      />
                    </FormControl>
                    <FormLabel className="font-normal capitalize lg:text-lg">
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
