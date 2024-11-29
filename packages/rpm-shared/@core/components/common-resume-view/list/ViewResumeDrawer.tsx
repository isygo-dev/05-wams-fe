import React, {useEffect, useState} from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'

import {ResumeShareInfo, ResumeTypes} from 'rpm-shared/@core/types/rpm/ResumeTypes'

import {useTranslation} from 'react-i18next'
import IconButton from '@mui/material/IconButton'
import Icon from 'template-shared/@core/components/icon'
import {MenuItem, Select} from '@mui/material'
import {styled} from '@mui/material/styles'
import Box, {BoxProps} from '@mui/material/Box'

import CardHeader from '@mui/material/CardHeader'
import ResumePreview from './ResumeReview'
import Tooltip from '@mui/material/Tooltip'
import ApplicationJob from './ApplicationJob'
import ViewAdditionalFile from '../components/ViewAdditionalFile'
import ViewUploadResume from '../components/ViewUploadResume'
import ViewProfessionalExperience from '../components/ViewProfessionalExperience'
import ViewSkills from '../components/ViewSkills'
import ViewLanguage from '../components/ViewLanguage'
import ViewCertification from '../components/ViewCertification'
import ViewEducation from '../components/ViewEducation'
import ViewPersonalInformation from '../components/ViewPersonalInformation'
import ViewShareInfo from '../components/ViewShareInfo'
import CropperCommon from 'template-shared/@core/components/cropper'
import {AddressTypes} from 'ims-shared/@core/types/ims/addressTypes'
import CommonAddress from 'template-shared/@core/components/common-address/CommonAddress'
import {useMutation, useQuery} from 'react-query'
import ViewResumePDF from '../components/ViewResumePDF'
import ShareDrawer from './ShareDrawer'
import TextField from '@mui/material/TextField'
import {useFetchAllProperties} from 'template-shared/hooks/useFetchProperties'
import TimelineLeft from '../components/ViewTimeline'
import {DomainType} from "ims-shared/@core/types/ims/domainTypes";
import HeaderCardView from 'template-shared/@core/components/card-header-view'
import {ListItemsMenuType} from 'quiz-shared/@core/types/quiz/quizTypes'
import StatisticsByResumeContainer from '../components/ViewStatisticByResume'
import ViewAdditionalInfo from '../components/ViewAdditionalInfo'
import PictureCard from "template-shared/@core/components/pictureCard";
import {
    PermissionAction,
    PermissionApplication,
    PermissionPage
} from "template-shared/@core/types/helper/apiPermissionTypes";
import {checkPermission} from "template-shared/@core/api/helper/permission";
import DomainApis from "ims-shared/@core/api/ims/domain";
import ResumeApis from "rpm-shared/@core/api/rpm/resume";
import rpmApiUrls from "rpm-shared/configs/rpm_apis";

interface ResumeViewProps {
    resumeDetailsData: ResumeTypes
    saveResume: (data: ResumeTypes) => void
}


const ViewResumeDrawer = (props: ResumeViewProps) => {
    const {t} = useTranslation()
    const resumeDetailsData = props.resumeDetailsData
    const saveResume = props.saveResume
    const {data: domainList, isFetched: isFetchedDomains} = useQuery('domains', DomainApis(t).getDomains)

    const {result, isLoading} = useFetchAllProperties({guiName: 'ResumeDetails'})

    useEffect(() => {
        setEditedAddress({...resumeDetailsData.address})
    }, [resumeDetailsData.address])

    const [editedData, setEditedData] = useState<ResumeTypes>({
        ...resumeDetailsData,
        address: {...resumeDetailsData.address},
        details: {
            ...resumeDetailsData.details,
            educations:
                resumeDetailsData.details?.educations?.map(exp => ({
                    ...exp,
                    yearOfGraduation: exp.yearOfGraduation ? new Date(exp.yearOfGraduation) : null
                })) || [],
            profExperiences:
                resumeDetailsData.details?.profExperiences?.map(exp => ({
                    ...exp,
                    startDate: exp.startDate ? new Date(exp.startDate) : null,
                    endDate: exp.endDate ? new Date(exp.endDate) : null
                })) || []
        }
    })

    const accordionIsOpen = (name: string): boolean => {
        const foundItem = result?.find(item => item.name === name)

        if (foundItem) {
            return foundItem.value.toLowerCase() === 'true'
        }

        return false
    }

    const [generateResumeData, setGenerateResumeData] = useState<ResumeTypes>(JSON.parse(JSON.stringify(editedData)))
    const [dialogShare, setDialogShare] = useState<boolean>(false)
    const [isFormValid, setIsFormValid] = useState(true)
    const [updateImage, setUpdateImage] = useState<boolean>(false)
    const [editedAddress, setEditedAddress] = useState<AddressTypes>({
        country: '',
        state: '',
        city: '',
        street: '',
        zipCode: null,
        latitude: '',
        longitude: '',
        additionalInfo: ''
    })
    const [photoFile, setPhotoFile] = useState<File>()

    const openImageEdit = () => {
        setUpdateImage(true)
    }
    const onSaveImage = (newImage: Blob) => {
        updatePictureMutation.mutate({id: editedData.id, file: newImage})
        setPhotoFile(newImage as File)
    }

    const updatePictureMutation = useMutation({
        mutationFn: (data: { id: number; file: Blob }) => ResumeApis(t).updateResumePicture(data),
        onSuccess: () => {
            setUpdateImage(false)
        }
    })

    const [tags, setTags] = useState<string[]>(resumeDetailsData.tags || [])

    const [showGeneratePPF, setShowGeneratePPF] = useState<boolean>(false)

    const [editApplicationOpen, setEditApplicationOpen] = useState<boolean>(false)
    const handleEditResume = () => {
        // Update editedData with cleaned skills, educations, and profExperiences
        const updatedData = {
            ...editedData,
            address: {
                ...editedAddress
            },
            details: {
                ...editedData.details,
                skills: (editedData.details?.skills || []).map((skill, index) => ({
                    ...skill,
                    id: (resumeDetailsData.details?.skills || [])[index]?.id || null
                })),
                educations: (editedData.details?.educations || []).map((edu, index) => ({
                    ...edu,
                    id: (resumeDetailsData.details?.educations || [])[index]?.id || null
                })),
                profExperiences: (editedData.details?.profExperiences || []).map((exp, index) => ({
                    ...exp,
                    id: (resumeDetailsData.details?.profExperiences || [])[index]?.id || null
                })),
                certifications: (editedData.details?.certifications || []).map((cert, index) => ({
                    ...cert,
                    id: (resumeDetailsData.details?.certifications || [])[index]?.id || null
                })),
                languages: (editedData.details?.languages || []).map((lang, index) => ({
                    ...lang,
                    id: (resumeDetailsData.details?.languages || [])[index]?.id || null
                }))
            },

            tags
        }

        if (isFormValid) {
            saveResume(updatedData)
            setGenerateResumeData(updatedData)
        }
    }

    useMutation({
        mutationFn: (data: ResumeTypes) => ResumeApis(t).updateResume(data),
        onSuccess: () => {
        }
    })

    function download() {
        downloadResumeMutation.mutate({id: editedData.id, originalFileName: editedData.originalFileName})
    }

    const downloadResumeMutation = useMutation({
        mutationFn: (data: { id: number, originalFileName: string }) => ResumeApis(t).downloadResumeFile(data),
        onSuccess: () => {
        }
    })

    const handleDataFromChild = data => {
        const updatedData = {...editedData}
        updatedData.details = {
            ...updatedData.details
        }
        updatedData.additionalFiles = data
        setEditedData(updatedData)
    }

    const handlePrint = () => {
        // Add logic here to handle printing
        setShowGeneratePPF(true)
    }
    const handleShare = () => {
        // Add logic here to handle sharing
        setDialogShare(true)
    }
    const handleApply = () => {
        setEditApplicationOpen(true)
    }
    const toggleEditJobApplicationDrawer = () => setEditApplicationOpen(!editApplicationOpen)
    let openEditApplicationForm
    if (editApplicationOpen) {
        openEditApplicationForm = (
            <ApplicationJob
                open={editApplicationOpen}
                toggle={toggleEditJobApplicationDrawer}
                code={editedData.code}
                email={editedData.email}
            />
        )
    } else {
        openEditApplicationForm = ''
    }

    const [showFileCard, setShowFileCard] = useState<boolean>(false)
    const [showTimeLine, setShowTimeLine] = useState<boolean>(false)

    const [resumeId, setResumeId] = useState<number>(null)


    const showCard = (show: boolean) => {
        if (show) {
            setResumeId(editedData.id)
        } else {
            setResumeId(null)
        }
        setShowFileCard(show)
        setShowTimeLine(false)
    }

    const showCardTimeline = (showT: boolean) => {
        if (showT) {
            setResumeId(editedData.id)
            setShowFileCard(false)
        }
        setShowTimeLine(showT)
    }

    const toggleChangeName = (fileNew: File) => {
        resumeDetailsData.originalFileName = fileNew.name
        resumeDetailsData.file = fileNew
        editedData.originalFileName = fileNew.name
        editedData.file = fileNew
        showCard(true)
    }

    const setResumeSharedInfo = (sharedInfos: ResumeShareInfo[]) => {
        setEditedData({
            ...editedData,
            resumeShareInfos: sharedInfos
        })
    }

    const Toggler = styled(Box)<BoxProps>(({theme}) => ({
        marginBottom: '5px',
        zIndex: theme.zIndex.modal,
        backgroundColor: theme.palette.primary.main,
        borderTopLeftRadius: '6px',
        borderBottomLeftRadius: '6px',
        color: 'white',
        padding: '9px 11px',
        display: 'grid',
        cursor: 'pointer'
    }))

    const handleInputChange = (field: keyof ResumeTypes, value: string) => {
        if (!checkPermission(PermissionApplication.RPM, PermissionPage.RESUME, PermissionAction.WRITE)) {

            setEditedData(prevData => {
                const updatedData = {...prevData}

                // @ts-ignore
                updatedData[field] = value
                setIsFormValid(true)

                return updatedData
            })
        }
    }


    const getListItems = () => {
        const newListItems: ListItemsMenuType[] = []


        if (!checkPermission(PermissionApplication.RPM, PermissionPage.RESUME, PermissionAction.WRITE)) {
            newListItems.push({
                    title: 'Apply',
                    name: 'Apply'
                }
            )
        }
        if (!checkPermission(PermissionApplication.RPM, PermissionPage.RESUME_FILE, PermissionAction.WRITE)) {
            newListItems.push({
                    title: 'Download',
                    name: 'Download'
                }
            )
        }
        if (!checkPermission(PermissionApplication.RPM, PermissionPage.RESUME_SHARE_INFO, PermissionAction.WRITE)) {
            newListItems.push({
                    title: 'Share',
                    name: 'Quiz.Share'
                }
            )
        }

        if (!checkPermission(PermissionApplication.RPM, PermissionPage.RESUME, PermissionAction.WRITE)) {
            newListItems.push({
                    title: 'Print',
                    name: 'Print'
                }
            )
        }

        return newListItems
    }

    const handleReset = () => {
        setEditedData(generateResumeData)
    }
    const handleChange = (item?: ListItemsMenuType) => {
        const itemClick = getListItems()?.find(d => d.name === item.name)
        switch (itemClick.title) {
            case 'Apply':
                handleApply()
                break
            case 'Download':
                download()
                break
            case 'Share':
                handleShare()
                break
            case 'Print':
                handlePrint()
                break
        }
    }

    const handleSave = () => {
        handleEditResume()
    }

    return !isLoading && isFetchedDomains ? (
        <>

            <HeaderCardView
                title={'Resume.Resume'}
                btnSave={checkPermission(PermissionApplication.RPM, PermissionPage.RESUME, PermissionAction.WRITE)}
                btnCancel={checkPermission(PermissionApplication.RPM, PermissionPage.RESUME, PermissionAction.WRITE)}
                multiBtn={getListItems()?.length > 0}
                ITEM_HEIGHT={48}
                listItems={getListItems()}
                handleReset={handleReset}
                handleChange={handleChange}
                onSubmit={handleSave}
                disableCancel={false}
                disableSubmit={false}
            />
            <Grid container spacing={2} sx={{mb: 3}}>
                <Grid item sm={12} md={2.5}>
                    <ViewAdditionalInfo candidateName={editedData.firstName}/>
                </Grid>
                <Grid item sm={12} md={9.5}>
                    <StatisticsByResumeContainer codeCandidat={editedData.code}/>
                </Grid>
            </Grid>

            <Grid container direction='column' spacing={3} justifyContent='space-between' alignItems='stretch'>
                <Grid item sm={12} md={6} xs={12}>
                    <Grid container spacing={2} justifyContent='space-between' alignItems='stretch'>
                        <Grid item sm={12} md={2} xs={12}>
                            <PictureCard photoFile={photoFile}
                                         openImageEdit={checkPermission(PermissionApplication.RPM, PermissionPage.RESUME_IMAGE, PermissionAction.WRITE) && openImageEdit}
                                         url={checkPermission(PermissionApplication.RPM, PermissionPage.RESUME_IMAGE, PermissionAction.READ) &&
                                             `${rpmApiUrls.apiUrl_RPM_Resume_ImageDownload_EndPoint}/${editedData.id}`}
                                         permissionApplication={PermissionApplication.RPM}
                                         permissionPage={PermissionPage.RESUME_IMAGE}
                            />
                        </Grid>
                        <Grid
                            item
                            sm={12}
                            xs={12}
                            md={editedData?.resumeShareInfos && editedData?.resumeShareInfos.length > 0 ? 6 : 10}
                        >
                            <ViewUploadResume
                                id={editedData?.id}
                                originalFileName={editedData?.originalFileName}
                                toggleChangeName={toggleChangeName}
                            />
                        </Grid>
                        {checkPermission(PermissionApplication.RPM, PermissionPage.RESUME_SHARE_INFO, PermissionAction.READ) &&
                            <ViewShareInfo editedData={editedData} setEditedData={setEditedData}/>}
                    </Grid>
                </Grid>

                <Grid item sm={12} md={12} xs={12}>
                    <Grid container spacing={2}>
                        <Grid
                            item
                            sm={12}
                            xs={12}
                            md={showFileCard || showTimeLine ? 6 : 12}
                            className={showFileCard || showTimeLine ? 'gridCulomn-resum-detail' : ''}
                        >
                            <Grid container spacing={2}>
                                <Grid item sm={12} md={12} sx={{mt: 3}} xs={12}>
                                    <Card>
                                        <CardContent>
                                            <Grid container spacing={3} sx={{mt: 2}}>
                                                <Grid item sm={12} md={8}>
                                                    <TextField
                                                        size='small'
                                                        label={t('Title')}
                                                        value={editedData.title}
                                                        fullWidth
                                                        variant='outlined'
                                                        onChange={e => handleInputChange('title', e.target.value)}
                                                    />
                                                </Grid>
                                                <Grid item sm={12} md={4}>
                                                    <Select
                                                        fullWidth
                                                        disabled
                                                        size='small'
                                                        label={t('Domain.Domain')}
                                                        name='domain'
                                                        onChange={e => handleInputChange('domain', e.target.value)}
                                                        value={editedData.domain}
                                                    >
                                                        <MenuItem value=''>
                                                            <em>{t('None')}</em>
                                                        </MenuItem>
                                                        {domainList?.map((domain: DomainType) => (
                                                            <MenuItem key={domain.id} value={domain.name}>
                                                                {domain.name}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </Grid>
                                            </Grid>
                                        </CardContent>
                                        <CardHeader title={t('Resume.Presentation')}/>
                                        <CardContent>
                                            <TextField
                                                size='small'
                                                minRows={4}
                                                multiline
                                                placeholder={t('Resume.Presentation')}
                                                id='textarea-standard-static'
                                                sx={{width: '100%'}}
                                                name='domain'
                                                onChange={e => handleInputChange('presentation', e.target.value)}
                                                value={editedData.presentation}
                                            />
                                        </CardContent>
                                    </Card>
                                </Grid>

                                <Grid item sm={12} md={showFileCard ? 12 : 6} sx={{mt: 3}} xs={12}>

                                    <ViewPersonalInformation
                                        editedData={editedData}
                                        setEditedData={setEditedData}
                                        setIsFormValid={setIsFormValid}
                                        tags={tags}
                                        setTags={setTags}
                                    />
                                </Grid>

                                <Grid item sm={12} md={showFileCard ? 12 : 6} sx={{mt: 3}} xs={12}>
                                    <Card sx={{height: '100%'}}>
                                        <CardHeader title={t('Address.Address')}/>
                                        <CardContent>
                                            <CommonAddress editedAddress={editedAddress} styleW={200}
                                                           setEditedAddress={setEditedAddress}
                                                           permissionApplication={PermissionApplication.RPM}
                                                           permissionPage={PermissionPage.RESUME}
                                                           permissionAction={PermissionAction.WRITE}
                                            />
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                            <Grid container>

                                <Grid item xs={12}>
                                    <ViewProfessionalExperience
                                        editedData={editedData}
                                        setEditedData={setEditedData}
                                        displayed={accordionIsOpen('ProfessionalExperience')}
                                        permissionApplication={PermissionApplication.RPM}
                                        permissionPage={PermissionPage.RESUME}
                                        permissionAction={PermissionAction.WRITE}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <ViewEducation
                                        editedData={editedData}
                                        setEditedData={setEditedData}
                                        displayed={accordionIsOpen('Education')}

                                        permissionApplication={PermissionApplication.RPM}
                                        permissionPage={PermissionPage.RESUME}
                                        permissionAction={PermissionAction.WRITE}
                                    />

                                </Grid>
                                <Grid item xs={12}>
                                    <ViewSkills editedData={editedData} setEditedData={setEditedData}
                                                displayed={accordionIsOpen('Skills')}

                                                permissionApplication={PermissionApplication.RPM}
                                                permissionPage={PermissionPage.RESUME}
                                                permissionAction={PermissionAction.WRITE}/>

                                </Grid>
                                <Grid item xs={12}>
                                    <ViewCertification
                                        editedData={editedData}
                                        setEditedData={setEditedData}
                                        displayed={accordionIsOpen('Certification')}

                                        permissionApplication={PermissionApplication.RPM}
                                        permissionPage={PermissionPage.RESUME}
                                        permissionAction={PermissionAction.WRITE}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <ViewLanguage
                                        editedData={editedData}
                                        setEditedData={setEditedData}
                                        displayed={accordionIsOpen('Language')}

                                        permissionApplication={PermissionApplication.RPM}
                                        permissionPage={PermissionPage.RESUME}
                                        permissionAction={PermissionAction.WRITE}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <ViewAdditionalFile
                                        id={editedData.id}
                                        additionalFilesDetails={editedData.additionalFiles}
                                        displayed={accordionIsOpen('AdditionnalFile')}
                                        onDataFromChild={handleDataFromChild}

                                    />
                                </Grid>

                            </Grid>
                        </Grid>
                        {showFileCard ? (
                            <Grid item sm={12} md={6} sx={{mt: 1}} className='gridCulomn-resum-detail'>
                                <Card>
                                    <CardContent>
                                        <Box sx={{textAlign: 'right'}}>
                                            <Tooltip title={t('Action.Close')}>
                                                <IconButton size='small' sx={{color: 'text.secondary'}}
                                                            onClick={() => showCard(false)}>
                                                    <Icon icon='material-symbols:close'/>
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                        <Box>
                                            <ResumePreview id={resumeId} extension={editedData.extension}
                                                           domain={editedData.domain}
                                                           fileName={editedData.originalFileName}/>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ) : null}

                        {showTimeLine ? (
                            <Grid item sm={12} md={6} sx={{mt: 1}} className='gridCulomn-resum-detail'>
                                <Card>
                                    <CardContent>
                                        <Box sx={{textAlign: 'right'}}>
                                            <Tooltip title={t('Action.Close')}>
                                                <IconButton size='small' sx={{color: 'text.secondary'}}
                                                            onClick={() => showCardTimeline(false)}>
                                                    <Icon icon='material-symbols:close'/>
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                        <Box>
                                            <TimelineLeft resume={editedData}/>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ) : null}
                    </Grid>
                    <CropperCommon open={updateImage} setOpen={setUpdateImage} size={250} onSave={onSaveImage}/>
                </Grid>

            </Grid>
            {dialogShare && (
                <ShareDrawer open={dialogShare} setOpen={setDialogShare} resume={editedData}
                             setResume={setResumeSharedInfo}/>
            )}

            {showGeneratePPF && (
                <ViewResumePDF
                    open={showGeneratePPF}
                    setOpen={setShowGeneratePPF}
                    fileName={photoFile}
                    item='Resume'
                    dataResume={generateResumeData}
                    dataQuiz={null}
                />
            )}
            <Box
                sx={{
                    position: 'fixed',
                    bottom: '32vh',
                    right: 0,
                    display: 'block'
                }}
            >
                {showFileCard ? null : (
                    checkPermission(PermissionApplication.RPM, PermissionPage.RESUME_FILE, PermissionAction.READ) &&
                    <Tooltip title={t('Resume.Preview_PDF')}>
                        <Toggler onClick={() => showCard(true)}>
                            <Icon icon='fa:file-pdf-o'/>
                        </Toggler>
                    </Tooltip>
                )}
                {showTimeLine ? null : (
                    checkPermission(PermissionApplication.RPM, PermissionPage.TIMELINE, PermissionAction.READ) &&
                    <Tooltip title={t('Resume.Preview_Timeline')}>
                        <Toggler onClick={() => showCardTimeline(true)}>
                            <Icon icon='tabler:adjustments-minus'/>
                        </Toggler>
                    </Tooltip>
                )}
            </Box>

            {openEditApplicationForm}
        </>
    ) : null
}

export default ViewResumeDrawer
