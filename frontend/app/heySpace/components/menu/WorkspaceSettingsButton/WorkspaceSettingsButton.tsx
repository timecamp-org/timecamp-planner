import { FC } from 'react';

import { Box, SxProps } from '@mui/material';
import { useSelector } from 'react-redux';

import { Gear } from 'commonComponents/Icons/fontawesome/Gear';
import NavLink from 'commonComponents/NavLink';
import { SidebarActionButton } from 'components/buttons/SidebarActionButton';
import { useTranslation } from 'i18n';
import {
  selectIsUserOrganizationAdmin,
  selectIsUserOrganizationOwner,
} from 'models/domain/OrganizationsModel/selectors/domain';
import { selectCurrentUserId } from 'models/domain/UsersModel/selectors/domain';

import { NavSidebarButtonLayout } from '../../common/Layouts/Navigation/NavSidebarButtonLayout';

const boxStyles: SxProps = {
  width: '2.1rem',
};

interface WorkSpaceSettingsButtonInterface {
  isCollapsed?: boolean;
}

export const WorkSpaceSettingsButton: FC<WorkSpaceSettingsButtonInterface> = ({ isCollapsed }) => {
  const { t } = useTranslation();
  const userId = useSelector(selectCurrentUserId);
  const isOrganizationOwner = useSelector((state) => selectIsUserOrganizationOwner(state, { userId }));
  const isAdmin = useSelector((state) => selectIsUserOrganizationAdmin(state, { userId }));

  const isVisible = isOrganizationOwner || isAdmin;

  return (
    isVisible && (
      <NavLink to="/settings/workspace">
        <SidebarActionButton isCollapsed={isCollapsed}>
          <NavSidebarButtonLayout
            icon={
              <Box sx={!isCollapsed && boxStyles}>
                <Gear />
              </Box>
            }
            text={!isCollapsed && <span> {t('Workspace settings')}</span>}
          />
        </SidebarActionButton>
      </NavLink>
    )
  );
};
