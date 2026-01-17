import PropTypes from 'prop-types';

import { doNothing } from 'common/utils';
import { Plus } from 'commonComponents/Icons/fontawesome/Plus';
import PrimaryButton from 'components/buttons/PrimaryButton';
import SecondaryButton from 'components/buttons/SecondaryButton';
import { i18n } from 'i18n';

import styles from './styles.css';

TaskSectionInput.propTypes = {
  sectionNameInputValue: PropTypes.string,
  isFocused: PropTypes.bool,
  onSectionCreate: PropTypes.func,
  onSetIsFocused: PropTypes.func,
  onChangeSectionName: PropTypes.func,
  onCancel: PropTypes.func,
};

TaskSectionInput.defaultProps = {
  sectionNameInputValue: '',
  isFocused: false,
  onSectionCreate: doNothing,
  onSetIsFocused: doNothing,
  onChangeSectionName: doNothing,
  onCancel: doNothing,
};

function TaskSectionInput(props) {
  return props.isFocused ? (
    <div className={`${styles.Component} ${styles.focused}`}>{renderCaseFocused()}</div>
  ) : (
    <div className={styles.Component} onClick={() => props.onSetIsFocused(true)}>
      {renderCaseNotFocused()}
    </div>
  );

  function renderCaseNotFocused() {
    return (
      <div className={styles.placeholder}>
        <Plus className={styles.addIcon} />
        {i18n.t('Create new list')}
      </div>
    );
  }

  function renderCaseFocused() {
    return (
      <div>
        <textarea
          rows={3}
          className={styles.sectionNameInput}
          value={props.sectionNameInputValue}
          ref={props.inputRef}
          onKeyDown={props.onKeyDown}
          onChange={props.onChangeSectionName}
          placeholder={i18n.t('Add list name...')}
        />
        <div className={styles.buttons}>
          <SecondaryButton onClick={props.onCancel} color={props.color}>
            {i18n.t('Cancel')}
          </SecondaryButton>
          <PrimaryButton
            onClick={() => props.onSectionCreate(props.sectionNameInputValue)}
            color={props.color}
            className={styles.createSectionButton}
          >
            {i18n.t('Add list')}
          </PrimaryButton>
        </div>
      </div>
    );
  }
}

export default TaskSectionInput;
