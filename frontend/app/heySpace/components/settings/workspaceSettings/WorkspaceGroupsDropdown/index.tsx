import { FC } from 'react';

import { useDispatch } from 'react-redux';

import useElementOpen from 'common/hooks/useElementOpen';
import { useSelector } from 'common/hooks/useSelector';
import { UserTracker } from 'common/services';
import { Id } from 'common/utils/identifier';

import { useTranslation } from 'i18n';
import { UserTrackerEvent } from 'models/component/UserTrackerEventModel/constants';
import { onAddUserToGroup } from 'models/domain/OrganizationGroupsModel/actions';
import { selectGroupByUserId, selectOrganizationGroups } from 'models/domain/OrganizationGroupsModel/selectors';

import UnderlinedDropdown from 'commonComponents/UnderlinedDropdown';

interface PropsInterface {
  userId: Id;
}

export const WorkspaceGroupsDropdown: FC<PropsInterface> = ({ userId }) => {
  const { t } = useTranslation();
  const availableGroups = useSelector(selectOrganizationGroups);
  const currentGroup = useSelector((state) => selectGroupByUserId(state, { userId }));
  const { isOpen, onToggleOpen, onClose } = useElementOpen(false);
  const dispatch = useDispatch();

  const onSelectGroup = (groupId: Id) => {
    dispatch(onAddUserToGroup(userId, groupId));
    UserTracker.track(UserTrackerEvent.GroupAssigned);
    onClose();
  };

  return (
    <UnderlinedDropdown
      header={t('Select title')}
      label={currentGroup?.name || 'Select title'}
      items={availableGroups.map((availableGroup) => ({
        label: availableGroup.name,
        isSelected: currentGroup?.id === availableGroup.id,
        props: {
          onClick: () => onSelectGroup(availableGroup.id),
        },
      }))}
    />
  );
};

export default WorkspaceGroupsDropdown;
