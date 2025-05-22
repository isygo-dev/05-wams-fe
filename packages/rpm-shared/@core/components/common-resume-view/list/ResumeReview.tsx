import React from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import DocViewer, { DocViewerRenderers } from 'react-doc-viewer'
import rpmApiUrls from 'rpm-shared/configs/rpm_apis'

interface CardItem {
  id: number
  fileName: string
  extension: string
  domain: string
}

const ResumePreview = (props: CardItem) => {
  const { id, extension } = props

  return (
    <Grid>
      <Box>
        <Card sx={{ padding: '0px', boxShadow: 'none !important' }}>
          <CardContent sx={{ padding: '0px' }}>
            <DocViewer
              key={Date.now()}
              pluginRenderers={DocViewerRenderers}
              documents={[
                {
                  uri: `${rpmApiUrls.apiUrl_RPM_Resume_FileDownload_EndPoint}?id=${id}&version=1`,
                  fileType: extension
                }
              ]}
              config={{
                header: {
                  disableHeader: true,
                  disableFileName: false,
                  retainURLParams: false
                }
              }}
            />
          </CardContent>
        </Card>
      </Box>
    </Grid>
  )
}

export default ResumePreview
