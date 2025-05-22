import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import AccordionDetails from '@mui/material/AccordionDetails'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import DatePickerWrapper from 'template-shared/@core/styles/libs/react-datepicker'
import DatePicker from 'react-datepicker'
import IconButton from '@mui/material/IconButton'
import Icon from 'template-shared/@core/components/icon'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import Menu from '@mui/material/Menu'
import { ResumeCertification } from 'rpm-shared/@core/types/rpm/ResumeDetails'
import ViewCertificationLinkPopUp from './ViewCertificationLinkPopUp'
import { Accordion } from '@mui/material'
import AccordionSummary from '@mui/material/AccordionSummary'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import useUpdateProperty from 'template-shared/hooks/useUpdateProperty'
import { ResumeTypes } from 'rpm-shared/@core/types/rpm/ResumeTypes'
import { checkPermission } from 'template-shared/@core/api/helper/permission'

interface CertificationProps {
  editedData: ResumeTypes
  setEditedData: (ResumeTypes) => void
  displayed: boolean

  permissionApplication?: string
  permissionPage?: string
  permissionAction?: string
}

interface State {
  mouseX: null | number
  mouseY: null | number
}

const initialState = {
  mouseX: null,
  mouseY: null
}

const ViewCertification = (props: CertificationProps) => {
  const { editedData, setEditedData, displayed, permissionApplication, permissionPage, permissionAction } = props
  const { t } = useTranslation()
  const [state, setState] = useState<State>(initialState)
  const [open, setOpen] = useState<boolean>(false)
  const [certif, setCertif] = useState<ResumeCertification>(null)
  const [index, setIndex] = useState<number>(null)
  const { handleSaveChangeWithName } = useUpdateProperty({ guiName: 'ResumeDetails' })
  const handleDeleteEntry = (field: string, index: number) => {
    setEditedData(prevData => {
      const updatedData = { ...prevData }
      if (updatedData.details && updatedData.details[field]) {
        updatedData.details[field].splice(index, 1)
      }

      return updatedData
    })
  }
  const handleAddCertification = () => {
    setEditedData(prevData => ({
      ...prevData,
      details: {
        ...prevData.details,
        certifications: [
          ...(prevData.details?.certifications || []),
          { name: '', dateOfObtained: new Date(), link: '' }
        ]
      }
    }))
  }
  const handleCertificationChange = (index: number, key: string, value: string | Date | boolean | string[]) => {
    if (!checkPermission(permissionApplication, permissionPage, permissionAction)) {
      const newCertifications = [...(editedData?.details?.certifications || [])]
      const newCertificationObject = { ...newCertifications[index] }
      newCertificationObject[key] = value
      newCertifications[index] = newCertificationObject
      setCertif(newCertificationObject)
      setEditedData(prevData => ({
        ...prevData,
        details: {
          ...prevData.details,
          certifications: newCertifications
        }
      }))
    }
  }

  const handleClick = (event: any, index: number, certif: ResumeCertification) => {
    setCertif(certif)
    setIndex(index)
    event.preventDefault()
    setState({
      mouseX: event.clientX - 2,
      mouseY: event.clientY - 4
    })
  }

  const handleClose = () => {
    setState(initialState)
  }
  const handleModify = () => {
    setOpen(true)
    setState(initialState)
  }

  const handleClear = () => {
    handleCertificationChange(index, 'link', '')
    setState(initialState)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(certif.link)
    setState(initialState)
  }
  const handleOpen = (index: number, certification: ResumeCertification) => {
    if (!certification.link) {
      setOpen(true)
      setCertif(certification)
      setIndex(index)
    } else {
      window.open(certification.link, '_blank').focus()
    }
  }

  return (
    <Accordion
      className={'accordion-expanded'}
      onChange={(e, expended) => handleSaveChangeWithName(expended, 'Certification')}
      defaultExpanded={displayed}
    >
      <AccordionSummary
        expandIcon={<Icon icon='tabler:chevron-down' />}
        id='form-layouts-collapsible-header-1'
        aria-controls='form-layouts-collapsible-content-1'
      >
        <Typography variant='subtitle1' sx={{ fontWeight: 500 }}>
          {t('Resume.Certification')}
        </Typography>
      </AccordionSummary>
      <Divider sx={{ m: '0 !important' }} />
      <AccordionDetails>
        <Grid container>
          {/* ... (other fields and sections) */}
          <Grid item xs={12} sm={12}>
            {editedData.details?.certifications?.map((certification, index) => (
              <Grid container key={index} spacing={4} sx={{ mt: 1 }}>
                <Grid item>
                  <TextField
                    size='small'
                    label='Certification name'
                    required={true}
                    fullWidth
                    variant='outlined'
                    value={certification.name || ''}
                    onChange={e => handleCertificationChange(index, 'name', e.target.value)}
                  />
                </Grid>
                <Grid item>
                  <DatePickerWrapper className='small-input-data'>
                    <DatePicker
                      selected={new Date(certification.dateOfObtained) || new Date()}
                      dateFormat='dd/MM/yyyy'
                      onChange={e => handleCertificationChange(index, 'dateOfObtained', e)}
                      customInput={<TextField size='small' fullWidth label='Certif date' />}
                    />
                  </DatePickerWrapper>
                </Grid>
                <Grid item>
                  <Grid container>
                    <Grid item>
                      <IconButton
                        onClick={() => handleOpen(index, certification)}
                        onContextMenu={e => handleClick(e, index, certification)}
                        sx={{ cursor: 'context-menu' }}
                      >
                        <Icon icon='mingcute:link-line' fontSize='1.25rem' />
                      </IconButton>
                      {checkPermission(permissionApplication, permissionPage, permissionAction) && (
                        <IconButton onClick={() => handleDeleteEntry('certifications', index)}>
                          <Icon icon='tabler:x' fontSize='1.25rem' />
                        </IconButton>
                      )}
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            ))}
          </Grid>
        </Grid>
        {checkPermission(permissionApplication, permissionPage, permissionAction) && (
          <Grid container style={{ marginTop: '10px' }} spacing={2}>
            <Grid container item md={12} sx={{ justifyContent: 'left', paddingBottom: '20px' }}>
              <Button
                variant='contained'
                size={'small'}
                className={'button-padding-style'}
                onClick={handleAddCertification}
              >
                <Icon icon='tabler:plus' style={{ marginRight: '6px' }} /> {t('Resume.Add_certification')}
              </Button>
            </Grid>
          </Grid>
        )}

        <Menu
          keepMounted
          onClose={handleClose}
          open={state.mouseY !== null}
          anchorReference='anchorPosition'
          anchorPosition={
            state.mouseY !== null && state.mouseX !== null
              ? {
                  top: state.mouseY,
                  left: state.mouseX
                }
              : undefined
          }
        >
          <MenuItem onClick={handleCopy}>Copy</MenuItem>
          {checkPermission(permissionApplication, permissionPage, permissionAction) && (
            <MenuItem onClick={handleModify}>Modify</MenuItem>
          )}
          {checkPermission(permissionApplication, permissionPage, permissionAction) && (
            <MenuItem onClick={handleClear}>Clear</MenuItem>
          )}
        </Menu>

        {open && (
          <ViewCertificationLinkPopUp
            certif={certif}
            index={index}
            open={open}
            setOpen={setOpen}
            handleCertificationChange={handleCertificationChange}
          />
        )}
      </AccordionDetails>
    </Accordion>
  )
}

export default ViewCertification
