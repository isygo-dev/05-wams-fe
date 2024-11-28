// ** Next Imports
import {GetStaticProps, InferGetStaticPropsType} from 'next/types'

import Card from '@mui/material/Card'
import {styled} from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CardContent, {CardContentProps} from '@mui/material/CardContent'

// ** Third Party Imports
import axios from 'axios'

// ** Types
// ** Demo Imports
import AllowedToolsOverview from 'template-shared/views/pages/auth/allowed-tools-page/landing/AllowedToolsOverview'
import {useTranslation} from 'react-i18next'
import {HelpCenterArticlesOverviewType, HelpCenterCategoriesType} from 'template-shared/@fake-db/types'

type ApiDataType = {
  categories: HelpCenterCategoriesType[]
  keepLearning: HelpCenterArticlesOverviewType[]
  popularArticles: HelpCenterArticlesOverviewType[]
}

const StyledCardContent = styled(CardContent)<CardContentProps>(({theme}) => ({
  paddingTop: `${theme.spacing(10)} !important`,
  paddingBottom: `${theme.spacing(20)} !important`,
  [theme.breakpoints.up('lg')]: {
    paddingLeft: `${theme.spacing(15)} !important`,
    paddingRight: `${theme.spacing(15)} !important`
  },
  [theme.breakpoints.up('sm')]: {
    paddingLeft: `${theme.spacing(20)} `,
    paddingRight: `${theme.spacing(20)} `
  }
}))

const AllowedTools = ({apiData}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const {t} = useTranslation()

  return (
    <Card sx={{background: '#F7FAFC', boxShadow: 'none'}}>
      {apiData !== null ? (
        <>
          <StyledCardContent>
            <Typography sx={{marginBottom: '3rem', fontWeight: 500, textAlign: 'left', fontSize: '1.625rem'}}>
              {t('Welcome to your space')}
            </Typography>
            <Typography
              sx={{
                mb: 6,
                mt: 6,
                fontWeight: 500,
                textAlign: 'left',
                fontSize: '1.625rem',
                lineHeight: 1.385
              }}
            >
              {t('Allowed Tools')}
            </Typography>
            <AllowedToolsOverview/>
          </StyledCardContent>
          {/*<StyledCardContent sx={{backgroundColor: 'action.hover'}}>*/}
          {/*  <Typography sx={{marginBottom: '2rem', fontWeight: 500, textAlign: 'left', fontSize: '1.625rem'}}>*/}
          {/*    {t('shortcut')}*/}
          {/*  </Typography>*/}
          {/*  <HelpCenterLandingKnowledgeBase categories={apiData.categories}/>*/}
          {/*</StyledCardContent>*/}
          {/*<StyledCardContent>*/}
          {/*    <Typography*/}
          {/*        sx={{mb: 6, fontWeight: 500, textAlign: 'center', fontSize: '1.625rem', lineHeight: 1.385}}>*/}
          {/*        {t('Keep Learning')}*/}
          {/*    </Typography>*/}
          {/*    <HelpCenterLandingArticlesOverview articles={apiData.keepLearning}/>*/}
          {/*</StyledCardContent>*/}
          {/*<HelpCenterLandingHeader data={apiData.categories} allArticles={apiData.allArticles}/>*/}
        </>
      ) : null}
    </Card>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const res = await axios.get('/pages/help-center/landing')
  const apiData: ApiDataType = res.data

  return {
    props: {
      apiData
    }
  }
}

export default AllowedTools
