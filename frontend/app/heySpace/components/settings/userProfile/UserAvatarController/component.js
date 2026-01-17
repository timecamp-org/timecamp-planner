import { Button } from '@mui/material';
import PropTypes from 'prop-types';

import { doNothing } from 'common/utils';
import DropzoneWrapper from 'commonComponents/DropzoneWrapper';
import { ChevronDown, ChevronUp, PaperClip } from 'commonComponents/Icons';
import BaseComponent from 'commonEnhancers/BaseComponent';
import PersonIcon from 'components/person/PersonIcon';
import { i18n } from 'i18n';

import styles from './styles.css';

const avatarSize = 24;

class UserAvatarController extends BaseComponent {
  static propTypes = {
    className: PropTypes.string,

    currentUserId: PropTypes.string,
    isDropdownVisible: PropTypes.bool,

    onOpenFilePrompt: PropTypes.func,
    onSetOpenCallback: PropTypes.func,
    onChooseFile: PropTypes.func,
    onInitialsSet: PropTypes.func,
    onGravatarSet: PropTypes.func,
    onSetIsDropdownVisible: PropTypes.func,
  };

  static defaultProps = {
    className: '',

    isDropdownVisible: false,

    onSetOpenCallback: doNothing,
    onOpenFilePrompt: doNothing,
    onChooseFile: doNothing,
    onInitialsSet: doNothing,
    onGravatarSet: doNothing,
    onSetIsDropdownVisible: doNothing,
  };

  render() {
    return (
      <div className={this.props.className || styles.Component}>
        <Button onClick={() => this.props.onSetIsDropdownVisible(!this.props.isDropdownVisible)}>
          {i18n.t('Update your avatar')}
          {this.props.isDropdownVisible ? (
            <ChevronUp className={styles.chevron} />
          ) : (
            <ChevronDown className={styles.chevron} />
          )}
        </Button>
        {this.props.isDropdownVisible ? this.renderAvatarOptionsDropdown() : null}
      </div>
    );
  }

  renderAvatarOptionsDropdown() {
    return (
      <div className={styles.avatarOptionsDropdown}>
        <div className={styles.option} onClick={this.props.onOpenFilePrompt}>
          <PaperClip width={14} />
          <span className={styles.optionName}>{i18n.t('Upload photo')}</span>
          <DropzoneWrapper
            noClick
            noKeyboard
            style={{ visible: 'none' }}
            onSetOpenCallback={this.props.onSetOpenCallback}
            onDrop={this.props.onChooseFile}
          />
        </div>
        <div className={styles.option} onClick={this.props.onGravatarSet}>
          <div className={styles.gravatarIcon}></div>
          <span className={styles.optionName}>{i18n.t('Import from Gravatar')}</span>
        </div>
        <div className={styles.option} onClick={this.props.onInitialsSet}>
          <PersonIcon
            userId={this.props.currentUserId}
            wrapperClassName={styles.personIcon}
            showInitialsOnly={true}
            showOnlineIndicator={false}
            width={avatarSize}
            height={avatarSize}
          />
          <span className={styles.optionName}>{i18n.t('Initials (no avatar)')}</span>
        </div>
      </div>
    );
  }

  handleClickOutside() {
    this.props.onSetIsDropdownVisible(false);
  }
}

export default UserAvatarController;
