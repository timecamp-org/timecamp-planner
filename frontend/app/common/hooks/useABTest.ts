import { useSelector } from 'react-redux'
import { selectCurrentOrganizationId } from '../models/domain/OrganizationsModel/selectors/domain'
import { TestType } from '../models/component/ABTestsModel/types'
import { isTestEnabledForOrganization } from '../models/component/ABTestsModel/index'

type ABTestHookInterface = {
  isEnabled: boolean,
}

export default function useABTest(testType: TestType): ABTestHookInterface {
  const organizationId = useSelector(selectCurrentOrganizationId)
  return {
    isEnabled: isTestEnabledForOrganization(organizationId, testType)
  }
}