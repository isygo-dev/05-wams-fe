import React, { SyntheticEvent, useState } from 'react'
import dynamic from 'next/dynamic'
import 'react-quill/dist/quill.snow.css'
import Card from '@mui/material/Card'
import { IEnumLanguageType, templateDetailsDataType, TemplateType } from 'mms-shared/@core/types/mms/templateTypes'
import * as yup from 'yup'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import FormControl from '@mui/material/FormControl'
import TextField from '@mui/material/TextField'
import FormHelperText from '@mui/material/FormHelperText'
import Grid from '@mui/material/Grid'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Tab from '@mui/material/Tab'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery } from 'react-query'
import { InputLabel } from '@mui/material'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import HeaderCardView from 'template-shared/@core/components/card-header-view'
import {
  PermissionAction,
  PermissionApplication,
  PermissionPage
} from 'template-shared/@core/types/helper/apiPermissionTypes'
import { checkPermission } from 'template-shared/@core/api/helper/permission'
import MailTemplateApis from 'mms-shared/@core/api/mms/mail-template'
import { ListItemsMenuType } from 'quiz-shared/@core/types/quiz/quizTypes'

const QuillNoSSRWrapper = dynamic(() => import('react-quill'), { ssr: false })
const MailTemplateView = (templateDetailsData: templateDetailsDataType) => {
  const { t } = useTranslation()

  const defaultValues: TemplateType = {
    id: templateDetailsData.templateDetailsData.id,
    domain: templateDetailsData.templateDetailsData.domain,
    code: templateDetailsData.templateDetailsData.code,
    name: templateDetailsData.templateDetailsData.name,
    description: templateDetailsData.templateDetailsData.description,
    language: templateDetailsData.templateDetailsData.language,
    file: templateDetailsData?.file as File,
    path: ''
  }

  const schema = yup.object().shape({
    name: yup.string().required(),
    description: yup.string()
  })

  const {
    control,
    getValues,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const [templ, settempl] = useState<string>('1')

  const [templateContent, setTemplateContent] = useState('')
  const handleChange = (event: SyntheticEvent, newValue: string) => {
    settempl(newValue)
  }

  const { isLoading } = useQuery(
    [`templateContent`, templateDetailsData.id],
    () => MailTemplateApis(t).downloadMessageTemplateFile(templateDetailsData),
    {
      onSuccess: res => {
        setTemplateContent(res)
      }
    }
  )

  const mutation = useMutation({
    mutationFn: (data: TemplateType) => MailTemplateApis(t).updateMessageTemplate(data),
    onSuccess: () => {}
  })

  const onSubmit = (data: TemplateType) => {
    const blob = new Blob([templateContent], { type: 'text/plain' }) as File
    const fileName = templateDetailsData.templateDetailsData.code + '.ftl'
    const fileWithExtension = new File([blob], fileName, {
      type: 'text/plain',
      lastModified: Date.now()
    })
    data.file = fileWithExtension
    mutation.mutate(data)
  }

  const downloadtemplate = (data: TemplateType) => {
    MailTemplateApis(t).handleDownloadMessageTemplateFile(data)
  }

  const { data: templateByNames } = useQuery(`templateByNames`, () =>
    open ? MailTemplateApis(t).getMessageTemplateNames() : null
  )
  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ header: 1 }, { header: 2 }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ script: 'sub' }, { script: 'super' }],
      [{ indent: '-1' }, { indent: '+1' }],
      [{ direction: 'rtl' }],
      [{ size: ['small', false, 'large', 'huge'] }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ color: [] }, { background: [] }],
      [{ font: [] }],
      [{ align: [] }],
      ['link', 'image'],
      ['clean']
    ],
    clipboard: {
      matchVisual: false
    }
  }

  const submitData = () => {
    onSubmit(getValues())
  }

  const downloadtemp = () => {
    downloadtemplate(getValues())
  }

  const getListItems = () => {
    const newListItems: ListItemsMenuType[] = []

    if (!checkPermission(PermissionApplication.MMS, PermissionPage.MSG_TEMPLATE, PermissionAction.WRITE)) {
      newListItems.push({
        title: 'Download',
        name: 'Download'
      })
    }

    return newListItems
  }

  const handleChangeHeader = (item?: ListItemsMenuType) => {
    const itemClick = getListItems()?.find(d => d.name === item.name)
    switch (itemClick.title) {
      case 'Download':
        downloadtemp()
        break
    }
  }

  return !isLoading ? (
    <div>
      <HeaderCardView
        title={t('Template Details')}
        btnSave={checkPermission(PermissionApplication.MMS, PermissionPage.MSG_TEMPLATE, PermissionAction.WRITE)}
        btnCancel={checkPermission(PermissionApplication.MMS, PermissionPage.MSG_TEMPLATE, PermissionAction.WRITE)}
        multiBtn={getListItems()?.length > 0}
        ITEM_HEIGHT={48}
        listItems={getListItems()}
        handleReset={reset}
        handleChange={handleChangeHeader}
        onSubmit={submitData}
        disableCancel={false}
        disableSubmit={false}
      />
      <Card variant='outlined'>
        <CardContent>
          <Grid container spacing={8}>
            <Grid container item xs={12} sm={4} spacing={4}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <Controller
                    name='domain'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        size='small'
                        name='domain'
                        label={t('Domain.Domain')}
                        value={value}
                        onChange={onChange}
                        disabled
                        variant='outlined'
                      />
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <Controller
                    name='code'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        size='small'
                        name='code'
                        label={t('Code')}
                        value={value}
                        onChange={onChange}
                        disabled
                        variant='outlined'
                      />
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id='demo-simple-select-helper-label'>{t('Name')}</InputLabel>
                  <Controller
                    name='name'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <Select
                        size='small'
                        label={t('Name')}
                        name='domain'
                        defaultValue=''
                        onChange={onChange}
                        value={value}
                      >
                        {templateByNames?.map((item: string) => (
                          <MenuItem key={item} value={item}>
                            {item}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.name && <FormHelperText sx={{ color: 'error.main' }}>{errors.name.message}</FormHelperText>}
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id='demo-simple-select-helper-label'>{t('Language')}</InputLabel>
                  <Controller
                    name='language'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <Select
                        size='small'
                        label={t('language')}
                        name='language'
                        defaultValue=''
                        onChange={onChange}
                        value={value}
                      >
                        <MenuItem value=''>
                          <em>{t('None')}</em>
                        </MenuItem>
                        <MenuItem value={IEnumLanguageType.AR}>Arabic</MenuItem>
                        <MenuItem value={IEnumLanguageType.EN}>English</MenuItem>
                        <MenuItem value={IEnumLanguageType.FR}>French</MenuItem>
                        <MenuItem value={IEnumLanguageType.GE}>German</MenuItem>
                        <MenuItem value={IEnumLanguageType.IT}>Italien</MenuItem>
                      </Select>
                    )}
                  />
                  {errors.language && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.language.message}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
            </Grid>

            <Grid container item xs={12} sm={8} spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <Controller
                    name='description'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        size='small'
                        name='description'
                        label={t('Description')}
                        value={value || ''}
                        onChange={onChange}
                        multiline
                        rows={6}
                        placeholder='Description'
                        error={Boolean(errors.description)}
                        variant='outlined'
                      />
                    )}
                  />
                  {errors.description && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.description.message}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card style={{ marginTop: '16px' }}>
        <CardHeader title={t('Template content')} />
        <CardContent>
          {/* Quill editor */}
          <TabContext value={templ}>
            <TabList onChange={handleChange}>
              <Tab value='1' label={t('Text View')} />
              <Tab value='2' label={t('Html View')} />
            </TabList>
            <TabPanel value='1'>
              <Typography>
                <QuillNoSSRWrapper
                  theme='snow'
                  value={templateContent}
                  onChange={setTemplateContent}
                  modules={modules}
                  style={{ marginBottom: '16px' }}
                />
              </Typography>
            </TabPanel>
            <TabPanel value='2'>
              <Typography>
                <TextField
                  size='small'
                  fullWidth
                  multiline
                  value={templateContent}
                  onChange={e => setTemplateContent(e?.target?.value)}
                />
              </Typography>
            </TabPanel>
          </TabContext>
        </CardContent>
      </Card>
    </div>
  ) : null
}

export default MailTemplateView
