// ** Type Imports
import {OwnerStateThemeType} from './index'
import {Skin} from 'template-shared/@core/layouts/types'

const Autocomplete = (skin: Skin) => {
    return {
        MuiAutocomplete: {
            styleOverrides: {
                paper: ({theme}: OwnerStateThemeType) => ({
                    ...(skin === 'bordered' && {boxShadow: 'none', border: `1px solid ${theme.palette.divider}`})
                })
            }
        }
    }
}

export default Autocomplete
