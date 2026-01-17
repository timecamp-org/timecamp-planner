import styled from 'styles/styled';
import { Box, SxProps } from '@mui/material';
import WorkspaceLogoController from 'components/settings/workspaceSettings/WorkspaceLogoController';
import WorkspaceNameInput from 'components/settings/workspaceSettings/WorkspaceNameInput';
import WorkspaceSettingsMembers from 'components/settings/workspaceSettings/WorkspaceSettingsMembers';
import { useTranslation } from 'i18n';

import { WorkspaceSettingsRoles } from '../WorkspaceSettingsRoles';

import { useComponent } from './hook';
import styles from './styles.css';

type WorkspaceSettingsPageInterface = {
  className: string;
};

const editorWrapperStyles: SxProps = {
  display: 'flex',
  flexDirection: 'row',
};
const listWrapperStyles: SxProps = {
  padding: '2rem',
  paddingBottom: 'unset',
  paddingLeft: 'unset',
  '& li': {
    padding: '0.2rem',
  },
};

const WorkspaceLabel = styled.span`
  padding-left: 1rem;
  font-weight: var(--fontWeight-semibold);
`;
const WorkspaceSettingsPage = (props: WorkspaceSettingsPageInterface): JSX.Element => {
  const { t } = useTranslation();
  const { userIdList, currentWorkspaceProjectsCount } = useComponent();

  return (
    <div className={props.className || styles.Component}>
      <div className={styles.settingsRow}>
        <div className={styles.settingsSection}>
          <Box sx={editorWrapperStyles}>
            <WorkspaceLogoController className={styles.workspaceLogoController} />

            <div className={styles.form}>
              <WorkspaceLabel>{t(' Workspace Name: ')}</WorkspaceLabel>
              <WorkspaceNameInput className={styles.field} innerClassName={styles.innerField} />
            </div>
          </Box>
          <Box sx={listWrapperStyles}>
            <ul>
              <li>{t('{{projectsCount}} active projects', { projectsCount: currentWorkspaceProjectsCount })}</li>
              <li>{t('{{membersCount}} active members', { membersCount: userIdList.size })}</li>
            </ul>
          </Box>
        </div>
      </div>

      <div className={styles.settingsRow}>
        <div className={styles.settingsSection}>
          <WorkspaceSettingsRoles />
        </div>
      </div>

      <div className={styles.settingsRow}>
        <div className={styles.workspaceMembersSettingsSection}>
          <WorkspaceSettingsMembers />
        </div>
      </div>
    </div>
  );
};

export default WorkspaceSettingsPage;
