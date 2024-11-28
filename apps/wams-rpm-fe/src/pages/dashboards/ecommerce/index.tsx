// ** MUI Import
import Grid from '@mui/material/Grid'

// ** Custom Component Import
import ApexChartWrapper from 'template-shared/@core/styles/libs/react-apexcharts'

const EcommerceDashboard = () => {
  return (
    <ApexChartWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12} md={4}>
          {/*<EcommerceCongratulationsJohn/>*/}
        </Grid>
        <Grid item xs={12} md={8}>
          {/*<EcommerceTransactionsHorizontal/>*/}
        </Grid>
        <Grid item xs={12} lg={4}>
          <Grid container spacing={6}>
            <Grid item xs={6} md={3} lg={6}>
              {/*<EcommerceExpenses/>*/}
            </Grid>
            <Grid item xs={6} md={3} lg={6}>
              {/*<EcommerceProfit/>*/}
            </Grid>
            <Grid item xs={12} md={6} lg={12}>
              {/*<EcommerceGeneratedLeads/>*/}
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} lg={8}>
          {/*<EcommerceRevenueReport/>*/}
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          {/*<EcommerceEarningReports/>*/}
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          {/*<EcommercePopularProducts/>*/}
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          {/*<EcommerceOrders/>*/}
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          {/*<EcommerceTransactionsVertical/>*/}
        </Grid>
        <Grid item xs={12} lg={8}>
          {/*<EcommerceInvoiceTable/>*/}
        </Grid>
      </Grid>
    </ApexChartWrapper>
  )
}

export default EcommerceDashboard
