import { List } from 'immutable';
import ImmutablePropTypes from 'immutable-prop-types';
import PropTypes from 'prop-types';

import { coralPinkColor } from 'common/commonStyles/colors';
import { doNothing } from 'common/utils';
import Badge from 'commonComponents/Badge';
import { Plus } from 'commonComponents/Icons/fontawesome/Plus';
import TooltipedHoveredComponent from 'commonComponents/TooltipedHoveredComponent';
import WorkspaceThumbnail from 'components/settings/workspaceSettings/WorkspaceThumbnail';

import { BadgeNotificationType } from '../../common/Badge/types';

import styles from './styles.css';

WorkspacesPanel.propTypes = {
  className: PropTypes.string,
  currentOrganizationId: PropTypes.string.isRequired,
  organizationIds: ImmutablePropTypes.list,
  isVisible: PropTypes.bool,
  onSwitchOrganization: PropTypes.func,
  onSetIsWorkspaceModalOpen: PropTypes.func,
  getWorkspaceName: PropTypes.func,
};

WorkspacesPanel.defaultProps = {
  className: '',
  organizationIds: new List(),
  isVisible: true,
  onSwitchOrganization: doNothing,
  onSetIsWorkspaceModalOpen: doNothing,
  getWorkspaceName: doNothing,
};

function WorkspacesPanel(props) {
  return (
    <div
      className={`
      ${props.className || styles.Component}
      ${props.isVisible ? styles.visible : ''}
    `}
    >
      {props.organizationIds.map(renderOrganizationTile)}
      {renderAddWorkspaceButton()}
    </div>
  );

  function renderOrganizationTile(organizationId) {
    const isActive = props.currentOrganizationId === organizationId;

    return (
      <TooltipedHoveredComponent
        message={props.getWorkspaceName(organizationId)}
        popperPlacement={'right'}
        key={organizationId}
        offset={`0, 10`}
      >
        {(isHovered) => (
          <div
            className={isActive ? styles.activeTile : styles.tile}
            onClick={() => props.onSwitchOrganization(organizationId)}
          >
            <WorkspaceThumbnail
              organizationId={organizationId}
              className={isHovered || isActive ? styles.activeThumbnail : styles.thumbnail}
              imageClassName={styles.image}
              initialsClassName={styles.initialsClassName}
            />
            {!isActive && (
              <Badge
                objectType={BadgeNotificationType.WORKSPACE}
                className={styles.badge}
                objectId={organizationId}
                color={coralPinkColor}
                showDotOnly
              />
            )}
          </div>
        )}
      </TooltipedHoveredComponent>
    );
  }

  function renderAddWorkspaceButton() {
    return (
      <div className={styles.addWorkspaceButton} onClick={() => props.onSetIsWorkspaceModalOpen(true)}>
        <Plus />
      </div>
    );
  }
}

export default WorkspacesPanel;
