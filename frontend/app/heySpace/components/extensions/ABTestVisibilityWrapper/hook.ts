import { isTestEnabledForOrganization, isTestEnabledForUserInOrganization } from 'models/component/ABTestsModel'
import { selectCurrentOrganizationId } from 'models/domain/OrganizationsModel/selectors/domain'
import { useSelector } from 'common/hooks/useSelector'
import { ABTestVisibilityWrapperInterface } from '.'
import { selectCurrentUserInOrganizationId } from 'models/domain/OrganizationsModel/selectors'
import { TestGranulation, TestType } from 'models/component/ABTestsModel/types'
import { Id } from 'common/utils/identifier'

export type ABTestVisibilityWrapperHookInterface = {
  isABTestEnabled: boolean,
}

export default function useComponent(props: ABTestVisibilityWrapperInterface): ABTestVisibilityWrapperHookInterface {
  const currentOrganizationId = useSelector(state => selectCurrentOrganizationId(state))
  const currentUserInOrganizationId = useSelector(state => selectCurrentUserInOrganizationId(state))

  let isABTestEnabled = checkTestInGranulation(
    currentOrganizationId,
    currentUserInOrganizationId,
    props.granulation,
    props.testType
  )

  // Check for fallback granulation
  if (!isABTestEnabled) {
    isABTestEnabled = checkTestInGranulation(
      currentOrganizationId,
      currentUserInOrganizationId,
      props.fallbackGranulation,
      props.testType
    )
  }

  return {
    isABTestEnabled
  }
}

function checkTestInGranulation(
  currentOrganizationId: Id,
  currentUserInOrganizationId: Id,
  granulation: TestGranulation,
  testType: TestType
): boolean {
  switch (granulation) {
    case TestGranulation.ORGANIZATION:
      return isTestEnabledForOrganization(currentOrganizationId, testType)
    case TestGranulation.USER_IN_ORGANIZATION:
      return isTestEnabledForUserInOrganization(currentUserInOrganizationId, testType)
    default:
      return false
  }
}