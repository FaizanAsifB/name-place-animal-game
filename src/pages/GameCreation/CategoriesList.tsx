import { Checkbox, FormControlLabel, FormGroup } from '@mui/material'
import { useState } from 'react'
import { Control, Controller } from 'react-hook-form'
// import { DefaultCategoriesList, SettingsInput } from './lib/types'

//!FIX CONTROL TYPE
type CategoriesListProps = {
  control: Control<any>
}

const CategoriesList = ({ control }: CategoriesListProps) => {
  const [isChecked, setIsChecked] = useState<Record<string, boolean>>({
    name: true,
    place: true,
    animal: true,
    thing: false,
    occupations: false,
    technology: false,
  })

  const defaultCategoriesList: string[] = [
    'name',
    'place',
    'animal',
    'thing',
    'occupations',
    'technology',
  ]

  const checkedCategories = Object.values(isChecked)
  const error = checkedCategories.filter(c => c).length === 4

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setIsChecked({
      ...isChecked,
      [e.target.name]: e.target.checked,
    })
  }
  return (
    <FormGroup row={true}>
      {defaultCategoriesList.map(category => {
        return (
          <Controller
            key={category}
            name={category}
            control={control}
            render={({ field: { onChange } }) => (
              <FormControlLabel
                control={
                  <Checkbox
                    disabled={!isChecked[category] && error}
                    name={category}
                    checked={isChecked[category]}
                    onChange={e => {
                      onChange(e.target.checked)
                      handleChange(e)
                    }}
                  />
                }
                label={category.charAt(0).toUpperCase() + category.slice(1)}
              />
            )}
          />
        )
      })}
    </FormGroup>
  )
}
export default CategoriesList
