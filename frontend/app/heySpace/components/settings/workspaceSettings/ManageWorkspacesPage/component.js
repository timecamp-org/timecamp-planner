import { Button } from '@mui/material';
import { List } from 'immutable';
import ImmutablePropTypes from 'immutable-prop-types';
import PropTypes from 'prop-types';

import useElementOpen from 'common/hooks/useElementOpen';
import { doNothing } from 'common/utils';
import { ChevronDown, ChevronUp } from 'commonComponents/Icons';
import LoadingDots from 'commonComponents/LoadingDots';
import TooltipedDisabledElement from 'commonComponents/TooltipedDisabledElement';
import SecondaryButton from 'components/buttons/SecondaryButton';
import OrganizationName from 'components/organization/OrganizationName';
import WorkspaceThumbnail from 'components/settings/workspaceSettings/WorkspaceThumbnail';
import { useTranslation } from 'i18n';
import colorStyles from 'styles/colors.css';

import WorkspaceOptions from '../WorkspaceOptions';

import styles from './styles.css';

const emptyList = new List();

ManageWorkspacesPage.propTypes = {
  existingOrganizationIds: ImmutablePropTypes.list,
  archivedOrganizationIds: ImmutablePropTypes.list,
  isLoading: PropTypes.bool,
  isUserOrganizationOwner: PropTypes.func,
  onUnarchiveWorkspace: PropTypes.func,
  onSetIsWorkspaceModalOpen: PropTypes.func,
};

ManageWorkspacesPage.defaultProps = {
  existingOrganizationIds: emptyList,
  archivedOrganizationIds: emptyList,
  isLoading: false,
  isUserOrganizationOwner: doNothing,
  onUnarchiveWorkspace: doNothing,
  onSetIsWorkspaceModalOpen: doNothing,
};

function ManageWorkspacesPage(props) {
  if (props.isLoading) {
    return renderLoadingDots();
  } else {
    return renderContent(props);
  }
}

function renderContent(props) {
  const { t } = useTranslation();

  return (
    <div className={props.className || styles.Component}>
      <div className={styles.settingsRow}>
        <div className={styles.settingsSection}>
          <Button className={styles.newWorkspaceButton} onClick={() => props.onSetIsWorkspaceModalOpen(true)}>
            {t('Add a new workspace')}
          </Button>
          {renderExistingWorkspacesPanel()}
          {renderArchivedWorkspacesPanel()}
        </div>
      </div>
    </div>
  );

  function renderExistingWorkspacesPanel() {
    const { isOpen, onToggleOpen } = useElementOpen(true);

    return (
      <>
        {props.existingOrganizationIds.isEmpty() ? null : renderSwitcher(t('Active workspaces'), isOpen, onToggleOpen)}
        {isOpen && renderExistingWorkspaces(props)}
      </>
    );
  }

  function renderArchivedWorkspacesPanel() {
    const { isOpen, onToggleOpen } = useElementOpen(false);

    return (
      <>
        {props.archivedOrganizationIds.isEmpty()
          ? null
          : renderSwitcher(t('Archived workspaces'), isOpen, onToggleOpen)}
        {isOpen && renderArchivedWorkspaces(props)}
      </>
    );
  }

  function renderExistingWorkspaces() {
    return <div className={styles.workspaceList}>{props.existingOrganizationIds.map(renderExistingWorkspace)}</div>;
  }

  function renderArchivedWorkspaces() {
    return <div className={styles.workspaceList}>{props.archivedOrganizationIds.map(renderArchivedWorkspace)}</div>;
  }

  function renderExistingWorkspace(organizationId) {
    return (
      <div key={organizationId} className={styles.workspaceRow}>
        {renderBaseRow(organizationId)}
        <div className={styles.rowRight}>
          <WorkspaceOptions organizationId={organizationId} />
        </div>
      </div>
    );
  }

  function renderArchivedWorkspace(organizationId) {
    return (
      <div key={organizationId} className={styles.workspaceRow}>
        {renderBaseRow(organizationId)}
        <div className={styles.rowRight}>{renderUnarchiveButton(props, organizationId, t)}</div>
      </div>
    );
  }
}

function renderSwitcher(title, isOpen, onToggleOpen) {
  return (
    <div className={styles.workspaceListSwitcher} onClick={onToggleOpen}>
      {isOpen ? <ChevronUp className={styles.chevronIcon} /> : <ChevronDown className={styles.chevronIcon} />}
      {title}
    </div>
  );
}

function renderBaseRow(organizationId) {
  return (
    <>
      <WorkspaceThumbnail className={styles.workspaceThumbnail} organizationId={organizationId} />
      <OrganizationName organizationId={organizationId} />
    </>
  );
}

function renderUnarchiveButton(props, organizationId, t) {
  const isEnabled = props.isUserOrganizationOwner(organizationId);

  return (
    <TooltipedDisabledElement isDisabled={!isEnabled} message={t('Only workspace owner can unarchive this workspace')}>
      <SecondaryButton isDisabled={!isEnabled} onClick={() => props.onUnarchiveWorkspace(organizationId)}>
        {t('Unarchive')}
      </SecondaryButton>
    </TooltipedDisabledElement>
  );
}

function renderLoadingDots() {
  return (
    <div className={styles.loaderWrapper}>
      <LoadingDots className={styles.loadingDots} color={colorStyles.wisteriaColor} />
    </div>
  );
}

export default ManageWorkspacesPage;
