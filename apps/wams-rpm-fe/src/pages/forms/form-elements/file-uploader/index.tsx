// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

// ** Custom Components Imports
import PageHeader from 'template-shared/@core/components/page-header'
import CardSnippet from 'template-shared/@core/components/card-snippet'

// ** Styled Component
import DropzoneWrapper from 'template-shared/@core/styles/libs/react-dropzone'

// ** Demo Components Imports
import FileUploaderSingle from 'template-shared/views/forms/form-elements/file-uploader/FileUploaderSingle'
import FileUploaderMultiple from 'template-shared/views/forms/form-elements/file-uploader/FileUploaderMultiple'
import FileUploaderRestrictions from 'template-shared/views/forms/form-elements/file-uploader/FileUploaderRestrictions'

// ** Source code imports
import * as source from 'template-shared/views/forms/form-elements/file-uploader/FileUploaderSourceCode'

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

const FileUploader = () => {
  return (
    <DropzoneWrapper>
      <Grid container spacing={6} className='match-height'>
        <PageHeader
          title={
            <Typography variant='h5'>
              <LinkStyled href='https://github.com/react-dropzone/react-dropzone/' target='_blank'>
                React Dropzone
              </LinkStyled>
            </Typography>
          }
          subtitle={<Typography variant='body2'>Simple HTML5 drag-drop zone with React.js</Typography>}
        />
        <Grid item xs={12}>
          <CardSnippet
            title='Upload Multiple Files'
            code={{
              tsx: source.FileUploaderMultipleTSXCode,
              jsx: source.FileUploaderMultipleJSXCode
            }}
          >
            <FileUploaderMultiple />
          </CardSnippet>
        </Grid>
        <Grid item xs={12}>
          <CardSnippet
            title='Upload Single Files'
            code={{
              tsx: source.FileUploaderSingleTSXCode,
              jsx: source.FileUploaderSingleJSXCode
            }}
          >
            <FileUploaderSingle />
          </CardSnippet>
        </Grid>
        <Grid item xs={12}>
          <CardSnippet
            title='Upload Files with Restrictions'
            code={{
              tsx: source.FileUploaderRestrictionsTSXCode,
              jsx: source.FileUploaderRestrictionsJSXCode
            }}
          >
            <FileUploaderRestrictions />
          </CardSnippet>
        </Grid>
      </Grid>
    </DropzoneWrapper>
  )
}

export default FileUploader
