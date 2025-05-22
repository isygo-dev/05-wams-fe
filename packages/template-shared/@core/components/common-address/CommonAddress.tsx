import React from 'react'
import { AddressTypes } from 'ims-shared/@core/types/ims/addressTypes'
import TextField from '@mui/material/TextField'
import Grid from '@mui/material/Grid'
import FormControl from '@mui/material/FormControl'
import { useTranslation } from 'react-i18next'
import Autocomplete from '@mui/material/Autocomplete'
import { checkPermission } from '../../api/helper/permission'
import { countries } from '../../../public/countries'

interface AddressProps {
  editedAddress: AddressTypes
  styleW?: number
  setEditedAddress: (
    val: (prevData: AddressTypes) => {
      country: string
      zipCode?: number
      city: string
      street: string
      latitude: string
      additionalInfo: string
      id?: number
      state: string
      longitude: string
    }
  ) => void
  disabled?: boolean

  permissionApplication?: string
  permissionPage?: string
  permissionAction?: string
}

const Address = (props: AddressProps) => {
  const { editedAddress, setEditedAddress, disabled, styleW, permissionApplication, permissionPage, permissionAction } =
    props
  const { t } = useTranslation()
  console.log('styleW', styleW)
  const handleInputChange = (field: keyof AddressTypes, value: string) => {
    setEditedAddress((prevData: AddressTypes) => ({
      ...prevData,
      [field]: value
    }))
  }

  return (
    <Grid container item md={12} spacing={2}>
      <Grid item xs={12} sm={6}>
        <Autocomplete
          size='small'
          value={editedAddress?.country || ''}
          fullWidth
          disabled={disabled}
          options={countries}
          onChange={(event, newValue) => {
            checkPermission(permissionApplication, permissionPage, permissionAction) &&
              handleInputChange('country', newValue)
          }}
          renderInput={params => <TextField fullWidth {...params} label={t('Address.Country')} />}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          size='small'
          label={t('Address.State')}
          value={editedAddress?.state || ''}
          fullWidth
          disabled={disabled}
          variant='outlined'
          onChange={e =>
            checkPermission(permissionApplication, permissionPage, permissionAction) &&
            handleInputChange('state', e.target.value)
          }
        />
      </Grid>
      <Grid item xs={12} sm={6} sx={{ mt: 1 }}>
        <TextField
          size='small'
          label={t('Address.City')}
          value={editedAddress?.city || ''}
          fullWidth
          disabled={disabled}
          variant='outlined'
          onChange={e =>
            checkPermission(permissionApplication, permissionPage, permissionAction) &&
            handleInputChange('city', e.target.value)
          }
        />
      </Grid>
      <Grid item xs={12} sm={6} sx={{ mt: 1 }}>
        <TextField
          size='small'
          type='number'
          label={t('Address.ZipCode')}
          value={editedAddress?.zipCode || ''}
          fullWidth
          variant='outlined'
          onChange={e =>
            checkPermission(permissionApplication, permissionPage, permissionAction) &&
            handleInputChange('zipCode', e.target.value)
          }
          inputProps={{
            inputMode: 'numeric' // Hints to mobile devices to show a numeric keyboard
          }}
          disabled={disabled}
          onInput={e => {
            // Remove any non-numeric characters from the input value
            // @ts-ignore
            e.target.value = e.target.value.replace(/[^0-9]/g, '')
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6} sx={{ mt: 1 }}>
        <TextField
          size='small'
          label={t('Address.Street')}
          value={editedAddress?.street || ''}
          fullWidth
          variant='outlined'
          disabled={disabled}
          onChange={e =>
            checkPermission(permissionApplication, permissionPage, permissionAction) &&
            handleInputChange('street', e.target.value)
          }
        />
      </Grid>
      <Grid item xs={12} sm={6} sx={{ mt: 1 }}>
        <FormControl fullWidth>
          <TextField
            size='small'
            label={t('Address.AdditionalInfo')}
            value={editedAddress?.additionalInfo || ''}
            fullWidth
            variant='outlined'
            disabled={disabled}
            onChange={e =>
              checkPermission(permissionApplication, permissionPage, permissionAction) &&
              handleInputChange('additionalInfo', e.target.value)
            }
          />
        </FormControl>
      </Grid>
    </Grid>
  )
}

export default Address
