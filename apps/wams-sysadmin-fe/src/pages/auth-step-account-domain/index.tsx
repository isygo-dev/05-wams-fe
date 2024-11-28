// ** React Imports
import React, {ReactNode} from 'react'

// ** Template Imports
import BlankLayout from 'template-shared/@core/layouts/BlankLayout'
import DomainsPage from 'template-shared/views/pages/auth/email-accounts-page/UserEmailAccounts'
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import {styled} from "@mui/material/styles";
import CardContent, {CardContentProps} from "@mui/material/CardContent";

const StyledCardContent = styled(CardContent)<CardContentProps>(({theme}) => ({
  paddingTop: `${theme.spacing(10)} !important`,
  paddingBottom: `${theme.spacing(20)} !important`,
  [theme.breakpoints.up('lg')]: {
    paddingLeft: `${theme.spacing(50)} !important`,
    paddingRight: `${theme.spacing(50)} !important`
  },
  [theme.breakpoints.up('sm')]: {
    paddingLeft: `${theme.spacing(20)} `,
    paddingRight: `${theme.spacing(20)} `
  }
}))

// ** Component Definition
const Domains = () => {
  return (
    <>
      <Card sx={{background: '#F7FAFC', boxShadow: 'none'}}>
        <StyledCardContent>
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
            Select Your Account
          </Typography>
          <DomainsPage/>
        </StyledCardContent>
      </Card>
    </>)
}

// ** Layout Assignment
Domains.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

// ** Guard Assignment
Domains.guestGuard = true

// ** Export Component
export default Domains;
