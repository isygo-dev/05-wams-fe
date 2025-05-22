import React, { createContext, useState } from 'react'
import { useRouter } from 'next/router'
import { useQuery } from 'react-query'
import ViewEmployeeDrawer from '../../../../views/apps/employee/viewEmployeeDrawer'
import { EmployeeType } from 'hrm-shared/@core/types/hrm/employeeTypes'
import { FormProvider, useForm } from 'react-hook-form'
import EmployeeApis from 'hrm-shared/@core/api/hrm/employee'
import { useTranslation } from 'react-i18next'

export const EmployeeContext = createContext(null)

const EmplyeView = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const { id } = router.query
  const employeeId = Array.isArray(id) ? id[0] : id
  const {
    data: employeeData,
    isError,
    isLoading,
    refetch
  } = useQuery<EmployeeType>(
    ['employeeData', employeeId],
    () => EmployeeApis(t).getEmployeeById(parseInt(employeeId)),
    {
      onSuccess: data => {
        updateEmployeeData(data)
      }
    }
  )

  const [contextData, setContextData] = useState<EmployeeType>(employeeData)
  const methods = useForm()
  const updateEmployeeData = (newData: EmployeeType) => {
    setContextData(newData)
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError || !employeeData) {
    return <div>Error loading employee data</div>
  }
  console.log(contextData)

  return (
    <EmployeeContext.Provider value={{ employeeData: contextData, updateEmployeeData }}>
      <FormProvider {...methods}>
        <ViewEmployeeDrawer refetch={refetch} />
      </FormProvider>
    </EmployeeContext.Provider>
  )
}

export default EmplyeView
