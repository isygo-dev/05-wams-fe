import MailTemplateView from '../../../../../views/apps/mms-mail-template/MailTemplateView'
import { useQuery } from 'react-query'
import { useRouter } from 'next/router'
import React from 'react'
import MailTemplateApis from 'mms-shared/@core/api/mms/mail-template'
import { useTranslation } from 'react-i18next'

const TemplateViewdetail = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const { id } = router.query
  const {
    data: templateDetailsData,
    isError,
    isLoading
  } = useQuery(['templateDetailsData', id], () => MailTemplateApis(t).getMessageTemplateById(Number(id)), {})

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError || !templateDetailsData) {
    return <div>Error loading template data</div>
  }

  return <MailTemplateView templateDetailsData={templateDetailsData} file={null} id={null} />
}

export default TemplateViewdetail
