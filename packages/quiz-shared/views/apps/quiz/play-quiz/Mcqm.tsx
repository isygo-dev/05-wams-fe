import FormGroup from '@mui/material/FormGroup'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import { Controller } from 'react-hook-form'

const Mcqm = ({ control, options, checkedOptions, onCheckboxChange }) => {
  return (
    <FormGroup aria-label='position'>
      {options.map((option, index) => (
        <Controller
          key={index}
          name={`option_${index}`}
          control={control}
          defaultValue={false}
          render={({ field: { value, onChange } }) => (
            <FormControlLabel
              value={option.id}
              control={
                <Checkbox
                  {...value}
                  checked={!!checkedOptions[option.id]}
                  onChange={e => {
                    onCheckboxChange(option.id, e.target.checked)
                    onChange(e.target.checked)
                  }}
                />
              }
              label={option.option}
              labelPlacement='end'
            />
          )}
        />
      ))}
    </FormGroup>
  )
}

export default Mcqm
