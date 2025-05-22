import React from 'react'
import Button from '@mui/material/Button'
import Icon from 'template-shared/@core/components/icon'

type FileHandlerProps = {
  onFileLoad: (file: File, fileType: string) => void
}

const FileHandler: React.FC<FileHandlerProps> = ({ onFileLoad }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files.length > 0) {
      const selectedFile = files[0]
      const fileType = selectedFile.type
      console.log('fileType1', fileType)
      console.log('files1', selectedFile)

      const reader = new FileReader()

      reader.onload = event => {
        if (event.target?.result) {
          onFileLoad(selectedFile, fileType) // Pass the selected file and its type
        }
      }

      reader.readAsText(selectedFile) // Read file content as text
    }
  }

  return (
    <label htmlFor='file' style={{ cursor: 'pointer', width: '100%' }}>
      <Button
        color='primary'
        variant='outlined'
        component='span'
        sx={{ width: '100%' }}
        startIcon={<Icon icon='tabler:upload' />}
      >
        Select File
      </Button>
      <input
        type='file'
        name='file'
        id='file'
        style={{ display: 'none' }} // Hide the file input
        accept='.json,.xml,.txt' // Limit accepted file types
        onChange={handleFileChange}
      />
    </label>
  )
}

export default FileHandler
