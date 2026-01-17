import React from 'react';
import PropTypes from 'prop-types';
import { doNothing } from 'common/utils';

import styles from './styles.css';
import OrganizationSwitcher from 'components/menu/OrganizationSwitcher';
import HorizontalDivider from 'commonComponents/HorizontalDivider';

WorkspaceSwitcherMenu.propTypes = {
  className: PropTypes.string,
  switcherClassName: PropTypes.string,
  shouldRedirect: PropTypes.bool,
  onClick: PropTypes.func,
};

WorkspaceSwitcherMenu.defaultProps = {
  className: '',
  switcherClassName: '',
  shouldRedirect: false,
  onClick: doNothing,
};

function WorkspaceSwitcherMenu(props) {
  return (
    <div className={props.className || styles.component}>
      <OrganizationSwitcher
        className={props.switcherClassName}
        shouldRedirect={props.shouldRedirect}
        onOrganizationClick={props.onClick}
      />
      <HorizontalDivider className={styles.divider} />
    </div>
  );
}

export default WorkspaceSwitcherMenu;
