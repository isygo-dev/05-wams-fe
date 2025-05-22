import React from 'react'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import MailIcon from '@mui/icons-material/Mail'

const EmailInputMask = ({ value, onChange, error }) => {
  const handleChange = event => {
    onChange(event.target.value)
  }

  const displayMask = value?.indexOf('@') !== -1 ? value : `@${value}`

  return (
    <TextField
      value={displayMask}
      onChange={handleChange}
      size='small'
      label='Email'
      fullWidth
      variant='outlined'
      error={error}
      InputProps={{
        startAdornment: (
          <InputAdornment position='start'>
            <MailIcon color='action' /> {/* Render the Mail icon */}
          </InputAdornment>
        )
      }}
    />
  )
}

export default EmailInputMask
