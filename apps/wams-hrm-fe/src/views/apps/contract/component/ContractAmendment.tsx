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
import dynamic from "next/dynamic";
import 'react-quill/dist/quill.snow.css'
import DatePickerWrapper from "template-shared/@core/styles/libs/react-datepicker";
import DatePicker from "react-datepicker";
import TextField from "@mui/material/TextField";
import AnnexApis from "ims-shared/@core/api/ims/annex";
import {IEnumAnnex} from "ims-shared/@core/types/ims/annexTypes";

const QuillNoSSRWrapper = dynamic(() => import('react-quill'), {ssr: false})

export default function ContrcatAmendmentInformation({checkPermissionUpdate}) {
  const {t} = useTranslation()
  const contractData = useContext(ContractContext)
  const contract = contractData.contractData || {}

  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{header: 1}, {header: 2}],
      [{list: 'ordered'}, {list: 'bullet'}],
      [{script: 'sub'}, {script: 'super'}],
      [{indent: '-1'}, {indent: '+1'}],
      [{direction: 'rtl'}],
      [{size: ['small', false, 'large', 'huge']}],
      [{header: [1, 2, 3, 4, 5, 6, false]}],
      [{color: []}, {background: []}],
      [{font: []}],
      [{align: []}],
      ['link', 'image'],
      ['clean']
    ],
    clipboard: {
      matchVisual: false
    }
  }

  const {control: formControl} = useForm({
    defaultValues: contract.contractAmendments ? {contractAmendments: contract.contractAmendments} : {}
  })

  const {data: ContractAmendment, isLoading: isLoadingAmendment} = useQuery('ContractAmendment', () =>
    AnnexApis(t).getAnnexByTableCode(IEnumAnnex.CONTRACT_AMENDMENT)
  )
  console.log('ContractAmendment', ContractAmendment)

  const {control: formContextControl} = useFormContext()

  const {fields, append, remove} = useFieldArray({
    control: formControl,
    name: 'contractAmendments'
  })

  return (
    <Accordion style={{marginTop: 16}}>
      <AccordionSummary
        expandIcon={<Icon icon='tabler:chevron-down'/>}
        aria-controls='panel1a-content'
        id='panel1a-header'
      >
        <Typography>{t('Contract.contractAmendment')}</Typography>
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
                  <InputLabel>{t('Contract.contractAmendment_Type')}</InputLabel>
                  <Controller
                    name={`contractAmendments[${index}].type`}
                    defaultValue={contract?.contractAmendments[index]?.type || ''}
                    render={({field: {value, onChange}}) => (
                      <Select
                        disabled={contract.isLocked || !checkPermissionUpdate}
                        value={value}
                        onChange={checkPermissionUpdate && onChange}
                        variant='outlined'
                        label={t('Contract.contractAmendment_type')}
                      >
                        {!isLoadingAmendment
                          ? ContractAmendment?.map(res => (
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
              <Grid item xs={12} sm={6}>
                <DatePickerWrapper className='small-input-data'>
                  <Controller
                    name={`contractAmendments[${index}].date`}
                    control={formContextControl}
                    defaultValue={contract?.contractAmendments[index]?.date || ''}
                    render={({field: {value, onChange}}) => (
                      <DatePicker
                        disabled={!checkPermissionUpdate}
                        selected={value ? new Date(value) : null}
                        dateFormat='dd/MM/yyyy'
                        onChange={date => checkPermissionUpdate && onChange(date)}
                        customInput={<TextField size='small' fullWidth label='Date' variant='outlined'/>}
                      />
                    )}
                  />
                </DatePickerWrapper>
              </Grid>
            </Grid>

            <Grid item md={12}>
              <Typography sx={{mb: 2}}>{t('Description')}</Typography>

              <Controller
                name={`contractAmendments.[${index}].description`}
                control={formContextControl}
                render={({field: {value, onChange}}) => (
                  <QuillNoSSRWrapper
                    theme='snow'
                    value={value}
                    onChange={checkPermissionUpdate && onChange}
                    modules={modules}
                    style={{marginBottom: '16px'}}
                  />
                )}
                defaultValue={contract?.contractAmendments[index]?.description || ''}
              />
            </Grid>
          </Box>
        ))}


        {checkPermissionUpdate &&
          <Button variant='contained' size={'small'} color='primary'
                  style={{marginTop: '20px'}}
                  className={'button-padding-style'} onClick={() => append({})}>
            <Icon icon='tabler:plus'
                  style={{marginRight: '6px'}}/> {t('Contract.Add_contractAmendment')}
          </Button>
        }

      </AccordionDetails>
    </Accordion>
  )
}
