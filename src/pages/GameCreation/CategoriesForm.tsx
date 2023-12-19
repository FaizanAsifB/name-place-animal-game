import { Checkbox, FormControlLabel, FormGroup } from '@mui/material'
import { useState } from 'react'
import { Control, Controller } from 'react-hook-form'
import { DefaultCategoriesList } from './lib/types'

const CategoriesList = ({
  control,
}: {
  control: Control<DefaultCategoriesList>
}) => {
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
    console.log(e.target)
    setIsChecked({
      ...isChecked,
      [e.target.name]: e.target.checked,
    })
  }
  return (
    <li>
      <h5>Categories</h5>
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
        {/* <Controller
          name="name"
          control={control}
          render={({ field: { onChange } }) => (
            <FormControlLabel
              control={
                <Checkbox
                  checked={isChecked.name}
                  onChange={e => onChange(e.target.checked)}
                />
              }
              label="Name"
            />
          )}
        />
        <Controller
          name="place"
          control={control}
          render={({ field: { onChange } }) => (
            <FormControlLabel
              control={
                <Checkbox
                  defaultChecked
                  onChange={e => onChange(e.target.checked)}
                />
              }
              label="Place"
            />
          )}
        />
        <Controller
          name="animal"
          control={control}
          render={({ field: { onChange } }) => (
            <FormControlLabel
              control={
                <Checkbox
                  defaultChecked
                  onChange={e => onChange(e.target.checked)}
                />
              }
              label="Animal"
            />
          )}
        />
        <Controller
          name="thing"
          control={control}
          render={({ field: { onChange } }) => (
            <FormControlLabel
              control={
                <Checkbox
                  defaultChecked
                  onChange={e => onChange(e.target.checked)}
                />
              }
              label="Thing"
            />
          )}
        />
        <Controller
          name="occupations"
          control={control}
          render={({ field: { onChange } }) => (
            <FormControlLabel
              control={<Checkbox onChange={e => onChange(e.target.checked)} />}
              label="Occupations"
            />
          )}
        />
        <Controller
          name="technology"
          control={control}
          render={({ field: { onChange } }) => (
            <FormControlLabel
              control={<Checkbox onChange={e => onChange(e.target.checked)} />}
              label="Technology"
            />
          )}
        /> */}
      </FormGroup>
    </li>
  )
}
export default CategoriesList
