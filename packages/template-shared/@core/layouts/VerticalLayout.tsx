import React, {useState} from 'react'
import Fab from '@mui/material/Fab'
import {styled} from '@mui/material/styles'
import Box, {BoxProps} from '@mui/material/Box'
import Icon from '../components/icon'
import themeConfig from '../../configs/themeConfig'
import {LayoutProps} from '../layouts/types'
import AppBar from './components/vertical/appBar'
import Navigation from './components/vertical/navigation'
import Footer from './components/shared-components/footer'
import ScrollToTop from '../components/scroll-to-top'
import AppChat from '../components/common-chat/chat'
import {useQuery} from 'react-query'
import AccountApis from "ims-shared/@core/api/ims/account";
import {useTranslation} from "react-i18next";

const VerticalLayoutWrapper = styled('div')({
    height: '100%',
    display: 'flex'
})

const MainContentWrapper = styled(Box)<BoxProps>({
    flexGrow: 1,
    minWidth: 0,
    display: 'flex',
    minHeight: '100vh',
    flexDirection: 'column'
})

const ContentWrapper = styled('main')(({theme}) => ({
    flexGrow: 1,
    width: '100%',
    padding: theme.spacing(6),
    transition: 'padding .25s ease-in-out',
    [theme.breakpoints.down('sm')]: {
        paddingLeft: theme.spacing(4),
        paddingRight: theme.spacing(4)
    }
}))

const VerticalLayout = (props: LayoutProps) => {
    const {t} = useTranslation()
    const {hidden, settings, children, scrollToTop, footerProps, contentHeightFixed, verticalLayoutProps} = props
    const {skin, navHidden, contentWidth} = settings
    const navigationBorderWidth = skin === 'bordered' ? 1 : 0
    const {navigationSize, disableCustomizer, collapsedNavigationSize} = themeConfig
    const navWidth = navigationSize
    const collapsedNavWidth = collapsedNavigationSize
    const [navVisible, setNavVisible] = useState<boolean>(false)
    const {data: user, isLoading: isLoadingUser} = useQuery(`user`, () => AccountApis(t).getAccountProfile())
    const toggleNavVisibility = () => setNavVisible(!navVisible)

    return (
        <>
            <VerticalLayoutWrapper className='layout-wrapper'>
                {/* Navigation Menu */}
                {navHidden && !(navHidden && settings.lastLayout === 'horizontal') ? null : (
                    <Navigation
                        navWidth={navWidth}
                        navVisible={navVisible}
                        setNavVisible={setNavVisible}
                        collapsedNavWidth={collapsedNavWidth}
                        toggleNavVisibility={toggleNavVisibility}
                        navigationBorderWidth={navigationBorderWidth}
                        navMenuContent={verticalLayoutProps.navMenu.content}
                        navMenuBranding={verticalLayoutProps.navMenu.branding}
                        menuLockedIcon={verticalLayoutProps.navMenu.lockedIcon}
                        verticalNavItems={verticalLayoutProps.navMenu.navItems}
                        navMenuProps={verticalLayoutProps.navMenu.componentProps}
                        menuUnlockedIcon={verticalLayoutProps.navMenu.unlockedIcon}
                        afterNavMenuContent={verticalLayoutProps.navMenu.afterContent}
                        beforeNavMenuContent={verticalLayoutProps.navMenu.beforeContent}
                        {...props}
                    />
                )}
                <MainContentWrapper
                    className='layout-content-wrapper'
                    sx={{...(contentHeightFixed && {maxHeight: '100vh'})}}
                >
                    {/* AppBar Component */}
                    <AppBar
                        toggleNavVisibility={toggleNavVisibility}
                        appBarContent={verticalLayoutProps.appBar?.content}
                        appBarProps={verticalLayoutProps.appBar?.componentProps}
                        {...props}
                    />

                    {/* Content */}
                    <ContentWrapper
                        className='layout-page-content'
                        sx={{
                            ...(contentHeightFixed && {
                                overflow: 'hidden',
                                '& > :first-of-type': {height: '100%'}
                            }),
                            ...(contentWidth === 'boxed' && {
                                mx: 'auto',
                                '@media (min-width:1440px)': {maxWidth: 1440},
                                '@media (min-width:1200px)': {maxWidth: '100%'}
                            })
                        }}
                    >
                        {children}
                    </ContentWrapper>
                    {!isLoadingUser ? <AppChat user={user}/> : null}
                    {/* Footer Component */}
                    <Footer footerStyles={footerProps?.sx} footerContent={footerProps?.content} {...props} />
                </MainContentWrapper>
            </VerticalLayoutWrapper>

            {/* Customizer */}
            {disableCustomizer || hidden ? null : null /* <Customizer /> */}

            {/* Scroll to top button */}
            {scrollToTop ? (
                scrollToTop(props)
            ) : (
                <ScrollToTop className='mui-fixed'>
                    <Fab color='primary' size='small' aria-label='scroll back to top'>
                        <Icon icon='tabler:arrow-up'/>
                    </Fab>
                </ScrollToTop>
            )}
        </>
    )
}

export default VerticalLayout
