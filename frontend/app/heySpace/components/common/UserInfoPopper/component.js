import React from 'react';

import { Button } from '@mui/material';
import PropTypes from 'prop-types';

import { doNothing } from 'common/utils';
import UserName from 'commonComponents/UserName';
import UserNickname from 'commonComponents/UserNickname';
import PersonIcon from 'components/person/PersonIcon';
import { i18n } from 'i18n';
import commonStyles from 'styles/common.css';

import styles from './styles.css';

const avatarSize = 16 * parseInt(commonStyles.gridCellSize, 10);

class UserInfoPopper extends React.Component {
  static propTypes = {
    userId: PropTypes.string.isRequired,
    groupName: PropTypes.string,
    shouldDisplayGoToDirectMessagesButton: PropTypes.bool,

    innerRef: PropTypes.func,
    onHide: PropTypes.func,
    onLinkClick: PropTypes.func,
  };

  static defaultProps = {
    shouldDisplayGoToDirectMessagesButton: true,
    innerRef: doNothing,
    onHide: doNothing,
    onLinkClick: doNothing,
  };

  render() {
    return (
      <div className={styles.popoverContent}>
        <PersonIcon
          className={styles.personIcon}
          wrapperClassName={styles.avatar}
          userId={this.props.userId}
          width={avatarSize}
          height={avatarSize}
        />
        <UserName className={styles.name} userId={this.props.userId} />
        <UserNickname className={styles.nickname} userId={this.props.userId} />
        {this.props.groupName && <span className={styles.group}>{this.props.groupName}</span>}
        {this.props.shouldDisplayGoToDirectMessagesButton ? (
          <div className={styles.directMessageLink} onClick={this.props.onLinkClick}>
            <Button className={styles.directMessageButton}>{i18n.t('Go to direct message')}</Button>
          </div>
        ) : null}
      </div>
    );
  }

  componentDidUpdate(prevProps, prevState, prevContext) {
    if (!prevProps.outOfBoundaries && this.props.outOfBoundaries) {
      this.props.onHide();
    }
  }
}

export default UserInfoPopper;
