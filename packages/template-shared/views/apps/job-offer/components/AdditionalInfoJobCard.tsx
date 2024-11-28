import React from 'react'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

const AdditionalInfoJobCard: React.FC = () => (
    <Card sx={{height: '100%'}}>
        <CardHeader title={`Congratulations`}/>
        <CardContent>
            <Typography variant='subtitle2'>Job Completed successfully . Th 7 positions are selected</Typography>
        </CardContent>
    </Card>
)

export default AdditionalInfoJobCard
