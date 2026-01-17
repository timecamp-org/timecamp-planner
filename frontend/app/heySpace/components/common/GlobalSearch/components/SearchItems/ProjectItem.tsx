import { FC } from 'react';

import { useHistory } from 'react-router';

import { useSelector } from 'common/hooks/useSelector';
import { Id } from 'common/utils/identifier';
import ColoredProjectIcon from 'commonComponents/ColoredProjectIcon';
import { useOnCloseSearchModal } from 'commonComponents/GlobalSearch/hooks/useOnCloseSearchModal';
import { useTranslation } from 'i18n';
import { EntityStatus } from 'models/domain/EntityModel/types';
import { onMemberAdd } from 'models/domain/ProjectsModel/actions';
import { selectIsCurrentUserInProject } from 'models/domain/ProjectsModel/selectors';
import { selectProjectPeople } from 'models/domain/ProjectsModel/selectors/domain';
import { ProjectPeopleRole } from 'models/domain/ProjectsModel/types';
import { selectCurrentUserId } from 'models/domain/UsersModel/selectors/domain';
import { useDispatch } from 'react-redux';
import getSpaceUrl from 'utils/getSpaceUrl';

``;

import { ActionButton } from '../styled';

import { ItemLayout } from './ItemLayout';

export interface ProjectItemInterface {
  id: Id;
  name: string;
  description: string;
  isArchived: boolean;
  status?: EntityStatus;
}

export const ProjectItem: FC<ProjectItemInterface> = ({ id: projectId, status, name, description }) => {
  const { t } = useTranslation();
  const onCloseModal = useOnCloseSearchModal();
  const dispatch = useDispatch();
  const history = useHistory();
  const currentUserId = useSelector(selectCurrentUserId);
  const isUserInProject = useSelector((state) => selectIsCurrentUserInProject(state, { projectId }));
  const totalProjectPeople = useSelector((state) => selectProjectPeople(state, { projectId })).size;

  const onClick = () => {
    if (!isUserInProject) {
      dispatch(onMemberAdd(projectId, currentUserId, ProjectPeopleRole.MEMBER));
    }

    history.push(getSpaceUrl(projectId));
    onCloseModal();
  };

  const isArchived = status === EntityStatus.ARCHIVED;

  return (
    <ItemLayout
      isArchived={isArchived}
      img={<ColoredProjectIcon projectId={projectId} />}
      title={name}
      subtitle={`${totalProjectPeople > 1 ? `${totalProjectPeople} ${t('people')}` : ''}`}
      actionButtons={<ActionButton onClick={onClick}>{t(isUserInProject ? 'Open' : 'Join')}</ActionButton>}
    ></ItemLayout>
  );
};
