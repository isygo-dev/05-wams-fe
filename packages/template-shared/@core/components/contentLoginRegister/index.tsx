import React, { useState } from 'react'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import { useSettings } from 'template-shared/@core/hooks/useSettings'
import { useKeenSlider } from 'keen-slider/react'
import clsx from 'clsx'
import Badge from '@mui/material/Badge'
import KeenSliderWrapper from 'template-shared/@core/styles/libs/keen-slider'

const ContentLoginRegister = ({ hidden }) => {
  const theme = useTheme()
  const { settings } = useSettings()
  const { skin } = settings

  const imageSource = skin === 'bordered' ? 'auth-v2-login-illustration-bordered' : 'auth-v2-login-illustration'

  const {
    settings: { direction }
  } = useSettings()

  const [loaded, setLoaded] = useState<boolean>(false)
  const [currentSlide, setCurrentSlide] = useState<number>(0)

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>(
    {
      loop: true,
      rtl: direction === 'rtl',
      slideChanged(slider) {
        setCurrentSlide(slider.track.details.rel)
      },
      created() {
        setLoaded(true)
      }
    },
    [
      slider => {
        let mouseOver = false
        let timeout: number | ReturnType<typeof setTimeout>
        const clearNextTimeout = () => {
          clearTimeout(timeout as number)
        }
        const nextTimeout = () => {
          clearTimeout(timeout as number)
          if (mouseOver) return
          timeout = setTimeout(() => {
            slider.next()
          }, 4000)
        }
        slider.on('created', () => {
          slider.container.addEventListener('mouseover', () => {
            mouseOver = true
            clearNextTimeout()
          })
          slider.container.addEventListener('mouseout', () => {
            mouseOver = false
            nextTimeout()
          })
          nextTimeout()
        })
        slider.on('dragStarted', clearNextTimeout)
        slider.on('animationEnded', nextTimeout)
        slider.on('updated', nextTimeout)
      }
    ]
  )

  return !hidden ? (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        position: 'relative',
        alignItems: 'center',
        borderRadius: '20px',
        justifyContent: 'center',

        //backgroundColor: 'customColors.bodyBg',
        margin: 'auto',
        height: '97vh'
      }}
    >
      {/*<LoginIllustration alt='login-illustration'*/}
      {/*                   src={`/images/pages/${imageSource}-${theme.palette.mode}.png`}/>*/}
      <Box width={'100%'}>
        <KeenSliderWrapper sx={{ position: 'relative' }}>
          <Box className='navigation-wrapper'>
            <Box ref={sliderRef} className='keen-slider '>
              <Box className='keen-slider__slide' textAlign={'center'}>
                <img
                  src={`/images/pages/${imageSource}-${theme.palette.mode}-1.png`}
                  alt='swiper 1'
                  style={{ maxHeight: '92vh' }}
                />
              </Box>
              <Box className='keen-slider__slide' textAlign={'center'}>
                <img
                  src={`/images/pages/${imageSource}-${theme.palette.mode}-2.png`}
                  alt='swiper 2'
                  style={{ maxHeight: '92vh' }}
                />
              </Box>
              <Box className='keen-slider__slide' textAlign={'center'}>
                <img
                  src={`/images/pages/${imageSource}-${theme.palette.mode}-3.png`}
                  alt='swiper 3'
                  style={{ maxHeight: '92vh' }}
                />
              </Box>
            </Box>
          </Box>
          {loaded && instanceRef.current && (
            <Box className='swiper-dots' sx={{ position: 'absolute', bottom: '41px', width: '100%' }}>
              {Array.from(Array(instanceRef.current.track.details.slides.length).keys()).map(idx => (
                <Badge
                  key={idx}
                  variant='dot'
                  component='div'
                  className={clsx({
                    active: currentSlide === idx
                  })}
                  onClick={() => {
                    instanceRef.current?.moveToIdx(idx)
                  }}
                ></Badge>
              ))}
            </Box>
          )}
        </KeenSliderWrapper>
      </Box>
      {/*<FooterIllustrationsV2/>*/}
    </Box>
  ) : null
}

export default ContentLoginRegister
