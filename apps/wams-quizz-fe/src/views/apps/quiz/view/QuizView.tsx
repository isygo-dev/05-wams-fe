import React, {useState} from 'react'
import Grid from '@mui/material/Grid'
import CardHeader from '@mui/material/CardHeader'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import {Controller, useForm} from 'react-hook-form'
import * as yup from 'yup'
import FormControl from '@mui/material/FormControl'
import TextField from '@mui/material/TextField'
import {Accordion, AccordionDetails, AccordionSummary, FormHelperText, InputLabel} from '@mui/material'
import {useTranslation} from 'react-i18next'
import {yupResolver} from '@hookform/resolvers/yup'
import {useMutation, useQuery} from 'react-query'
import SectionQuiz from './SectionQuiz'
import SaveIcon from '@mui/icons-material/Save'
import RefreshIcon from '@mui/icons-material/Refresh'
import IconButton from '@mui/material/IconButton'
import Icon from 'template-shared/@core/components/icon'
import Typography from '@mui/material/Typography'
import SidebarCard from './SidebarCard'
import Tooltip from '@mui/material/Tooltip'
import {MuiChipsInput} from 'mui-chips-input'
import HeaderCardView from 'template-shared/@core/components/card-header-view'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import {IEnumAnnex} from "ims-shared/@core/types/ims/annexTypes";
import AnnexApis from "ims-shared/@core/api/ims/annex";
import CommonFloatingButton from "template-shared/@core/components/floating-button/CommonFloatingButton";
import QuizApis from "quiz-shared/@core/api/quiz/quiz";
import {LevelType, ListItemsMenuType, QuizDetailType} from "quiz-shared/@core/types/quiz/quizTypes";

const QuizView = ({quizData}) => {
  console.log('quizData', quizData)
  const [originDetail, setOriginDetail] = useState<QuizDetailType>({...quizData})

  const [defaultValues, setDefaultValues] = useState<QuizDetailType>({
    id: originDetail.id,
    code: originDetail.code,
    domain: originDetail.domain,
    name: originDetail.name,
    description: originDetail.description,
    category: originDetail.category,
    sections: originDetail.sections,
    tags: originDetail.tags,
    level: originDetail.level
  })

  const {t} = useTranslation()
  const [sectionsCount, setSectionsCount] = useState<number>(defaultValues.sections?.length)
  const [images, setImages] = useState<any>()
  const actions = [
    {icon: <SaveIcon/>, name: 'Save', onClick: () => onSubmit(getValues())},
    {icon: <RefreshIcon/>, name: 'Reset', onClick: () => handleReset()}
  ]
  const {data: quizCategory} = useQuery('quizCategory', () => AnnexApis(t).getAnnexByTableCode(IEnumAnnex.QUIZ_CATEGORY))
  const schema = yup.object().shape({
    name: yup.string().required(),
    category: yup.string().required(),
    description: yup.string(),
    tags: yup.array().required(),
    domain: yup.string(),
    level: yup.string(),
    sections: yup.array().of(
      yup.object().shape({
        description: yup.number(),
        name: yup.string().required(),
        order: yup.number().required(),
        questions: yup.array().of(
          yup.object().shape({
            question: yup.string().required(),
            type: yup.string().required(),
            language: yup.string(),
            order: yup.number().required(),
            textAnswer: yup.string(),
            options: yup.array().of(
              yup.object().shape({
                option: yup.string(),
                check: yup.boolean()
              })
            )
          })
        )
      })
    )
  })

  const {
    reset,
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: {errors}
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const mutationEdit = useMutation({
    mutationFn: (data: QuizDetailType) => QuizApis(t).updateQuiz(data),
    onSuccess: res => {
      setOriginDetail(res)
      setDefaultValues(res)
      console.log('new detail', originDetail)
      console.log(res)
      console.log(images)
      images?.forEach(el => {
        const id = res.sections[el.sections].questions[el.question].id
        const formData = new FormData()
        formData.append('file', el.resource)
        const data = {
          id: id,
          file: formData
        }
        uploadQuetionImage.mutate(data)
      })
    }
  })

  const uploadQuetionImage = useMutation({
    mutationFn: (data: any) => QuizApis(t).uploadQuizQuestionImage(data),
    onSuccess: res => {
      console.log(res)
    },
    onError: err => {
      console.log(err)
    }
  })

  const onSubmit = async (data: QuizDetailType) => {
    // console.log('data data', data)
    const updatedData = {
      ...data,
      sections: data.sections
    }

    console.log('data updatedData', updatedData)

    mutationEdit.mutate(data)
  }

  const handleReset = () => {
    reset()
  }

  const handlerAddSection = () => {
    setValue('sections', [
      ...getValues('sections'),
      {
        name: '',
        order: sectionsCount + 1,
        description: '',
        questions: []
      }
    ])

    control._reset(getValues())

    setSectionsCount(sectionsCount + 1)
  }

  const handlerDeleteSection = (index: number) => {
    const newSection = getValues('sections').filter((e, i) => index != i)
    setValue('sections', newSection)
    setSectionsCount(count => Math.max(count - 1, 1))
    control._reset(getValues())
  }

  const [showSideBarCard, setShowSideBarCard] = useState<boolean>(false)

  const ITEM_HEIGHT = 48

  const handleChangeShowSidebarCard = () => {
    setShowSideBarCard(!showSideBarCard)
  }

  const handleSave = () => {
    onSubmit(getValues())
  }

  const listItems: ListItemsMenuType[] = [
    {
      title: 'Download',
      name: 'Template.Download'
    },
    {
      title: 'Share',
      name: 'Quiz.Share'
    }
  ]

  const handleChange = (item?: ListItemsMenuType) => {
    const itemClick = listItems?.find(d => d.name === item.name)
    console.log('itemClick', itemClick)
    if (itemClick.title === 'Download') {
      console.log('handleShare share')
    }
    if (itemClick.title === 'Share') {
      handleShare()
    }
  }

  const handleShare = () => {
    console.log('handleShare share')
  }

  return (
    <Grid container>
      <form onSubmit={handleSubmit(onSubmit)}>
        <HeaderCardView
          title={'Quiz.Quiz'}
          btnSave={true}
          btnCancel={true}
          multiBtn={true}
          ITEM_HEIGHT={ITEM_HEIGHT}
          listItems={listItems}
          handleReset={handleReset}
          handleChange={handleChange}
          onSubmit={handleSave}
          disableCancel={false}
          disableSubmit={false}
        />
        <Card>
          <CardContent>
            <Grid item container md={12}>
              {showSideBarCard ? (
                <Grid md={3} sx={{marginTop: '20px !important'}}>
                  <SidebarCard
                    handleChangeShowSidebarCard={handleChangeShowSidebarCard}
                    defaultValues={defaultValues}
                  />
                </Grid>
              ) : null}

              <Grid item md={showSideBarCard ? 9 : 12} className={'display-card-flex'}>
                {!showSideBarCard ? (
                  <Grid className={'sidebarQuiz'}>
                    <Card>
                      <CardHeader
                        title={
                          <Tooltip title={t('Quiz.Open_Sidebar')}>
                            <IconButton size='small' onClick={handleChangeShowSidebarCard}>
                              <Icon icon='tabler:menu-2'/>
                            </IconButton>
                          </Tooltip>
                        }
                      />
                    </Card>
                  </Grid>
                ) : null}
                <Grid>
                  <Accordion
                    defaultExpanded
                    className={'pl-4-rem'}
                    sx={{
                      margin: '20px !important',
                      boxShadow:
                        '0px 3px 9px 1px rgb(51 48 60 / 21%), 0px 8px 9px 0px rgba(51, 48, 60, 0.02), 0px 1px 6px 4px rgba(51, 48, 60, 0.01) !important'
                    }}
                  >
                    <AccordionSummary
                      id='panel-header-1'
                      aria-controls='panel-content-1'
                      expandIcon={<Icon fontSize='1.25rem' icon='tabler:chevron-down'/>}
                    >
                      <Typography variant={'h6'}>
                        <strong>{t('Quiz.Quiz_info')}</strong>
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container item md={12} spacing={3} sx={{mt: 3}}>
                        <Grid item md={2} xs={12}>
                          <FormControl fullWidth sx={{mb: 4}}>
                            <Controller
                              name='code'
                              control={control}
                              render={({field: {value}}) => (
                                <TextField disabled size='small' value={value} label={t('Code')}/>
                              )}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={5} xs={12}>
                          <FormControl fullWidth sx={{mb: 4}}>
                            <Controller
                              name='name'
                              control={control}
                              rules={{required: true}}
                              render={({field: {value, onChange}}) => (
                                <TextField
                                  size='small'
                                  value={value}
                                  label={t('Name')}
                                  onChange={onChange}
                                  error={Boolean(errors.name)}
                                />
                              )}
                            />
                            {errors.name && (
                              <FormHelperText sx={{color: 'error.main'}}>{errors.name.message}</FormHelperText>
                            )}
                          </FormControl>
                        </Grid>
                        <Grid item md={5} xs={12}>
                          <FormControl fullWidth sx={{mb: 4}}>
                            <InputLabel>{t('Category')}</InputLabel>
                            <Controller
                              name='category'
                              control={control}
                              rules={{required: true}}
                              render={({field: {value, onChange}}) => (
                                <Select
                                  size='small'
                                  label={t('Category')}
                                  value={value}
                                  onChange={onChange}
                                  error={Boolean(errors.category)}
                                >
                                  {quizCategory &&
                                    quizCategory?.map(res => (
                                      <MenuItem key={res.id} value={res.value}>
                                        {res.value}
                                      </MenuItem>
                                    ))}
                                </Select>
                              )}
                            />
                            {errors.category && (
                              <FormHelperText sx={{color: 'error.main'}}>{errors.category.message}</FormHelperText>
                            )}
                          </FormControl>
                        </Grid>
                        <Grid item sm={12}>
                          <FormControl fullWidth sx={{mb: 4}}>
                            <Controller
                              name='description'
                              control={control}
                              render={({field: {value, onChange}}) => (
                                <TextField
                                  size='small'
                                  value={value}
                                  multiline
                                  rows={3}
                                  InputProps={{readOnly: false}}
                                  label={t('Description')}
                                  onChange={onChange}
                                  error={Boolean(errors.description)}
                                />
                              )}
                            />
                            {errors.description && (
                              <FormHelperText sx={{color: 'error.main'}}>{errors.description.message}</FormHelperText>
                            )}
                          </FormControl>
                        </Grid>

                        <Grid item md={6} xs={12}>
                          <FormControl fullWidth sx={{mb: 4}}>
                            <InputLabel>{t('Level')}</InputLabel>
                            <Controller
                              name='level'
                              control={control}
                              rules={{required: false}}
                              render={({field: {value, onChange}}) => (
                                <Select size='small' value={value} onChange={onChange} label='Level'>
                                  <MenuItem value={LevelType.BEGINNER}>{t('Beginner')}</MenuItem>
                                  <MenuItem value={LevelType.INTERMEDIATE}>{t('Intermediate')}</MenuItem>
                                  <MenuItem value={LevelType.CONFIRMED}>{t('Confirmed')}</MenuItem>
                                  <MenuItem value={LevelType.EXPERT}>{t('Expert')}</MenuItem>
                                </Select>
                              )}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={6} xs={12}>
                          <FormControl fullWidth sx={{mb: 4}}>
                            <Controller
                              name='domain'
                              control={control}
                              rules={{required: true}}
                              render={({field}) => (
                                <TextField
                                  label={t('Domain.Domain')}
                                  fullWidth
                                  {...field}
                                  variant='outlined'
                                  size='small'
                                  disabled={true}
                                />
                              )}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={12} xs={12}>
                          <FormControl fullWidth sx={{mb: 4}}>
                            <Controller
                              name='tags'
                              control={control}
                              render={({field: {value, onChange}}) => (
                                <MuiChipsInput
                                  size='small'
                                  value={value}
                                  onChange={onChange}
                                  label='Tags'
                                  placeholder={'Enter Tags...'}
                                  error={Boolean(errors.tags)}
                                />
                              )}
                            />
                            {errors.tags && (
                              <FormHelperText sx={{color: 'error.main'}}>{errors.tags.message}</FormHelperText>
                            )}
                          </FormControl>
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                  <SectionQuiz
                    control={control}
                    errors={errors}
                    toggleAdd={handlerAddSection}
                    sectionsCount={sectionsCount}
                    toggleDelete={handlerDeleteSection}
                    getValues={getValues}
                    setValue={setValue}
                    setImages={setImages}
                  />
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <CommonFloatingButton actions={actions}/>
      </form>
    </Grid>
  )
}

export default QuizView
