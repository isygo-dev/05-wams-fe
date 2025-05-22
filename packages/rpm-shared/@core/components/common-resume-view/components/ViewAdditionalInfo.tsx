import React from 'react'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

const ViewAdditionalInfo: React.FC<{ candidateName: string }> = ({ candidateName }) => (
  <Card sx={{ height: '100%' }}>
    <CardHeader title={`Congratulations ${candidateName}`} sx={{ padding: '16px' }} />
    <CardContent>
      <Typography variant='subtitle2'>
        You are among the first 25% best profiles. Your Profile is rated 75% compatible with your resume
      </Typography>
      <Button
        variant='contained'
        color='primary'
        className={'button-padding-style'}
        sx={{ marginTop: 2 }}
        size={'small'}
      >
        View tests
      </Button>
    </CardContent>
  </Card>
)

export default ViewAdditionalInfo
