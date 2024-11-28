import {WorkflowsType} from 'rpm-shared/@core/types/rpm/workflowTypes'
import {WorkflowStateSwitch} from 'rpm-shared/@core/types/rpm/stateTypes'
import Repeater from 'template-shared/@core/components/repeater'
import Box, {BoxProps} from '@mui/material/Box'
import Grid, {GridProps} from '@mui/material/Grid'
import FormControl from '@mui/material/FormControl'
import {Control, Controller, FieldErrors} from 'react-hook-form'
import TextField from '@mui/material/TextField'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Icon from 'template-shared/@core/components/icon'
import React, {useState} from 'react'
import {styled} from '@mui/material/styles'
import {useTranslation} from 'react-i18next'
import Button from '@mui/material/Button'
import FormHelperText from '@mui/material/FormHelperText'
import DeleteCommonDialog from 'template-shared/@core/components/DeleteCommonDialog'

interface Props {
  count: number
  control: Control<WorkflowsType>
  toggle: () => void
  toggleDelete: (index: number) => void
  errors: FieldErrors<WorkflowsType>
}

const StateWorkflow = (props: Props) => {
  const {count, control, toggle, toggleDelete, errors} = props
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
  const {t} = useTranslation()
  const InvoiceAction = styled(Box)<BoxProps>(({theme}) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    padding: theme.spacing(2, 1),
    borderLeft: `1px solid ${theme.palette.divider}`
  }))

  const handleOpenDeleteDialog = (index: number) => {
    setDeleteDialogOpen(true), setIndex(index)
  }

  return (
    <>
      <Repeater count={count}>
        {(i: number) => {
          return (
            <Box key={i} className='repeater-wrapper'>
              <Grid container>
                <RepeatingContent item xs={12}>
                  <Grid container sx={{py: 4, width: '100%', pr: {lg: 0, xs: 4}}}>
                    <Grid item lg={6} md={5} xs={12} sx={{px: 4, my: {lg: 0, xs: 4}}}>
                      <FormControl fullWidth>
                        <Controller
                          name={`workflowStates.${i}.code`}
                          control={control}
                          rules={{required: true}}
                          render={({field: {value, onChange}}) => (
                            <TextField size='small' value={value} label={t('Code')} onChange={onChange} disabled/>
                          )}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item lg={6} md={5} xs={12} sx={{px: 4, my: {lg: 0, xs: 4}}}>
                      <FormControl fullWidth>
                        <Controller
                          name={`workflowStates.${i}.name`}
                          control={control}
                          rules={{required: true}}
                          render={({field: {value, onChange}}) => (
                            <TextField
                              size='small'
                              value={value || ''}
                              label={t('Name')}
                              onChange={onChange}
                              error={Boolean(errors?.workflowStates?.[i]?.name)}
                            />
                          )}
                        />

                        {errors?.workflowStates?.[i]?.name && (
                          <FormHelperText sx={{color: 'error.main'}}>{t('Name is required')}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item lg={6} md={5} xs={12} sx={{pt: 4, px: 4, my: {lg: 0, xs: 4}}}>
                      <FormControl fullWidth>
                        <Controller
                          name={`workflowStates.${i}.sequence`}
                          control={control}
                          rules={{required: true}}
                          defaultValue={i + 1}
                          render={({field: {value, onChange}}) => (
                            <TextField
                              size='small'
                              type='number'
                              value={value || ''}
                              label={t('Sequence')}
                              onChange={onChange}
                            />
                          )}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item lg={6} md={5} xs={12} sx={{pt: 4, px: 4, my: {lg: 0, xs: 4}}}>
                      <FormControl fullWidth>
                        <Controller
                          name={`workflowStates.${i}.positionType`}
                          control={control}
                          rules={{required: true}}
                          defaultValue={WorkflowStateSwitch.INIT}
                          render={({field: {value, onChange}}) => (
                            <Select
                              size='small'
                              value={value || WorkflowStateSwitch.INIT}
                              label={t('State')}
                              labelId='validation-etat-select'
                              aria-describedby='validation-etat-select'
                              onChange={onChange}
                            >
                              <MenuItem value={WorkflowStateSwitch.INIT}>Initial state</MenuItem>
                              <MenuItem value={WorkflowStateSwitch.INTER}>Intermediate</MenuItem>
                              <MenuItem value={WorkflowStateSwitch.FINAL}>Final state</MenuItem>
                            </Select>
                          )}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item lg={3} md={3} xs={12} sx={{pt: 4, px: 4, my: {lg: 0, xs: 4}}}>
                      <FormControl fullWidth>
                        <Controller
                          name={`workflowStates.${i}.color`}
                          control={control}
                          rules={{required: true}}
                          render={({field: {value, onChange}}) => (
                            <TextField
                              size='small'
                              type='color'
                              value={value || ''}
                              label={t('Color')}
                              onChange={onChange}
                              placeholder='Color'
                              id={`workflowStates.${i}.color`}
                              sx={{mt: 3.5}}
                            />
                          )}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item lg={12} md={12} xs={12} sx={{px: 4, my: {lg: 0, xs: 4}}}>
                      <FormControl fullWidth sx={{mt: 4, mb: 4}}>
                        <Controller
                          name={`workflowStates.${i}.description`}
                          control={control}
                          rules={{required: true}}
                          render={({field: {value, onChange}}) => (
                            <TextField
                              size='small'
                              rows={4}
                              multiline
                              value={value || ''}
                              label={t('Description')}
                              onChange={onChange}
                              placeholder='descrption'
                              id={`workflowStates.${i}.description`}
                              error={Boolean(errors.description)}
                              sx={{mt: 3.5}}
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
            </Box>
          )
        }}
      </Repeater>

      <Grid container sx={{mt: 4}}>
        <Grid item xs={12} sx={{px: 0}}>
          <Button variant='contained' onClick={toggle} size={'small'} className={'button-padding-style'}>
            <Icon icon='tabler:plus'
                  style={{marginRight: '6px'}}/>
            {t('Add State')}
          </Button>
        </Grid>
      </Grid>
      {deleteDialogOpen && (
        <DeleteCommonDialog
          open={deleteDialogOpen}
          setOpen={setDeleteDialogOpen}
          selectedRowId={index}
          onDelete={toggleDelete}
          item='WorkflowState'
        />
      )}
    </>
  )
}

export default StateWorkflow
