import {WorkflowsType} from 'rpm-shared/@core/types/rpm/workflowTypes'
import Box, {BoxProps} from '@mui/material/Box'
import Grid, {GridProps} from '@mui/material/Grid'
import {Control, Controller, FieldErrors, UseFormGetValues, UseFormSetValue, UseFormWatch} from 'react-hook-form'
import React, {useState} from 'react'
import Collapse from '@mui/material/Collapse'
import InputLabel from '@mui/material/InputLabel'
import Checkbox from '@mui/material/Checkbox'
import ListItemText from '@mui/material/ListItemText'
import FormControlLabel from '@mui/material/FormControlLabel'
import {styled} from '@mui/material/styles'
import Repeater from 'template-shared/@core/components/repeater'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import {useTranslation} from 'react-i18next'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import FormHelperText from '@mui/material/FormHelperText'
import {Icon} from '@iconify/react'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import DeleteCommonDialog from 'template-shared/@core/components/DeleteCommonDialog'

interface Props {
  count: number
  control: Control<WorkflowsType>
  toggle: () => void
  toggleDelete: (index: number) => void
  errors: FieldErrors<WorkflowsType>
  getValues: UseFormGetValues<WorkflowsType>
  defaultValues: WorkflowsType
  watch: UseFormWatch<WorkflowsType>
  workFlowEmails: any
  emails: string[]
  setValue: UseFormSetValue<WorkflowsType>
}

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      width: 250,
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP
    }
  }
}

const TransitionWorkflow = (props: Props) => {
  const {
    count,
    control,
    toggle,
    toggleDelete,
    errors,
    getValues,
    defaultValues,
    watch,
    workFlowEmails,
    emails,
    setValue
  } = props
  console.log('defaultValues', defaultValues)
  const {t} = useTranslation()
  const filteredEmails = emails.filter(email => !workFlowEmails.includes(email))
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false)
  const [index, setIndex] = useState<number>(null)

  const RepeatingContent = styled(Grid)<GridProps>(({theme}) => ({
    paddingRight: 0,
    display: 'flex',
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    border: `1px solid ${theme.palette.divider}`,
    '& .col-title': {
      top: '-2.25rem',
      position: 'absolute'
    },
    [theme.breakpoints.down('md')]: {
      '& .col-title': {
        top: '0',
        position: 'relative'
      }
    }
  }))
  const handleOpenDeleteDialog = (index: number) => {
    setDeleteDialogOpen(true), setIndex(index)
  }

  const InvoiceAction = styled(Box)<BoxProps>(({theme}) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    padding: theme.spacing(2, 1),
    borderLeft: `1px solid ${theme.palette.divider}`
  }))

  return (
    <>
      <Repeater count={count}>
        {(i: number) => {
          const Tag = i === 0 ? Box : Collapse

          return (
            <Tag key={i} className='repeater-transition' {...(i !== 0 ? {in: true} : {})}>
              <Grid container>
                <RepeatingContent item xs={12}>
                  <Grid container sx={{py: 4, width: '100%', pr: {lg: 0, xs: 4}}}>
                    <Grid item lg={6} md={5} xs={12} sx={{px: 4, my: {lg: 0, xs: 4}}}>
                      <FormControl fullWidth>
                        <InputLabel id='validation-fromCode-select' htmlFor='validation-fromCode-select'>
                          {t('From')}
                        </InputLabel>
                        <Controller
                          name={`workflowTransitions.${i}.fromCode`}
                          control={control}
                          rules={{required: true}}
                          render={({field: {value, onChange}}) => (
                            <Select
                              size='small'
                              value={value}
                              label={t('From')}
                              disabled={getValues(`workflowTransitions.${i}.code`) != null}
                              onChange={onChange}
                              labelId='validation-fromCode-select'
                              aria-describedby='validation-fromCode-select'
                              error={Boolean(errors?.workflowTransitions?.[i]?.fromCode)}
                            >
                              {defaultValues.workflowStates.map(from => (
                                <MenuItem key={from.code} value={from.code}>
                                  {from.name}
                                </MenuItem>
                              ))}
                            </Select>
                          )}
                        />
                        {errors?.workflowTransitions?.[i]?.fromCode && (
                          <FormHelperText sx={{color: 'error.main'}}>{t('Destination is required')} </FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item lg={6} md={5} xs={12} sx={{px: 4, mb: 3, my: {lg: 0, xs: 4}}}>
                      <FormControl fullWidth>
                        <InputLabel id='validation-toCode-select' htmlFor='validation-toCode-select'>
                          {t('To')}
                        </InputLabel>
                        <Controller
                          name={`workflowTransitions.${i}.toCode`}
                          control={control}
                          rules={{required: true}}
                          render={({field: {value, onChange}}) => (
                            <Select
                              size='small'
                              value={value}
                              disabled={getValues(`workflowTransitions.${i}.code`) != null}
                              label={t('To')}
                              onChange={onChange}
                              labelId='validation-toCode-select'
                              aria-describedby='validation-toCode-select'
                              error={Boolean(errors?.workflowTransitions?.[i]?.toCode)}
                            >
                              {defaultValues.workflowStates.map(to => (
                                <MenuItem key={to.code} value={to.code}>
                                  {to.name}
                                </MenuItem>
                              ))}
                            </Select>
                          )}
                        />
                        {errors?.workflowTransitions?.[i]?.toCode && (
                          <FormHelperText sx={{color: 'error.main'}}>{t('Destination is required')} </FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item lg={6} md={6} xs={12} sx={{px: 4, my: {lg: 0, xs: 4}}}>
                      <FormControl fullWidth sx={{mt: 4}}>
                        <Controller
                          name={`workflowTransitions.${i}.transitionService`}
                          control={control}
                          rules={{required: true}}
                          render={({field: {value, onChange}}) => (
                            <TextField
                              size='small'
                              disabled={getValues(`workflowTransitions.${i}.code`) != null}
                              value={value}
                              label={t('Transition service')}
                              onChange={onChange}
                              error={Boolean(errors?.workflowTransitions?.[i]?.transitionService)}
                            />
                          )}
                        />
                        {errors?.workflowTransitions?.[i]?.transitionService && (
                          <FormHelperText sx={{color: 'error.main'}}>
                            {t('Transition service is required')}{' '}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item lg={6} md={6} xs={12} sx={{px: 4, my: {lg: 0, xs: 4}}}>
                      <FormControl fullWidth sx={{mt: 4}}>
                        <InputLabel>{t('Watchers')}</InputLabel>

                        <Controller
                          name={`workflowTransitions.${i}.watchers`}
                          control={control}
                          rules={{required: true}}
                          render={({field}) => {
                            const value: string[] = field.value || []
                            const notifyChecked = watch(`workflowTransitions.${i}.notify`)
                            const watchersList = notifyChecked ? filteredEmails : emails

                            return (
                              <Select
                                size='small'
                                multiple
                                label={t('Watchers')}
                                value={value || []}
                                MenuProps={MenuProps}
                                onChange={event => {
                                  const currentSelected = event.target.value
                                  const lastSelectedEmail = currentSelected[currentSelected.length]
                                  const isEmailSelected = value.some(email => email === lastSelectedEmail)

                                  if (!isEmailSelected) {
                                    field.onChange(currentSelected)
                                  } else {
                                    const updatedEmails = value.filter(email => email !== lastSelectedEmail)
                                    field.onChange(updatedEmails)
                                  }
                                }}
                                renderValue={selected => selected.map(email => email).join(', ')}
                              >
                                {watchersList.map((email, index) => (
                                  <MenuItem key={index} value={email}>
                                    <Checkbox checked={value.some(e => e === email)}/>
                                    <ListItemText primary={email}/>
                                  </MenuItem>
                                ))}
                              </Select>
                            )
                          }}
                        />
                        {errors.workflowTransitions && (
                          <FormHelperText sx={{color: 'error.main'}}>
                            {errors.workflowTransitions.message}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item lg={6} md={6} xs={12} sx={{px: 4, my: {lg: 0, xs: 4}}}>
                      <FormControl>
                        <Controller
                          name={`workflowTransitions.${i}.notify`}
                          control={control}
                          rules={{required: true}}
                          render={({field}) => (
                            <FormControlLabel
                              label={t('Notify board watchers')}
                              control={
                                <Checkbox
                                  name={`workflowTransitions.${i}.notify`}
                                  checked={field.value || false}
                                  onChange={e => {
                                    const newValue = e.target.checked
                                    field.onChange(newValue)

                                    const selectedWatchers = getValues(`workflowTransitions.${i}.watchers`)
                                    const currentList = newValue ? filteredEmails : emails

                                    const filteredSelectedWatchers = selectedWatchers?.filter(watcher =>
                                      currentList.includes(watcher)
                                    )

                                    setValue(`workflowTransitions.${i}.watchers`, filteredSelectedWatchers)
                                  }}
                                />
                              }
                            />
                          )}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item lg={6} md={6} xs={12} sx={{px: 4, my: {lg: 0, xs: 4}}}>
                      <FormControl sx={{mt: 1}}>
                        <Controller
                          name={`workflowTransitions.${i}.bidirectional`}
                          control={control}
                          rules={{required: true}}
                          render={({field}) => (
                            <FormControlLabel
                              label='Bidirectional'
                              control={
                                <Checkbox
                                  name={`workflowTransitions.${i}.bidirectional`}
                                  checked={field.value || false}
                                  onChange={e => {
                                    const newValue = e.target.checked
                                    field.onChange(newValue)
                                  }}
                                />
                              }
                            />
                          )}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                  <InvoiceAction>
                    <IconButton size='small' onClick={() => handleOpenDeleteDialog(i)}>
                      <Icon icon='tabler:trash' fontSize='1.25rem'/>
                    </IconButton>
                  </InvoiceAction>
                </RepeatingContent>
              </Grid>
            </Tag>
          )
        }}
      </Repeater>

      <Grid container sx={{mt: 4}}>
        <Grid item xs={12} sx={{px: 0}}>
          <Button variant='contained' onClick={toggle} size={'small'} className={'button-padding-style'}>
            <Icon icon='tabler:plus'
                  style={{marginRight: '6px'}}/>
            {t('Add Transition')}
          </Button>
        </Grid>
      </Grid>
      {deleteDialogOpen && (
        <DeleteCommonDialog
          open={deleteDialogOpen}
          setOpen={setDeleteDialogOpen}
          selectedRowId={index}
          onDelete={toggleDelete}
          item='WorkflowTransition'
        />
      )}
    </>
  )
}

export default TransitionWorkflow
