import React from 'react'
import Checkbox from '@mui/material/Checkbox'

import FormControlLabel from '@mui/material/FormControlLabel'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import { Controller } from 'react-hook-form'

const Mctaq = ({ control, options, checkedOptions, onCheckboxChange }) => {
  return (
    <>
      {options.map(option => (
        <Box key={option.id}>
          <Controller
            name={`option_${option.id}`}
            control={control}
            defaultValue=''
            render={({ field: { onChange } }) => (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={!!checkedOptions[option.id]}
                    onChange={e => {
                      onCheckboxChange(option.id, e.target.checked)
                      onChange(e.target.checked)
                    }}
                  />
                }
                label={option.option}
              />
            )}
          />
          {checkedOptions[option.id] && (
            <Controller
              name={`answerText_${option.id}`}
              control={control}
              defaultValue=''
              render={({ field }) => <TextField label='Type your answer' multiline fullWidth rows={2} {...field} />}
            />
          )}
        </Box>
      ))}
    </>
  )
}

export default Mctaq
