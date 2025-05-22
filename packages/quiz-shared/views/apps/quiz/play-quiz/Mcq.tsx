import React from 'react'
import FormControlLabel from '@mui/material/FormControlLabel'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import { Controller } from 'react-hook-form'
import FormControl from '@mui/material/FormControl'

const Mcq = ({ options, control }) => {
  return (
    <FormControl>
      <Controller
        name='option'
        control={control}
        render={({ field: { onChange } }) => (
          <RadioGroup>
            {options.map(option => (
              <FormControlLabel
                key={option.id}
                value={option.id}
                control={<Radio />}
                label={option.option}
                onChange={onChange}
              />
            ))}
          </RadioGroup>
        )}
      />
    </FormControl>
  )
}

export default Mcq
