import { useSelector } from 'common/hooks/useSelector';
import { Id } from 'common/utils/identifier';
import { useAllowedRoleProtectedRoute } from 'hooks/routing/useRoleProtectedRoute';
import { adminRoles } from 'models/domain/OrganizationsModel/constants';
import { selectCurrentOrganizationMemberUserIdsSortedByRole } from 'models/domain/OrganizationsModel/selectors';
import { selectCurrentOrganizationId } from 'models/domain/OrganizationsModel/selectors/domain';
import { selectCurrentOrganizationNonDirectProjectsData } from 'models/domain/ProjectsModel/selectors';

type WorkspaceSettingsPageHookInterface = {
  organizationId: Id;
  userIdList: any;
  currentWorkspaceProjectsCount: number;
};

export const useComponent = (): WorkspaceSettingsPageHookInterface => {
  const organizationId = useSelector((state) => selectCurrentOrganizationId(state));
  const userIdList = useSelector((state) => selectCurrentOrganizationMemberUserIdsSortedByRole(state));

  const currentWorkspaceProjects = useSelector(selectCurrentOrganizationNonDirectProjectsData);
  const currentWorkspaceProjectsCount = currentWorkspaceProjects.toArray().length;

  useAllowedRoleProtectedRoute(adminRoles, '/settings/profile');

  return {
    organizationId,
    userIdList,
    currentWorkspaceProjectsCount,
  };
};
