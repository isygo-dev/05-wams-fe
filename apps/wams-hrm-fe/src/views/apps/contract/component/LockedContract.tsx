import React, { useState } from 'react'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormHelperText from '@mui/material/FormHelperText'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import { useTranslation } from 'react-i18next'
import { Controller, useForm } from 'react-hook-form'
import { useMutation } from 'react-query'
import { RequestContractStatus } from 'hrm-shared/@core/types/hrm/contractType'
import ContractApis from 'hrm-shared/@core/api/hrm/contract'

interface LockContractButtonProps {
  isLocked: boolean
  contractId: number
  refetch: () => void
}

const LockContractButton: React.FC<LockContractButtonProps> = ({ isLocked, contractId, refetch }) => {
  const { t } = useTranslation()
  const {
    handleSubmit: handleSubmitCheck,
    control: controlCheck,
    formState: { errors: errorsCheck }
  } = useForm({ defaultValues: { isLocked } })

  const [newStatus, setNewStatus] = useState<boolean>(isLocked)

  const mutation = useMutation(ContractApis(t).updateStatusContract)
  const onSubmitCheck = async () => {
    const data: RequestContractStatus = {
      id: contractId ?? 0,
      isLocked: isLocked ? false : true
    }
    try {
      await mutation.mutateAsync(data)
      refetch()
      setNewStatus(!newStatus)
    } catch (error) {}
  }

  return (
    <Grid item xs={12}>
      <Card>
        <CardContent>
          <form onSubmit={handleSubmitCheck(onSubmitCheck)}>
            <Box sx={{ mb: 4 }}>
              <FormControl>
                <Controller
                  name='isLocked'
                  control={controlCheck}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <FormControlLabel
                      label={`${t('Contract.I_confirm_my_contract')} ${!isLocked ? t('Lock') : t('unlock')}`}
                      sx={errorsCheck.isLocked ? { '& .MuiTypography-root': { color: 'error.main' } } : null}
                      control={
                        <Checkbox
                          {...field}
                          size='small'
                          name='validation-basic-checkbox'
                          sx={errorsCheck.isLocked ? { color: 'error.main' } : null}
                        />
                      }
                    />
                  )}
                />
                {errorsCheck.isLocked && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-checkbox'>
                    {t('Contract.Please_confirm_you_want_to')} {isLocked ? t('activate') : t('deactivate')}{' '}
                    {t('Contract.contract')}=
                  </FormHelperText>
                )}
              </FormControl>
            </Box>
            <Button variant='contained' color='error' type='submit' disabled={errorsCheck.isLocked !== undefined}>
              {isLocked ? t('unlock') : t('Lock')} {t('Contract.contract')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Grid>
  )
}

export default LockContractButton
