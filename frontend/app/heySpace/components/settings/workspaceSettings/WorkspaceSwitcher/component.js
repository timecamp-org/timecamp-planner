import React from 'react';
import PropTypes from 'prop-types';
import useElementOpen from 'common/hooks/useElementOpen';

import styles from './styles.css';

import WorkspaceThumbnail from 'components/settings/workspaceSettings/WorkspaceThumbnail';
import UniversalPopover from 'commonComponents/UniversalPopover';
import WorkspaceSwitcherMenu from 'components/settings/workspaceSettings/WorkspaceSwitcherMenu';
import PopoverContent from 'commonComponents/PopoverContent';

import { whiteTwoColor } from 'styles/colors.css';
import { ChevronUp } from 'commonComponents/Icons/fontawesome/ChevronUp';
import { ChevronDown } from 'commonComponents/Icons/fontawesome/ChevronDown';

WorkspaceSwitcher.propTypes = {
  className: PropTypes.string,
  workspaceName: PropTypes.string,
};

WorkspaceSwitcher.defaultProps = {
  className: '',
  workspaceName: '',
};

function WorkspaceSwitcher(props) {
  const { isOpen, onToggleOpen, onClose } = useElementOpen(false);
  return (
    <div className={props.className || styles.component}>
      <PopoverContent isVisible={isOpen} onClickOutside={onClose}>
        <UniversalPopover
          isPopoverOpened={isOpen}
          popperContentWrapperClassName={styles.popperContent}
          targetClassName={styles.buttonWrapper}
          targetComponent={renderButton(onToggleOpen, isOpen)}
          popperComponent={renderWorkspaceSwitcherMenu(onClose)}
          popperPlacement={'bottom'}
          popperModifiers={{
            offset: {
              offset: `0, 10`,
            },
          }}
        />
      </PopoverContent>
    </div>
  );

  function renderButton(onToggleOpen) {
    return (
      <>
        <div className={styles.workspaceButton} onClick={onToggleOpen}>
          <WorkspaceThumbnail organizationId={props.organizationId} className={styles.workspaceThumbnail} />
          <div className={styles.workspaceName}>{props.workspaceName}</div>
          {isOpen ? <ChevronUp className={styles.icon} /> : <ChevronDown className={styles.icon} />}
        </div>
      </>
    );
  }

  function renderWorkspaceSwitcherMenu(onClose) {
    return (
      <WorkspaceSwitcherMenu
        className={styles.workspaceSwitcherMenu}
        switcherClassName={styles.switcher}
        onClick={onClose}
      />
    );
  }
}

export default WorkspaceSwitcher;
