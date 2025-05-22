import { centerCrop, Crop, makeAspectCrop, PixelCrop, ReactCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

import { ElementType, useRef, useState } from 'react'
import { useDebounceEffect } from './useDebounceEffect'
import { canvasPreview } from './canvasPreview'
import { Dialog, DialogActions, DialogContent } from '@mui/material'
import DialogTitle from '@mui/material/DialogTitle'
import Typography from '@mui/material/Typography'
import Button, { ButtonProps } from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import ButtonGroup from '@mui/material/ButtonGroup'
import Grid from '@mui/material/Grid'

type Props = {
  open: boolean
  setOpen: (val: boolean) => void
  onSave: (val: Blob) => void
  size: number
}
const ButtonStyled = styled(Button)<ButtonProps & { component?: ElementType; htmlFor?: string }>(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    textAlign: 'center'
  }
}))
const CropperCommon = (props: Props) => {
  const { open, setOpen, size, onSave } = props
  const [imgSrc, setImgSrc] = useState('')
  const previewCanvasRef = useRef<HTMLCanvasElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const hiddenAnchorRef = useRef<HTMLAnchorElement>(null)
  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>()
  const [scale, setScale] = useState(1)
  const [rotate, setRotate] = useState(0)
  const handleClose = () => setOpen(false)
  const clamp = (num: number) => Math.min(Math.max(num, 0.3), 1.5)
  const zoomIn = () => setScale(clamp(scale + 0.1))
  const zoomOut = () => setScale(clamp(scale - 0.1))

  function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined) // Makes crop preview update between images.
      const reader = new FileReader()
      reader.addEventListener('load', () => setImgSrc(reader.result?.toString() || ''))
      reader.readAsDataURL(e.target.files[0])
    }
  }

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget
    setCrop(centerAspectCrop(width, height, 1))
  }

  function uploadImage() {
    console.log('Testing upload image')
    if (!previewCanvasRef.current) {
      throw new Error('Crop canvas does not exist')
    }

    previewCanvasRef.current.toBlob(blob => {
      if (!blob) {
        throw new Error('Failed to create blob')
      }
      setRotate(0)
      setCompletedCrop(null)
      setImgSrc(''), onSave(blob)
    })
  }

  function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number) {
    return centerCrop(
      makeAspectCrop(
        {
          unit: 'px',
          width: size
        },
        aspect,
        mediaWidth,
        mediaHeight
      ),
      mediaWidth,
      mediaHeight
    )
  }

  useDebounceEffect(
    async () => {
      if (completedCrop?.width && completedCrop?.height && imgRef.current && previewCanvasRef.current) {
        // We use canvasPreview as it's much faster than imgPreview.
        canvasPreview(imgRef.current, previewCanvasRef.current, completedCrop, scale, rotate)
      }
    },
    100,
    [completedCrop, scale, rotate]
  )

  return (
    <Grid sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='customized-dialog-title'
        sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
      >
        <DialogTitle id='customized-dialog-title' sx={{ p: 4 }}>
          <Typography variant='h6' component='span'>
            Upload Image
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          <div className='App'>
            <Grid sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }} className='Crop-Controls'>
              <ButtonStyled component='label' variant='contained' htmlFor='account-settings-upload-image'>
                Upload Photo
                <input hidden type='file' accept='image/*' onChange={onSelectFile} id='account-settings-upload-image' />
              </ButtonStyled>
            </Grid>
            {!!imgSrc && (
              <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => {
                  setCrop(percentCrop)
                }}
                locked={true}
                onComplete={c => setCompletedCrop(c)}
                aspect={1}
                minHeight={20}
              >
                <img
                  ref={imgRef}
                  alt='Crop me'
                  src={imgSrc}
                  style={{ transform: `scale(${scale}) rotate(${rotate}deg)` }}
                  onLoad={onImageLoad}
                />
              </ReactCrop>
            )}
            {!!completedCrop && (
              <>
                <div>
                  <canvas
                    ref={previewCanvasRef}
                    style={{
                      border: '1px solid black',
                      objectFit: 'contain',
                      width: 0,
                      height: 0,
                      visibility: 'hidden'
                    }}
                  />
                </div>
                <div>
                  <a
                    href='#hidden'
                    ref={hiddenAnchorRef}
                    download
                    style={{
                      position: 'absolute',
                      top: '-200vh',
                      visibility: 'hidden'
                    }}
                  >
                    Hidden download
                  </a>
                </div>
                <Grid sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                  <Typography sx={{ fontWeight: 500 }}>Scale:</Typography>
                  <ButtonGroup variant='contained'>
                    <Button onClick={zoomOut}>-</Button>
                    <Button onClick={zoomIn}>+</Button>
                  </ButtonGroup>
                </Grid>
              </>
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={uploadImage}>Save changes</Button>
        </DialogActions>
      </Dialog>
    </Grid>
  )
}

export default CropperCommon
