import React from 'react'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import { PDFViewer } from '@react-pdf/renderer'
import ResumePdf from './resumePdf'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import Icon from 'template-shared/@core/components/icon'
import QuizAnswerPdf from './quizAnswerPdf'
import { ResumeTypes } from 'rpm-shared/@core/types/rpm/ResumeTypes'
import { CandidateQuizReportType } from 'quiz-shared/@core/types/quiz/quizCandidateType'

type Item = 'Resume' | 'QuizAnswer'
type Props = {
  open: boolean
  setOpen: (val: boolean) => void
  fileName?: File
  item: Item
  dataResume?: ResumeTypes
  dataQuiz?: CandidateQuizReportType
}

const ViewResumePDF = (props: Props) => {
  const { open, setOpen, dataResume, dataQuiz, fileName, item } = props

  const EXAMPLES: { [key in Item]: React.ComponentType<any> } = {
    Resume: ResumePdf,
    QuizAnswer: QuizAnswerPdf
  }
  const Document = EXAMPLES[item]
  const handleClose = () => setOpen(false)

  return (
    <Dialog open={open} onClose={handleClose} fullWidth={true} fullScreen={true} maxWidth='xl'>
      <DialogContent>
        <DialogTitle id='full-screen-dialog-title'>
          <IconButton
            aria-label='close'
            onClick={handleClose}
            sx={{ top: 8, right: 10, position: 'absolute', color: 'grey.500' }}
          >
            <Icon icon='tabler:x' />
          </IconButton>
        </DialogTitle>
        <DialogContentText id='alert-dialog-description'>
          <PDFViewer
            width='100%'
            style={{ height: '90vh' }}

            // showToolbar={false}
          >
            {item === 'Resume' ? (
              <Document data={dataResume} fileName={fileName} />
            ) : (
              <Document data={dataQuiz} fileName={fileName} />
            )}
          </PDFViewer>
        </DialogContentText>
      </DialogContent>
    </Dialog>
  )
}

export default ViewResumePDF
