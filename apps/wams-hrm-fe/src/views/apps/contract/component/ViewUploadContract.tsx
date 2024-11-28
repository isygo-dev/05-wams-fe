import React, {Fragment, useState} from 'react'
import IconButton from '@mui/material/IconButton'
import {useMutation} from 'react-query'
import Icon from 'template-shared/@core/components/icon'
import Typography from '@mui/material/Typography'
import Box, {BoxProps} from '@mui/material/Box'
import List from '@mui/material/List'
import Button from '@mui/material/Button'
import {Accordion, AccordionDetails, AccordionSummary, ListItem} from '@mui/material'
import Tooltip from '@mui/material/Tooltip'
import {useDropzone} from 'react-dropzone'
import {useTranslation} from 'react-i18next'
import {styled} from '@mui/material/styles'
import ContractApis from "hrm-shared/@core/api/hrm/contract";

interface FileProp {
  name: string
  type: string
  size: number
}

interface Props {
  id: number
  originalFileName: string
  toggleChangeName: (val: File) => void
  checkPermissionUpdate: boolean
}

const DropzoneWrapper = styled(Box)<BoxProps>(({theme}) => ({
  '&.dropzone, & .dropzone': {
    minHeight: 100, // Adjust the height as needed
    display: 'flex',
    flexWrap: 'wrap',
    cursor: 'pointer',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(1), // Adjust the padding as needed
    borderRadius: theme.shape.borderRadius,
    border: `2px dashed ${theme.palette.divider}`,
    [theme.breakpoints.down('xs')]: {
      textAlign: 'center'
    },
    '&:focus': {
      outline: 'none'
    },
    '& + .MuiList-root': {
      padding: 0,
      marginTop: theme.spacing(6.25),
      '& .MuiListItem-root': {
        display: 'flex',
        justifyContent: 'space-between',
        borderRadius: theme.shape.borderRadius,
        padding: theme.spacing(2.5, 2.4, 2.5, 6),
        border: `1px solid ${theme.palette.mode === 'light' ? 'rgba(93, 89, 98, 0.14)' : 'rgba(247, 244, 254, 0.14)'}`,
        '& .file-details': {
          display: 'flex',
          alignItems: 'center'
        },
        '& .file-preview': {
          display: 'flex',
          marginRight: theme.spacing(3.75),
          '& svg': {
            fontSize: '2rem'
          }
        },
        '& img': {
          width: 38,
          height: 38,
          padding: theme.spacing(0.75),
          borderRadius: theme.shape.borderRadius,
          border: `1px solid ${theme.palette.mode === 'light' ? 'rgba(93, 89, 98, 0.14)' : 'rgba(247, 244, 254, 0.14)'}`
        },
        '& .file-name': {
          fontWeight: 600
        },
        '& + .MuiListItem-root': {
          marginTop: theme.spacing(3.5)
        }
      },
      '& + .buttons': {
        display: 'flex',
        justifyContent: 'flex-end',
        marginTop: theme.spacing(6.25),
        '& > :first-of-type': {
          marginRight: theme.spacing(3.5)
        }
      }
    },
    '& img.single-file-image': {
      objectFit: 'cover',
      position: 'absolute',
      width: 'calc(100% - 1rem)',
      height: 'calc(100% - 1rem)',
      borderRadius: theme.shape.borderRadius
    }
  }
}))
const ViewUploadContract = (props: Props) => {
  const {t} = useTranslation()
  const {id, originalFileName, toggleChangeName, checkPermissionUpdate} = props
  const [contractId, setContractId] = useState<number>(id)
  const [files, setFiles] = useState<File[]>([])

  const renderFilePreview = (file: FileProp) => {
    if (file?.type?.startsWith('image')) {
      return <img width={38} height={38} alt={file.name} src={URL.createObjectURL(file as any)}/>
    } else {
      return <Icon icon='tabler:file-description'/>
    }
  }

  const {getRootProps, getInputProps} = useDropzone({
    multiple: false,
    accept: {
      'file/*': ['.pdf', '.doc', '.docx']
    },
    onDrop: (acceptedFiles: File[]) => {
      setFiles(acceptedFiles.map((file: File) => Object.assign(file)))
    }
  })

  const handleRemoveFile = (file: FileProp) => {
    const uploadedFiles = files
    const filtered = uploadedFiles.filter((i: FileProp) => i.name !== file.name)
    setFiles([...filtered])
  }

  const downloadMutation = useMutation({
    mutationFn: (data: { id: number; originalFileName: string }) => ContractApis(t).downloadContractFile(data),
    onSuccess: () => {
    },
    onError: err => {
      console.log(err)
    }
  })

  const uploadContractMutation = useMutation({
    mutationFn: () => ContractApis(t).uploadContractFile({id: id, file: files[0]}),
    onSuccess: () => {
      setContractId(id)
      toggleChangeName(files[0])
    },
    onError: err => {
      console.log(err)
    }
  })

  function download() {
    downloadMutation.mutate({id: id, originalFileName: originalFileName})
  }

  function onUploadFile() {
    if (files?.length > 0) {
      uploadContractMutation.mutate()

      handleRemoveAllFiles()
    }
  }

  const fileList = files.map((file: FileProp) => (
    <ListItem key={file.name}>
      <div className='file-details'>
        <div className='file-preview'>{renderFilePreview(file)}</div>
        <div>
          <Typography className='file-name'>{file.name}</Typography>
          <Typography className='file-size' variant='body2'>
            {Math.round(file.size / 100) / 10 > 1000
              ? `${(Math.round(file.size / 100) / 10000).toFixed(1)} mb`
              : `${(Math.round(file.size / 100) / 10).toFixed(1)} kb`}
          </Typography>
        </div>
      </div>
      <IconButton onClick={() => handleRemoveFile(file)}>
        <Icon icon='tabler:x' fontSize={20}/>
      </IconButton>
    </ListItem>
  ))
  const handleRemoveAllFiles = () => {
    setFiles([])
  }

  return (
    <>
      <Accordion sx={{height: '100%'}}>
        <AccordionSummary
          expandIcon={<Icon icon='tabler:chevron-down'/>}
          aria-controls='panel1a-content'
          id='panel1a-header'
        >
          <Typography>{t('Contract File')}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <DropzoneWrapper style={{minHeight: 100}}>
            <Fragment>
              {checkPermissionUpdate && (
                <div {...getRootProps({className: 'dropzone'})}>
                  <input {...getInputProps()} />
                  <Box
                    sx={{
                      display: 'flex',
                      textAlign: 'center',
                      alignItems: 'center',
                      flexDirection: 'column'
                    }}
                  >
                    <Icon icon='tabler:upload' fontSize='1.75rem'/>
                    <Typography variant='h4' sx={{mb: 2.5}}>
                      Drop files here or click to upload.
                    </Typography>
                    <Typography sx={{color: 'text.secondary'}}>
                      (You can upload your contract on multiple languages.)
                    </Typography>
                  </Box>
                </div>
              )}
              {files.length > 0 && checkPermissionUpdate ? (
                <>
                  <List>{fileList}</List>
                  <div className='buttons'>
                    <Button color='error' variant='outlined' onClick={handleRemoveAllFiles}>
                      Remove File
                    </Button>
                    <Button variant='contained' onClick={onUploadFile}>
                      Upload File
                    </Button>
                  </div>
                </>
              ) : (
                <List>
                  <ListItem key={contractId} sx={{display: 'flex', justifyContent: 'space-between'}}>
                    <div className='file-details'>
                      <div className='file-preview'>
                        <Icon icon='tabler:file-description'/>
                      </div>
                      <div>
                        <Typography className='file-name'>{contractId}</Typography>
                      </div>
                    </div>
                    <div>
                      <Tooltip title={t('Action.Download') as string}>
                        <IconButton size='small' sx={{color: 'text.secondary'}} onClick={download}>
                          <Icon icon='material-symbols:download'/>
                        </IconButton>
                      </Tooltip>
                    </div>
                  </ListItem>
                </List>
              )}
            </Fragment>
          </DropzoneWrapper>
        </AccordionDetails>
      </Accordion>
    </>
  )
}

export default ViewUploadContract
