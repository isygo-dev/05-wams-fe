import React from 'react'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import Box from '@mui/material/Box'
import { Controller } from 'react-hook-form'

const Taq = ({ control }) => {
  return (
    <Box sx={{ display: 'grid' }}>
      <FormControl>
        <Controller
          name='answerText'
          control={control}
          rules={{ required: true }}
          render={({ field: { value, onChange } }) => (
            <TextField
              label='Type your answer here'
              value={value}
              defaultValue=''
              multiline
              fullWidth
              rows={12}
              onChange={onChange}
            />
          )}
        />
      </FormControl>
    </Box>
  )
}

export default Taq
