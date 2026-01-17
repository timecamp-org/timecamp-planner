import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';

import { doNothing } from 'common/utils';
import { List } from 'immutable';
import SecondaryButton from 'components/buttons/SecondaryButton';
import OrganizationName from 'components/organization/OrganizationName';
import WorkspaceThumbnail from 'components/settings/workspaceSettings/WorkspaceThumbnail';
import styles from './styles.css';
import { Check } from 'commonComponents/Icons/fontawesome/Check';

OrganizationSwitcher.propTypes = {
  organizationIds: ImmutablePropTypes.list.isRequired,
  currentOrganizationId: PropTypes.string.isRequired,
  onSwitchOrganization: PropTypes.func.isRequired,
};

OrganizationSwitcher.defaultProps = {
  organizationIds: new List(),
  onSwitchOrganization: doNothing,
};

function OrganizationSwitcher(props) {
  return <div className={props.className || styles.Component}>{props.organizationIds.map(renderOrganizationItem)}</div>;

  function renderOrganizationItem(organizationId) {
    return (
      <Fragment key={organizationId}>
        <SecondaryButton
          className={styles.organizationButton}
          shouldFillContentWithColor={organizationId === props.currentOrganizationId}
          onClick={() => props.onSwitchOrganization(organizationId)}
        >
          <Fragment>
            <WorkspaceThumbnail className={styles.thumbnail} organizationId={organizationId} />
            <OrganizationName className={styles.organizationName} organizationId={organizationId} />
            {organizationId === props.currentOrganizationId && <Check className={styles.tickIcon} />}
          </Fragment>
        </SecondaryButton>
      </Fragment>
    );
  }
}

export default OrganizationSwitcher;
