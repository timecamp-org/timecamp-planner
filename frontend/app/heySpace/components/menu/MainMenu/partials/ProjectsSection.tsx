import { FC, useEffect, useRef } from 'react';

import styled from 'styles/styled';
import { IconButton } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

import { useLocalStorage } from 'common/hooks/useLocalStorage';
import { Accordion } from 'commonComponents/Accordion/Accordion';
import Badge from 'commonComponents/Badge';
import { BadgeNotificationType } from 'commonComponents/Badge/types';
import { Plus } from 'commonComponents/Icons/fontawesome/Plus';
import { useLeftMenuUnreadsContext } from 'components/menu/LeftMenuUnreadsController/context';
import CreateGroupButton from 'components/menu/spaces/CreateGroupButton';
import SpaceGroups from 'components/menu/spaces/SpaceGroups';
import SpaceListHeader from 'components/menu/spaces/SpaceListHeader';
import SpaceNavLinkList from 'components/menu/spaces/SpaceNavLinkList';
import UngroupedSpaceNavLinks from 'components/menu/spaces/UngroupedSpaceNavLinks';
import { useTranslation } from 'i18n';
import { onOpenModal } from 'models/component/ModalsModel/actions';
import { ModalType } from 'models/component/ModalsModel/types';
import { selectAllVisibleSpacesUnreadMessagesCount } from 'models/domain/NotificationsModel/selectors';
import { selectIsCurrentUserOrganizationGuest } from 'models/domain/OrganizationsModel/selectors';

import { TextUnderlined } from './styled';

interface ProjectsSectionInterface {
  hasAccessToProjectGroups: boolean;
}

const StyledIconButton = styled(IconButton)`
  margin-left: 0.4rem;
`;

export const ProjectsSection: FC<ProjectsSectionInterface> = ({ hasAccessToProjectGroups }) => {
  const [expanded, setExpanded] = useLocalStorage('isProjectSectionExpanded', false);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const notificationCountRef = useRef(0);

  const canCurrentUserAddProject = !useSelector(selectIsCurrentUserOrganizationGuest);
  const { setOnOpenProjectsAccordion } = useLeftMenuUnreadsContext();
  const totalNotificationCount = useSelector(selectAllVisibleSpacesUnreadMessagesCount);
  notificationCountRef.current = totalNotificationCount;

  useEffect(() => {
    setOnOpenProjectsAccordion(() => {
      if (notificationCountRef.current) {
        setExpanded(true);
      }
    });
  }, [setOnOpenProjectsAccordion, setExpanded, notificationCountRef]);

  const onClick = () => dispatch(onOpenModal(ModalType.ADD_NEW_PROJECT_MODAL));
  const onChange = (isExpanded: boolean) => setExpanded(isExpanded);

  return (
    <>
      <Accordion
        expanded={expanded}
        onChange={onChange}
        header={<TextUnderlined $isUnderlined={!!totalNotificationCount}>{t('Projects')}</TextUnderlined>}
        rightIcon={
          <>
            <Badge objectType={BadgeNotificationType.STANDALONE} counter={totalNotificationCount} />
            {canCurrentUserAddProject && (
              <StyledIconButton onClick={onClick}>
                <Plus size="lg" color="var(--color-gray-900)" />
              </StyledIconButton>
            )}
          </>
        }
      >
        <>
          <SpaceListHeader />
          {hasAccessToProjectGroups ? (
            <>
              <CreateGroupButton />
              <SpaceGroups />
              <UngroupedSpaceNavLinks />
            </>
          ) : (
            <SpaceNavLinkList />
          )}
        </>
      </Accordion>
    </>
  );
};
