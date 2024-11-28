// ** React Imports
import {ReactNode, useContext} from 'react'

// ** Component Imports
import {AbilityContext} from './Can'

// ** Types
import {NavSectionTitle} from 'template-shared/@core/layouts/types'

interface Props {
    children: ReactNode
    navTitle?: NavSectionTitle
}

const CanViewNavSectionTitle = (props: Props) => {
    // ** Props
    const {children, navTitle} = props

    // ** Hook
    const ability = useContext(AbilityContext)

    if (navTitle && navTitle.auth === false) {
        return <>{children}</>
    } else {
        return ability && ability.can(navTitle?.action, navTitle?.subject) ? <>{children}</> : null
    }
}

export default CanViewNavSectionTitle
