import React, {Fragment, useState} from 'react'
import {useDropzone} from 'react-dropzone'
import Icon from 'template-shared/@core/components/icon'
import {Accordion, ListItem} from '@mui/material'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import AccordionSummary from '@mui/material/AccordionSummary'
import Divider from '@mui/material/Divider'
import AccordionDetails from '@mui/material/AccordionDetails'
import Grid from '@mui/material/Grid'
import Box, {BoxProps} from '@mui/material/Box'
import List from '@mui/material/List'
import Button from '@mui/material/Button'
import {styled} from '@mui/material/styles'
import {useTranslation} from 'react-i18next'
import DeleteJobAdditionalFileDrawer from '../DeleteJobOfferAdditionalFileDrawer'
import {useMutation} from 'react-query'
import useUpdateProperty from 'template-shared/hooks/useUpdateProperty'
import {useFetchProperties} from 'template-shared/hooks/useFetchProperties'
import {propertyName} from 'template-shared/configs/propertyConstantName'
import JobOfferAdditionalFilesApis from "rpm-shared/@core/api/rpm/job-offer/additionalFiles";
import {AdditionalFiles} from "template-shared/@core/types/helper/fileTypes";

interface FileProp {
    name: string
    type: string
    size: number
}

interface AdditionalFilesDetails {
    id: number
    additionalFilesDetails: AdditionalFiles[]
    onDataFromChild: (files: AdditionalFiles[]) => void
}

const DropzoneWrapper = styled(Box)<BoxProps>(({theme}) => ({
    '&.dropzone, & .dropzone': {
        minHeight: 170,
        display: 'flex',
        flexWrap: 'wrap',
        cursor: 'pointer',
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing(4),
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
const ViewAdditionalFile = (props: AdditionalFilesDetails) => {
    const {t} = useTranslation()
    const {id, additionalFilesDetails, onDataFromChild} = props
    const [filesAdditional, setFilesAdditional] = useState<File[]>([])
    const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false)
    const [selectedJobId, setSelectedJobId] = useState<number | null>(null)
    const [selectedAdditionalFile, setSelectedAdditionalFile] = useState<number | null>(null)
    const [selectedCodeAdditionalFile] = useState('')

    const {data, isLoading} = useFetchProperties({
        key: 'AdditionnalFiles',
        guiName: 'JobView',
        name: `${propertyName.additionnalFiles}`
    })
    const {handleSaveChangeWithName} = useUpdateProperty({guiName: 'JobView'})

    const uploadAdditionalFileMutation = useMutation({
        mutationFn: (data: {
            parentId: number;
            files: Blob[]
        }) => JobOfferAdditionalFilesApis(t).uploadAdditionalFiles(data),
        onSuccess: (res: any) => {
            onDataFromChild(res)
        }
    })

    function onUploadAdditionlFile() {
        console.log(filesAdditional)
        if (filesAdditional?.length > 0) {
            setFilesAdditional(prevFiles => {
                prevFiles.concat(filesAdditional)

                return []
            })
            uploadAdditionalFileMutation.mutate({parentId: id, files: filesAdditional})
        }
    }

    function downloadAdditionalFiles(data: {
        parentId: number;
        fileId: number;
        version: number;
        originalFileName: string
    }) {
        downloadAdditionalFileMutation.mutate(data)
    }

    const downloadAdditionalFileMutation = useMutation({
        mutationFn: (data: {
            parentId: number;
            fileId: number;
            version: number;
            originalFileName: string
        }) => JobOfferAdditionalFilesApis(t).downloadAdditionalFile(data),
        onSuccess: () => {
        }
    })

    const handleStateDelete = data => {
        console.log('data result', data)

        if (data.fileId) {
            const filesAfterDeleted = additionalFilesDetails.filter(file => file.id !== data.fileId)
            onDataFromChild(filesAfterDeleted)
        }
    }

    function deleteAdditionalFiles(file) {
        console.log(file)
        setDeleteDialogOpen(true)
        setSelectedAdditionalFile(file.id)
        setSelectedJobId(id)
    }

    const {getRootProps: getRootAdditionalProps, getInputProps: getInputAdditionalProps} = useDropzone({
        multiple: true,
        accept: {
            'file/*': ['.pdf', '.doc', '.docx', '.png', '.jpg', '.jpeg', '.gif']
        },
        onDrop: (acceptedFiles: File[]) => {
            console.log(acceptedFiles)
            setFilesAdditional(filesAdditional.concat(acceptedFiles))
        }
    })

    const renderFilePreview = (file: FileProp) => {
        if (file?.type?.startsWith('image')) {
            return <img width={38} height={38} alt={file.name} src={URL.createObjectURL(file as any)}/>
        } else {
            return <Icon icon='tabler:file-description'/>
        }
    }

    const handleRemoveAdditionalFile = (file: FileProp) => {
        const uploadedFiles = filesAdditional
        const filtered = uploadedFiles.filter((i: FileProp) => i.name !== file.name)
        setFilesAdditional([...filtered])
        console.log(filesAdditional)
    }

    const jobOfferAdditionalFiles = additionalFilesDetails?.map((file: any) => (
        <ListItem
            key={file.id}
            style={{
                justifyContent: 'space-between',
                borderRadius: '6px',
                padding: '0.625rem 0.6rem 0.625rem 1.5rem',
                border: '1px solid rgba(93, 89, 98, 0.14)'
            }}
        >
            <div className='file-details' style={{display: 'flex'}}>
                <div className='file-preview' style={{marginRight: '0.9375rem', fontSize: '2rem'}}>
                    <Icon style={{fontSize: '2rem'}} icon='tabler:file-description'/>
                </div>
                <div>
                    <Typography className='file-name' style={{fontWeight: '600'}}>
                        {file.originalFileName}
                    </Typography>
                    <Typography className='file-size' variant='body2'>
                        {file.size} kb
                    </Typography>
                    <small></small>
                </div>
            </div>
            <div>
                <Tooltip title={t('Action.Download') as string}>
                    <IconButton
                        size='small'
                        sx={{color: 'text.secondary'}}
                        onClick={() => downloadAdditionalFiles({
                            parentId: id,
                            fileId: file.id,
                            version: 1,
                            originalFileName: file.originalFileName
                        })}
                    >
                        <Icon icon='material-symbols:download'/>
                    </IconButton>
                </Tooltip>
                <Tooltip title={t('Action.Delete') as string}>
                    <IconButton size='small' sx={{color: 'text.secondary'}} onClick={() => deleteAdditionalFiles(file)}>
                        <Icon icon='tabler:trash'/>
                    </IconButton>
                </Tooltip>
            </div>
        </ListItem>
    ))
    const handleRemoveAllAdditionalFiles = () => {
        setFilesAdditional([])
    }
    const fileAdditionalList = filesAdditional?.map((file: FileProp) => (
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
            <IconButton onClick={() => handleRemoveAdditionalFile(file)}>
                <Icon icon='tabler:x' fontSize={20}/>
            </IconButton>
        </ListItem>
    ))

    return !isLoading ? (
        <>
            <Accordion
                sx={{boxShadow: 'none !important'}}
                onChange={(e, expended) => handleSaveChangeWithName(expended, `${propertyName.additionnalFiles}`)}
                defaultExpanded={data?.value?.toLowerCase() == 'true'}
            >
                <AccordionSummary
                    expandIcon={<Icon icon='tabler:chevron-down'/>}
                    id='form-layouts-collapsible-header-1'
                    aria-controls='form-layouts-collapsible-content-1'
                >
                    <Typography className={'title-card'}>Additional files</Typography>
                </AccordionSummary>
                <Divider sx={{m: '0 !important'}}/>
                <AccordionDetails>
                    <Grid item xs={12} sm={12} md={12}>
                        <DropzoneWrapper style={{minHeight: 170}}>
                            <Fragment>
                                <div {...getRootAdditionalProps({className: 'dropzone'})}>
                                    <input {...getInputAdditionalProps()} />
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
                                            (You can upload your Job offer on multiple languages.)
                                        </Typography>
                                    </Box>
                                </div>
                                <List>{fileAdditionalList}</List>
                                {filesAdditional?.length > 0 ? (
                                    <>
                                        <div className='buttons'>
                                            <Button color='error' variant='outlined'
                                                    onClick={handleRemoveAllAdditionalFiles}>
                                                {t('Cancel')}
                                                All
                                            </Button>
                                            <Button variant='contained' onClick={onUploadAdditionlFile}>
                                                {t('Upload_Files')}
                                            </Button>
                                        </div>
                                    </>
                                ) : (
                                    <></>
                                )}
                                <List
                                    style={{
                                        padding: '0',
                                        marginTop: '1.5625rem'
                                    }}
                                >
                                    {jobOfferAdditionalFiles}
                                </List>
                            </Fragment>
                        </DropzoneWrapper>
                    </Grid>
                </AccordionDetails>
            </Accordion>
            <DeleteJobAdditionalFileDrawer
                open={deleteDialogOpen}
                setOpen={setDeleteDialogOpen}
                parentId={selectedJobId}
                fileId={selectedAdditionalFile}
                selectCodeFile={selectedCodeAdditionalFile}
                handleStateDelete={handleStateDelete}
            />
        </>
    ) : null
}

export default ViewAdditionalFile
