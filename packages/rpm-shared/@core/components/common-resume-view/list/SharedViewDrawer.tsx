// ** React Imports
import React, {useState} from 'react'

// ** MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'

import Avatar from '@mui/material/Avatar'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'

import {ResumeShareInfo} from 'rpm-shared/@core/types/rpm/ResumeTypes'

import Typography from '@mui/material/Typography'

import Rating from '@mui/material/Rating'
import {MinAccountDto} from "ims-shared/@core/types/ims/accountTypes"
import imsApiUrls from "ims-shared/configs/ims_apis"
import {useMutation} from 'react-query'
import {useTranslation} from 'react-i18next'
import ResumeApis from "rpm-shared/@core/api/rpm/resume";

type Props = {
    open: boolean
    setOpen: (val: boolean) => void
    setResume: (val: ResumeShareInfo) => void
    resumeShareInfo: ResumeShareInfo
    accountData: MinAccountDto
}

const SharedViewDrawer = (props: Props) => {
    // ** State
    const {t} = useTranslation()
    const {open, setOpen, resumeShareInfo, accountData, setResume} = props
    const [comment, setComment] = useState<string>(resumeShareInfo.comment)
    const [rating, setRating] = useState<number>(resumeShareInfo.rate)

    const handleClose = () => setOpen(false)

    const saveReviewMutation = useMutation({
        mutationFn: (data: ResumeShareInfo) => ResumeApis(t).updateResumeReview(data),
        onSuccess: res => {
            setResume(res)
            handleClose()
        }
    })
    const saveReview = async () => {
        const data: ResumeShareInfo = {
            id: resumeShareInfo.id,
            sharedWith: resumeShareInfo.sharedWith,
            comment: comment,
            rate: rating
        }

        saveReviewMutation.mutate(data)
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth='md'
            fullWidth={true}
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
        >
            <DialogTitle id='alert-dialog-title'>Resume Review</DialogTitle>
            <DialogContent sx={{mt: 2}}>
                <DialogContentText>
                    <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                        <Box sx={{display: 'flex', alignItems: 'center'}}>
                            <Avatar
                                src={`${imsApiUrls.apiUrl_IMS_Account_ImageDownload_EndPoint}/${accountData.id}`}
                                sx={{mr: 2.5, height: 38, width: 38}}
                            />
                            <Typography variant='h6'>{accountData.fullName}</Typography>
                        </Box>

                        <Box sx={{display: 'flex', alignItems: 'center'}}>
                            <Rating
                                value={rating}
                                onChange={(e: any) => {
                                    setRating(parseInt(e.target?.value))
                                }}
                            />
                        </Box>
                    </Box>
                    <TextField
                        size='small'
                        fullWidth
                        multiline
                        rows={4}
                        sx={{my: 4, color: 'text.secondary', minWidth: '100'}}
                        value={comment}
                        onChange={e => {
                            setComment(e.target.value)
                        }}
                    />
                </DialogContentText>
            </DialogContent>
            <DialogActions className='dialog-actions-dense'>
                <Button onClick={handleClose}>Close</Button>
                <Button onClick={saveReview}>Save</Button>
            </DialogActions>
        </Dialog>
    )
}

export default SharedViewDrawer
