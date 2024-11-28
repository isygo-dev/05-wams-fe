// ** Next Import
import {GetStaticPaths, GetStaticProps, GetStaticPropsContext, InferGetStaticPropsType} from 'next/types'

// ** Third Party Imports
import axios from 'axios'

// ** Types
import {PricingDataType} from 'template-shared/@core/components/plan-details/types'

// ** Demo Components Imports
import AccountSettings from 'template-shared/views/pages/account-settings/AccountSettings'

const AccountSettingsTab = ({tab}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return <AccountSettings id={null} tab={tab}/>
}

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [
      {params: {tab: 'account'}},
      {params: {tab: 'security'}},
      {params: {tab: 'billing'}},
      {params: {tab: 'notifications'}},
      {params: {tab: 'connections'}}
    ],
    fallback: false
  }
}

export const getStaticProps: GetStaticProps = async ({params}: GetStaticPropsContext) => {
  const res = await axios.get('/pages/pricing')
  const data: PricingDataType = res.data

  return {
    props: {
      tab: params?.tab,
      apiPricingPlanData: data.pricingPlans
    }
  }
}

export default AccountSettingsTab
