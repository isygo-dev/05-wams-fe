// ** Next Import
// ** MUI Components
import Avatar from '@mui/material/Avatar'
import React, {useState} from 'react'
import {useTranslation} from 'react-i18next'
import {CustomerDetailType} from "ims-shared/@core/types/ims/customerTypes";
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import {AccountDto} from "ims-shared/@core/types/ims/accountTypes";
import {Autocomplete} from '@mui/lab'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import imsApiUrls from "ims-shared/configs/ims_apis"
import ListItemText from '@mui/material/ListItemText'
import TextField from '@mui/material/TextField'
import {useMutation, useQuery, useQueryClient} from 'react-query'
import CustomerApis from 'ims-shared/@core/api/ims/customer'

interface UsersModalProps {
  open: boolean
  handleClose: (accountCode: string | null) => void
  accounts: AccountDto[]
  selectedCustomer: CustomerDetailType
}

const LinkToAccountModal = (props: UsersModalProps) => {
  const {t} = useTranslation()
  const {open, accounts, selectedCustomer, handleClose} = props
  const queryClient = useQueryClient()
  const [selectAccount, setSelectAccount] = useState<AccountDto>()
  const {data: customerData, isLoading: isLoadingDataCustomer} = useQuery(
    `customerData`,
    () => selectedCustomer.id && CustomerApis(t).getCustomerDetails(selectedCustomer.id)
  )

  const mutationLinkToUser = useMutation({
    mutationFn: (data: CustomerDetailType) => CustomerApis(t).linkToAccount(data.id, data.accountCode),
    onSuccess: res => {
      console.log('res, ', res)
      const cachedCustomers: CustomerDetailType[] = queryClient.getQueryData('customers') || []
      if (cachedCustomers !== undefined) {
        const index = cachedCustomers.findIndex(obj => obj.id === res.id)
        if (index !== -1) {
          const updatedCustomers = [...cachedCustomers]
          updatedCustomers[index] = res
          queryClient.setQueryData('customers', updatedCustomers)
        }
      }
      const cachedData: CustomerDetailType | undefined = queryClient.getQueryData('customerData')

      if (cachedData != undefined) {
        queryClient.setQueryData('customerData', res)
      }

      handleClose(res?.accountCode)
      setSelectAccount(null)
    }
  })

  const handleSave = () => {
    const newData: CustomerDetailType = customerData
    newData.accountCode = selectAccount.code
    mutationLinkToUser.mutate(newData)
  }

  return !isLoadingDataCustomer ? (
    <Dialog open={open} maxWidth={'md'} fullWidth aria-labelledby='max-width-dialog-title'>
      <DialogTitle id='max-width-dialog-title'>{t('Select_user')}</DialogTitle>
      <DialogContent>
        <Autocomplete
          defaultValue={accounts.find(a => a.code === selectedCustomer.accountCode)}
          onChange={(e, newValue) => setSelectAccount(newValue)}
          size={'small'}
          autoHighlight
          id='autocomplete-account-select'
          options={accounts as AccountDto[]}
          getOptionLabel={option => option.fullName || ''}
          renderOption={(props, option) => (
            <ListItem {...props} key={option.fullName}>
              <ListItemAvatar>
                <Avatar
                  src={option.imagePath !== 'defaultPhoto.jpg' ? `${imsApiUrls.apiUrl_IMS_Account_ImageDownload_EndPoint}/${option.id}` : ''}
                  alt={option.fullName}
                  sx={{height: 28, width: 28}}
                />
              </ListItemAvatar>
              <ListItemText primary={option.fullName + ' ' + option.code}/>
            </ListItem>
          )}
          renderInput={params => (
            <>
              <TextField
                size={'small'}
                {...params}
                label='Choose a user'
                inputProps={{
                  ...params.inputProps,
                  autoComplete: 'new-password'
                }}
              />
            </>
          )}
        />
      </DialogContent>
      <DialogActions className='dialog-actions-dense'>
        <Button onClick={() => handleClose(null)}>{t('Cancel')}</Button>
        <Button onClick={handleSave}>{t('Save')}</Button>
      </DialogActions>
    </Dialog>
  ) : null
}

export default LinkToAccountModal
