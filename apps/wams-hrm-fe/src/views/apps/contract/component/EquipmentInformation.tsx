import React, {useContext} from 'react'
import {Controller, useFieldArray, useForm, useFormContext} from 'react-hook-form'
import {useTranslation} from 'react-i18next'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select
} from '@mui/material'
import Icon from 'template-shared/@core/components/icon'
import {ContractContext} from '../../../../pages/apps/contract/view/[id]'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import {useQuery} from 'react-query'
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import AnnexApis from "ims-shared/@core/api/ims/annex";
import {IEnumAnnex} from "ims-shared/@core/types/ims/annexTypes";

export default function EquipmentInformation({checkPermissionUpdate}) {
  const {t} = useTranslation()
  const contractData = useContext(ContractContext)
  const contract = contractData.contractData || {}

  const {control: formControl} = useForm({
    defaultValues: contract.equipments ? {equipments: contract.equipments} : {}
  })

  const {data: ContractEquipment, isLoading: isLoadingEquipment} = useQuery('ContractEquipment', () =>
    AnnexApis(t).getAnnexByTableCode(IEnumAnnex.CONTRACT_EQUPMENT)
  )
  console.log('ContractEquipment', ContractEquipment)

  const {control: formContextControl} = useFormContext()

  const {fields, append, remove} = useFieldArray({
    control: formControl,
    name: 'equipments'
  })

  return (
    <Accordion style={{marginTop: 16}}>
      <AccordionSummary
        expandIcon={<Icon icon='tabler:chevron-down'/>}
        aria-controls='panel1a-content'
        id='panel1a-header'
      >
        <Typography>{t('Contract.Equipment')}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {fields.map((salary, index) => (
          <Box
            key={index}
            style={{
              border: '1px solid #ccc',
              padding: '16px',
              marginBottom: '16px',
              borderRadius: '8px',
              position: 'relative'
            }}
          >
            <IconButton
              style={{position: 'absolute', top: '0px', right: '-7px'}}
              size='small'
              onClick={() => remove(index)}
            >
              <Icon icon='tabler:x' fontSize='1.25rem'/>
            </IconButton>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormControl size='small' style={{width: '100%', marginRight: '10px'}}>
                  <InputLabel>{t('Contract.Equipment_Type')}</InputLabel>
                  <Controller
                    name={`equipments[${index}].type`}
                    defaultValue={contract?.equipments[index]?.type || ''}
                    render={({field: {value, onChange}}) => (
                      <Select
                        disabled={contract.isLocked || !checkPermissionUpdate}
                        value={value}
                        onChange={checkPermissionUpdate && onChange}
                        variant='outlined'
                        label={t('Contract.Equipment_Type')}
                      >
                        {!isLoadingEquipment
                          ? ContractEquipment?.map(res => (
                            <MenuItem key={res.id} value={res.value}>
                              {res.value}
                            </MenuItem>
                          ))
                          : null}
                      </Select>
                    )}
                    control={formContextControl}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <Controller
                  name={`equipments.[${index}].description`}
                  control={formContextControl}
                  render={({field: {value, onChange}}) => (
                    <TextField
                      fullWidth
                      disabled={contract.isLocked || !checkPermissionUpdate}
                      value={value}
                      size='small'
                      label={t('Contract.Description')}
                      onChange={checkPermissionUpdate && onChange}
                      rows={1}
                      multiline
                    />
                  )}
                  defaultValue={contract?.equipments[index]?.description || ''}
                />
              </Grid>
            </Grid>
          </Box>
        ))}


        {checkPermissionUpdate &&
          <Button variant='contained' size={'small'} color='primary'
                  style={{marginTop: '20px'}}
                  className={'button-padding-style'} onClick={() => append({})}>
            <Icon icon='tabler:plus'
                  style={{marginRight: '6px'}}/> {t('Contract.Add_Equipment')}
          </Button>
        }

      </AccordionDetails>
    </Accordion>
  )
}
