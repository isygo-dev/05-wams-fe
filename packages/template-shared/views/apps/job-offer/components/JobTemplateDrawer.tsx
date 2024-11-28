import React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import TextField from '@mui/material/TextField'
import {Box} from '@mui/material'
import {useMutation, useQueryClient} from 'react-query'
import {JobTemplate} from 'rpm-shared/@core/types/rpm/jobOfferTemplateTypes'
import {useTranslation} from 'react-i18next'
import JobOfferTemplateApis from "rpm-shared/@core/api/rpm/job-offer/template";
import {JobOfferType} from "rpm-shared/@core/types/rpm/jobOfferTypes";

type Props = {
    open: boolean
    setOpen: (val: boolean) => void
    job: JobOfferType
    handleRowOptionsClose: () => void
}

const TemplateJobDrawer = (props: Props) => {
    const queryClient = useQueryClient()
    const {t} = useTranslation()
    const {open, setOpen, job, handleRowOptionsClose} = props
    const updateTemplate = useMutation({
        mutationFn: (data: JobTemplate) => JobOfferTemplateApis(t).addJobOfferTemplate(data),
        onSuccess: (res: any) => {
            if (res) {
                const cashedData = (queryClient.getQueryData('jobTemplates') as any[]) || []
                const newData = [...cashedData, res]
                queryClient.setQueryData('jobTemplates', newData)
            }

            handleClose()
        },
        onError: err => {
            console.log(err)
        }
    })

    let title = ''
    const handleClose = () => {
        setOpen(false)
        handleRowOptionsClose()
    }
    const submit = () => {
        const jobTemplate: JobTemplate = {domain: 'isygoit.eu', title: title, jobOffer: job}
        updateTemplate.mutate(jobTemplate)
    }

    function handleTitleChang(newTitle: string) {
        title = newTitle
    }

    return (
        <Dialog fullWidth open={open} onClose={handleClose} sx={{'& .MuiPaper-root': {width: '100%', maxWidth: 512}}}>
            <DialogTitle id='alert-dialog-title'>{t('Action.Mark_as_Template')}</DialogTitle>
            <DialogContent sx={{mt: 2}}>
                <TextField size='small' onChange={e => handleTitleChang(e.target.value)} placeholder={t('Title')}
                           fullWidth/>
                <Box sx={{p: 0, position: 'relative', overflowX: 'hidden', height: 'calc(100% - 7.625rem)'}}></Box>
            </DialogContent>
            <DialogActions className='dialog-actions-dense'>
                <Button onClick={submit}>Submit</Button>
            </DialogActions>
        </Dialog>
    )
}

export default TemplateJobDrawer
