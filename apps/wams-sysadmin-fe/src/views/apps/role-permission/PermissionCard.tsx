import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import React from 'react'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import TextField from '@mui/material/TextField'
import {Icon} from '@iconify/react'
import Typography from '@mui/material/Typography'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import useUpdateProperty from 'template-shared/hooks/useUpdateProperty'
import {useFetchProperties} from 'template-shared/hooks/useFetchProperties'
import {useTranslation} from 'react-i18next'
import {checkPermission} from 'template-shared/@core/api/helper/permission'
import {
  PermissionAction,
  PermissionApplication,
  PermissionPage
} from "template-shared/@core/types/helper/apiPermissionTypes";
import {ListCheckBox, RolePermission} from "ims-shared/@core/types/ims/roleTypes";

interface Props {
  permissionList: RolePermission[]
  handleFilter: (val: string) => void
  togglePermission: (event: any, permission: RolePermission, option: string, service: string) => void
  handleSelectAllCheckbox: (event: boolean, serviceName: string) => void
  checkedPermission: ListCheckBox[]
  serviceList: string[]
}

const PermissionCard = (props: Props) => {
  const {permissionList, handleFilter, togglePermission, handleSelectAllCheckbox, checkedPermission, serviceList} =
    props
  const {data, isLoading} = useFetchProperties({key: 'Role-Permissions', guiName: 'RoleView', name: 'Permissions'})

  const {handleSaveChangeWithName} = useUpdateProperty({
    guiName: 'RoleView'
  })

  const {t} = useTranslation()
  const onCheckedAllService = (service: string) => {
    return (
      checkedPermission.filter(p => p.serviceName === service).length ===
      permissionList.filter(p => p.serviceName === service).length * 3
    )
  }

  return (
    <Grid item md={12}>
      <Box>
        <Typography variant='h6'>{t('Role.Permissions')}</Typography>
      </Box>
      <Box sx={{mt: 3}}>
        <TextField
          size='small'
          fullWidth
          sx={{mr: 4, mb: 2}}
          placeholder='Search Role'
          onChange={e => handleFilter(e.target.value)}
        />
      </Box>

      {serviceList.map((service, index) => {
        return !isLoading ? (
          <Accordion
            key={index}
            onChange={(e, expended) => handleSaveChangeWithName(expended, 'Permissions')}
            defaultExpanded={data?.value?.toLowerCase() == 'true'}
          >
            <AccordionSummary
              id={service}
              aria-controls='panel-content-1'
              sx={{marginLeft: ' 10px'}}
              expandIcon={<Icon fontSize='1.25rem' icon='tabler:chevron-down'/>}
            >
              <FormControlLabel
                label={service}
                aria-label='Acknowledge'
                control={
                  <>
                    {checkPermission(
                      PermissionApplication.IMS,
                      PermissionPage.ROLE_INFO,
                      PermissionAction.WRITE
                    ) && (
                      <Checkbox
                        id={service}
                        name={service}
                        size='small'
                        onChange={e => handleSelectAllCheckbox(e.target.checked, service)}
                        checked={onCheckedAllService(service)}
                      />
                    )}
                  </>
                }
                onClick={event => event.stopPropagation()}
                onFocus={event => event.stopPropagation()}
              />
            </AccordionSummary>

            <AccordionDetails>
              {permissionList.map((permission, index) => {
                if (permission.serviceName === service) {
                  return (
                    <Grid container item md={12} className='accordion-list' key={index}>
                      <Grid item md={6}>
                        <Typography variant='h3'></Typography> {permission.objectName}
                      </Grid>
                      <Grid item md={2}>
                        <FormControlLabel
                          label='Read'
                          control={
                            <Checkbox
                              size='small'
                              id={`${permission.serviceName + permission.objectName}-read`}
                              value={permission.read}
                              onChange={e =>
                                checkPermission(
                                  PermissionApplication.IMS,
                                  PermissionPage.ROLE_INFO,
                                  PermissionAction.WRITE
                                ) && togglePermission(e.target.checked, permission, 'read', service)
                              }
                              defaultChecked={permission.read}
                              checked={permission.read}
                            />
                          }
                        />
                      </Grid>
                      <Grid item md={2}>
                        <FormControlLabel
                          label='Write'
                          control={
                            <Checkbox
                              size='small'
                              id={`${permission.serviceName + permission.objectName}-write`}
                              value={permission.write}
                              onChange={e =>
                                checkPermission(
                                  PermissionApplication.IMS,
                                  PermissionPage.ROLE_INFO,
                                  PermissionAction.WRITE
                                ) && togglePermission(e.target.checked, permission, 'write', service)
                              }
                              defaultChecked={permission.write}
                              checked={permission.write}
                            />
                          }
                        />
                      </Grid>
                      <Grid item md={2}>
                        <FormControlLabel
                          label='Delete'
                          control={
                            <Checkbox
                              size='small'
                              id={`${permission.serviceName + permission.objectName}-delete`}
                              value={permission.delete}
                              onChange={e =>
                                checkPermission(
                                  PermissionApplication.IMS,
                                  PermissionPage.ROLE_INFO,
                                  PermissionAction.WRITE
                                ) && togglePermission(e.target.checked, permission, 'delete', service)
                              }
                              defaultChecked={permission.delete}
                              checked={permission.delete}
                            />
                          }
                        />
                      </Grid>
                    </Grid>
                  )
                }
              })}
            </AccordionDetails>
          </Accordion>
        ) : null
      })}
    </Grid>
  )
}

export default PermissionCard
