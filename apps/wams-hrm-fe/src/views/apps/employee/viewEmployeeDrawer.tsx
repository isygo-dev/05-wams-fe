import { Grid } from '@mui/material'
import React, { useContext, useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import hrmApiUrls from 'hrm-shared/configs/hrm_apis'
import CropperCommon from 'template-shared/@core/components/cropper'
import { EmployeeContext } from '../../../pages/apps/employee/view/[id]'
import { PersonnelInformation } from './component/PersonnelInformation'
import { useFormContext } from 'react-hook-form'
import { EmployeeType, IEnumCivility } from 'hrm-shared/@core/types/hrm/employeeTypes'
import { FamilyInformation } from './component/FamilyInformation'
import { EmergencyContact } from './component/EmergencyContact'
import LanguageChipsInput from './component/LanguageChipsInput'
import { UuidInfo } from './component/UuidInfo'
import ContractTable from './component/ContractTable'
import LockEmployeeButton from './component/LockEmployee'
import { AdministrativeInformation } from './component/AdministrativeInformation'
import HeaderCardView from 'template-shared/@core/components/card-header-view'
import ViewAdditionalFile from './component/ViewAdditionalFile'
import {
  PermissionAction,
  PermissionApplication,
  PermissionPage
} from 'template-shared/@core/types/helper/apiPermissionTypes'
import { checkPermission } from 'template-shared/@core/api/helper/permission'
import ViewStatisticByEmployee from './component/ViewStatisticByEmployee'
import PictureCard from 'template-shared/@core/components/pictureCard'
import EmployeeApis from 'hrm-shared/@core/api/hrm/employee'
import { useTranslation } from 'react-i18next'

const ViewEmployeeDrawer = ({ refetch }) => {
  const { t } = useTranslation()
  const { handleSubmit, getValues, reset } = useFormContext()

  const employee = useContext(EmployeeContext)
  const employeeData = employee.employeeData
  const queryClient = useQueryClient()
  const [photoFile, setPhotoFile] = useState<File>()
  const [updateImage, setUpdateImage] = useState<boolean>(false)

  const openImageEdit = () => {
    setUpdateImage(true)
  }

  const onSaveImage = (newImage: Blob) => {
    updatePictureMutation.mutate({ id: employeeData?.id, file: newImage })
    setPhotoFile(newImage as File)
  }

  const updatePictureMutation = useMutation({
    mutationFn: (data: { id: number; file: Blob }) => EmployeeApis(t).updateEmployeePicture(data),
    onSuccess: () => {
      setUpdateImage(false)
    }
  })

  const updateEmployeMutation = useMutation({
    mutationFn: (params: any) => EmployeeApis(t).updateEmployeeById(params),
    onSuccess: async (res: EmployeeType) => {
      const cachedEmployee: EmployeeType[] = queryClient.getQueryData('employe') || []
      const index = cachedEmployee.findIndex(obj => obj.id === res.id)
      if (index !== -1) {
        const updatedEmploye = [...cachedEmployee]
        updatedEmploye[index] = res
        queryClient.setQueryData('employe', updatedEmploye)
      }
      await refetch()
    }
  })

  const onSubmit = async (data: EmployeeType) => {
    console.log('gehjfe jhbd', data)
    const updatedData: EmployeeType = {
      ...employeeData,
      ...data,
      details: {
        ...employeeData?.details,
        ...data?.details,
        familyInformation: {
          ...employeeData.details?.familyInformation,
          ...data.details?.familyInformation
        },
        emergencyContact: Object.values(data.details?.emergencyContact || {}),
        languages: Object.values(data.details?.languages || {})
      },
      id: employeeData.id
    }
    updateEmployeMutation.mutate(updatedData)
  }

  const handleReset = () => {
    reset()
  }

  const handleSave = () => {
    onSubmit(getValues() as EmployeeType)
  }

  return (
    <>
      {checkPermission(PermissionApplication.HRM, PermissionPage.EMPLOYEE, PermissionAction.WRITE) && (
        <HeaderCardView
          title={'Employee.Employee'}
          btnSave={true}
          btnCancel={true}
          multiBtn={false}
          ITEM_HEIGHT={0}
          listItems={[]}
          handleReset={handleReset}
          handleChange={null}
          onSubmit={handleSave}
          disableCancel={false}
          disableSubmit={false}
        />
      )}
      <Grid container spacing={2}>
        <Grid item md={12} sm={12} xs={12}>
          <Grid container spacing={2}>
            <Grid item sm={12} md={2} xs={12}>
              <PictureCard
                photoFile={photoFile}
                url={`${hrmApiUrls.apiUrl_HRM_Employee_ImageDownload_EndPoint}/${employeeData?.id}`}
                openImageEdit={openImageEdit}
                permissionPage={PermissionPage.EMPLOYEE_IMAGE}
                permissionApplication={PermissionApplication.HRM}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={10}>
              <ViewStatisticByEmployee codeEmployee={employeeData.code} />
            </Grid>
          </Grid>
        </Grid>

        <Grid item md={12}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <PersonnelInformation
              disabled={false}
              checkPermissionUpdate={checkPermission(
                PermissionApplication.HRM,
                PermissionPage.EMPLOYEE,
                PermissionAction.WRITE
              )}
            />

            {(employeeData?.details?.civility === IEnumCivility.D ||
              employeeData?.details?.civility === IEnumCivility.M) && (
              <FamilyInformation
                checkPermissionUpdate={checkPermission(
                  PermissionApplication.HRM,
                  PermissionPage.EMPLOYEE,
                  PermissionAction.WRITE
                )}
              />
            )}
            <EmergencyContact
              checkPermissionUpdate={checkPermission(
                PermissionApplication.HRM,
                PermissionPage.EMPLOYEE,
                PermissionAction.WRITE
              )}
            />
            <AdministrativeInformation
              checkPermissionUpdate={checkPermission(
                PermissionApplication.HRM,
                PermissionPage.EMPLOYEE,
                PermissionAction.WRITE
              )}
            />
            <LanguageChipsInput
              checkPermissionUpdate={checkPermission(
                PermissionApplication.HRM,
                PermissionPage.EMPLOYEE,
                PermissionAction.WRITE
              )}
            />
          </form>
        </Grid>

        <Grid item md={12} xs={12} sx={{ mt: 3 }}>
          <UuidInfo employeeData={employeeData} refetch={refetch} />
          {checkPermission(PermissionApplication.HRM, PermissionPage.CONTRACT, PermissionAction.READ) && (
            <ContractTable />
          )}

          <ViewAdditionalFile
            id={employeeData.id}
            additionalFilesDetails={employeeData?.additionalFiles}
            onDataFromChild={refetch}
          />
          <LockEmployeeButton status={employeeData?.employeeStatus} employeeId={employeeData?.id} refetch={refetch} />

          <CropperCommon open={updateImage} setOpen={setUpdateImage} size={250} onSave={onSaveImage} />
        </Grid>
      </Grid>
    </>
  )
}

export default ViewEmployeeDrawer
