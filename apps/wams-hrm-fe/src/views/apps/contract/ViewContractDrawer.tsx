import {Grid} from '@mui/material'
import React, {useContext} from 'react'
import {useMutation, useQuery, useQueryClient} from 'react-query'
import {useFormContext} from 'react-hook-form'
import {ContractType} from 'hrm-shared/@core/types/hrm/contractType'
import {GenericInformation} from './component/GenericInformation'
import {ContractContext} from '../../../pages/apps/contract/view/[id]'
import {PersonnelInformation} from '../employee/component/PersonnelInformation'
import {EmployeeType} from 'hrm-shared/@core/types/hrm/employeeTypes'
import HolidayInformation from './component/HolidayInformation'
import SalaryInformation from './component/SalaryInformation'
import LockContractButton from './component/LockedContract'
import ViewUploadContract from './component/ViewUploadContract'
import {useRouter} from 'next/router'
import HeaderCardView from 'template-shared/@core/components/card-header-view'
import {
  PermissionAction,
  PermissionApplication,
  PermissionPage
} from "template-shared/@core/types/helper/apiPermissionTypes";
import {checkPermission} from "template-shared/@core/api/helper/permission";
import AdvantageInformation from "./component/AdvantageInformation";
import EquipmentInformation from "./component/EquipmentInformation";
import ContrcatAmendmentInformation from "./component/ContractAmendment";
import {useTranslation} from "react-i18next";
import EmployeeApis from "hrm-shared/@core/api/hrm/employee";
import ContractApis from "hrm-shared/@core/api/hrm/contract";

const ViewContractDrawer = ({refetch}) => {
  const {t} = useTranslation()
  const {handleSubmit, getValues} = useFormContext<ContractType>()
  const Contract = useContext(ContractContext)
  const ContractData = Contract.contractData
  const queryClient = useQueryClient()
  const router = useRouter()

  const {data: employee} = useQuery<EmployeeType>(['employeeData', ContractData?.employee], () =>
    EmployeeApis(t).getEmployeeById(ContractData?.employee)
  )

  const updateContractMutation = useMutation({
    mutationFn: (params: any) => ContractApis(t).updateContractById(params, ContractData.id),
    onSuccess: async (res: ContractType) => {
      const cachedContract: ContractType[] = queryClient.getQueryData('contract') || []
      const index = cachedContract.findIndex(obj => obj.id === res.id)
      if (index !== -1) {
        const updatedContract = [...cachedContract]
        updatedContract[index] = res
        queryClient.setQueryData('contract', updatedContract)
      }
      await refetch()
    }
  })

  const toggleChangeName = (fileNew: File) => {
    ContractData.originalFileName = fileNew.name
    ContractData.file = fileNew
  }

  const onSubmit = async (data: ContractType) => {
    data.employee = ContractData.employee;
    updateContractMutation.mutate(data, {
      onSuccess: () => {
      },
      onError: () => {
      },
    });
  };

  const handleReset = () => {
    router.push('/apps/contract')
  }

  const handleSave = () => {
    onSubmit(getValues())
  }

  return (
    <Grid container direction='column' justifyContent='space-between' alignItems='stretch'>
      {checkPermission(PermissionApplication.HRM, PermissionPage.CONTRACT, PermissionAction.WRITE) &&
        <HeaderCardView
          title={'Contract.contract'}
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
        />}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid item xs={12} md={12} sm={12}>
          {employee && (
            <PersonnelInformation disabled={true}
                                  checkPermissionUpdate={checkPermission(PermissionApplication.HRM, PermissionPage.CONTRACT, PermissionAction.WRITE)}
                                  personnelData={employee}/>

          )}
          <GenericInformation
            checkPermissionUpdate={checkPermission(PermissionApplication.HRM, PermissionPage.CONTRACT, PermissionAction.WRITE)}
          />
          {checkPermission(PermissionApplication.HRM, PermissionPage.CONTRACT_VACATION, PermissionAction.READ) &&
            <HolidayInformation
              checkPermissionUpdate={checkPermission(PermissionApplication.HRM, PermissionPage.CONTRACT_VACATION, PermissionAction.WRITE)}
            />}
          {checkPermission(PermissionApplication.HRM, PermissionPage.CONTRACT, PermissionAction.READ) &&
            <SalaryInformation
              checkPermissionUpdate={checkPermission(PermissionApplication.HRM, PermissionPage.CONTRACT, PermissionAction.WRITE)}
            />}
          {checkPermission(PermissionApplication.HRM, PermissionPage.CONTRACT, PermissionAction.READ) &&
            <AdvantageInformation
              checkPermissionUpdate={checkPermission(PermissionApplication.HRM, PermissionPage.CONTRACT, PermissionAction.WRITE)}
            />}
          {checkPermission(PermissionApplication.HRM, PermissionPage.CONTRACT, PermissionAction.READ) &&

            <EquipmentInformation
              checkPermissionUpdate={checkPermission(PermissionApplication.HRM, PermissionPage.EMPLOYEE, PermissionAction.WRITE)}/>
          }
          {checkPermission(PermissionApplication.HRM, PermissionPage.CONTRACT, PermissionAction.READ) &&

            <ContrcatAmendmentInformation
              checkPermissionUpdate={checkPermission(PermissionApplication.HRM, PermissionPage.EMPLOYEE, PermissionAction.WRITE)}/>
          }
          {checkPermission(PermissionApplication.HRM, PermissionPage.CONTRACT_FILE, PermissionAction.READ) &&
            <ViewUploadContract
              checkPermissionUpdate={checkPermission(PermissionApplication.HRM, PermissionPage.CONTRACT_FILE, PermissionAction.WRITE)}
              id={ContractData?.id}
              originalFileName={ContractData?.originalFileName}
              toggleChangeName={toggleChangeName}
            />}
        </Grid>
      </form>
      <Grid item xs={12} sm={12}>
        <LockContractButton isLocked={ContractData.isLocked} contractId={ContractData.id} refetch={refetch}/>
      </Grid>
    </Grid>
  )
}

export default ViewContractDrawer
