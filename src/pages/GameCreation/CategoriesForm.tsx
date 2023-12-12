import { Checkbox, FormControlLabel, FormGroup } from '@mui/material'
import { Control, Controller } from 'react-hook-form'
import { SettingsInput } from './lib/types'

const CategoriesList = ({ control }: { control: Control<SettingsInput> }) => {
  return (
    <li>
      <h5>Categories</h5>
      <FormGroup row={true}>
        <Controller
          name="name"
          control={control}
          render={({ field: { onChange } }) => (
            <FormControlLabel
              control={
                <Checkbox
                  defaultChecked
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
        />
      </FormGroup>
    </li>
  )
}
export default CategoriesList
