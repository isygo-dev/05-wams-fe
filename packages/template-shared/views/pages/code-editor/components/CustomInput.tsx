import React from 'react'
import TextField from '@mui/material/TextField'

const CustomInput = ({ customInput, setCustomInput }) => {
  return (
    <>
      <TextField
        size='small'
        minRows={4}
        multiline
        value={customInput}
        onChange={e => setCustomInput(e.target.value)}
        placeholder={`Custom input`}
        id='textarea-standard-static'
        sx={{ width: '135%', marginLeft: '3%' }}

        // inputProps={{ maxLength: 500 }}    set maxLength for presentation
      />
    </>
  )
}

export default CustomInput
