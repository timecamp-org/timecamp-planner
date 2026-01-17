import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';

import { doNothing } from 'common/utils';
import Dropdown from 'commonComponents/Dropdown';
import { Add, ChevronDown, ChevronUp } from 'commonComponents/Icons';
import TooltipedDisabledElement from 'commonComponents/TooltipedDisabledElement';
import PrimaryButton from 'components/buttons/PrimaryButton';
import SecondaryButton from 'components/buttons/SecondaryButton';
import ProjectName from 'components/projects/projectName/ProjectName';
import ListNameOutput from 'components/taskList/ListNameOutput';
import { useTranslation } from 'i18n';

import styles from './styles.css';

AddCardWithListAndSpacePicker.propTypes = {
  spaceIds: ImmutablePropTypes.list.isRequired,
  selectedSpaceId: PropTypes.string,
  onSelectSpaceId: PropTypes.func,
  cardName: PropTypes.string,
  onChangeCardName: PropTypes.func,
  isFocused: PropTypes.bool,
  isAddCardDisabled: PropTypes.bool,
  onSetIsFocused: PropTypes.func,
  onAddCard: PropTypes.func,
  onSetInputRef: PropTypes.func,
  onKeyDown: PropTypes.func.isRequired,
};

AddCardWithListAndSpacePicker.defaultProps = {
  onSelectSpaceId: doNothing,
  cardName: '',
  onChangeCardName: doNothing,
  isFocused: false,
  isAddCardDisabled: false,
  onSetIsFocused: doNothing,
  onAddCard: doNothing,
  onSetInputRef: doNothing,
  onKeyDown: doNothing,
};

function AddCardWithListAndSpacePicker(props) {
  const { t } = useTranslation();

  if (props.isFocused) {
    return renderCaseFocused();
  } else {
    return renderCaseNotFocused();
  }

  function renderCaseNotFocused() {
    return (
      <div className={styles.notFocused} onClick={() => props.onSetIsFocused(true)}>
        <Add className={styles.addIcon} />
        {t('Add a task to other / new list')}
      </div>
    );
  }

  function renderCaseFocused() {
    return (
      <div className={styles.focused} onKeyDown={props.onKeyDown}>
        <div className={styles.content}>
          <div className={styles.row}>
            <div className={styles.dropdownLabel}>{t('Project')}</div>
            <Dropdown
              items={props.spaceIds}
              dropdownClassName={styles.dropdownContent}
              isDisabled={props.selectedSpaceId ? false : true}
              onSelectItem={props.onSelectSpaceId}
              buttonRenderer={renderSpaceDropdownButton}
              dropdownItemRenderer={renderSpaceDropdownItem}
            />
          </div>
        </div>
        <div className={styles.content}>
          <div className={styles.row}>
            <div className={styles.dropdownLabel}>{t('List')}</div>
            <Dropdown
              items={props.listIds}
              dropdownClassName={styles.dropdownContent}
              isDisabled={props.selectedListId ? false : true}
              onSelectItem={props.onSelectListId}
              buttonRenderer={renderListDropdownButton}
              dropdownItemRenderer={renderListDropdownItem}
            />
          </div>
        </div>
        <label htmlFor={'cardName'} className={styles.label}>
          {t('Task name:')}
        </label>
        <textarea
          id={'cardName'}
          rows={3}
          className={styles.textarea}
          value={props.cardName}
          onChange={props.onChangeCardName}
          placeholder={t('Task name:')}
          ref={props.onSetInputRef}
        />
        <div className={styles.buttons}>
          <SecondaryButton onClick={() => props.onSetIsFocused(false)}>{t('Cancel')}</SecondaryButton>
          <TooltipedDisabledElement
            isDisabled={props.isAddCardDisabled}
            message={t(`As a guest you have no permission to create new Project`)}
          >
            <PrimaryButton isDisabled={props.isAddCardDisabled} onClick={props.onAddCard}>
              {t('Add task')}
            </PrimaryButton>
          </TooltipedDisabledElement>
        </div>
      </div>
    );
  }

  function renderSpaceDropdownButton(isOpen) {
    const shouldBeDisabled = props.selectedSpaceId ? false : true;

    return (
      <TooltipedDisabledElement
        isDisabled={props.isAddCardDisabled}
        message={t(`As a guest you have no permission to create new Project`)}
      >
        <SecondaryButton
          className={styles.dropdownButton}
          color={props.color}
          shouldTruncateText
          isDisabled={shouldBeDisabled}
          onClick={props.onClickDropdownButton}
        >
          {shouldBeDisabled ? t('New project') : <ProjectName projectId={props.selectedSpaceId} />}
          {shouldBeDisabled ? null : isOpen ? (
            <ChevronUp className={styles.dropdownButtonIcon} />
          ) : (
            <ChevronDown className={styles.dropdownButtonIcon} />
          )}
        </SecondaryButton>
      </TooltipedDisabledElement>
    );
  }

  function renderSpaceDropdownItem(spaceId) {
    return (
      <SecondaryButton
        key={`AddCardToSpace_${spaceId}`}
        className={styles.dropdownItem}
        shouldTruncateText
        onClick={() => props.onSelectSpaceId(spaceId)}
      >
        <ProjectName projectId={spaceId} />
      </SecondaryButton>
    );
  }

  function renderListDropdownButton(isOpen) {
    const shouldBeDisabled = props.selectedListId ? false : true;

    return (
      <SecondaryButton
        className={styles.dropdownButton}
        color={props.color}
        shouldTruncateText
        isDisabled={shouldBeDisabled}
        onClick={props.onClickDropdownButton}
      >
        {shouldBeDisabled ? t('New list') : <ListNameOutput listId={props.selectedListId} />}
        {shouldBeDisabled ? null : isOpen ? (
          <ChevronUp className={styles.dropdownButtonIcon} />
        ) : (
          <ChevronDown className={styles.dropdownButtonIcon} />
        )}
      </SecondaryButton>
    );
  }

  function renderListDropdownItem(listId) {
    return (
      <SecondaryButton
        key={`AddCardToList_${listId || 'Default'}`}
        className={styles.dropdownItem}
        color={props.color}
        shouldTruncateText
        onClick={() => props.onSelectListId(listId)}
      >
        <ListNameOutput listId={listId} />
      </SecondaryButton>
    );
  }
}

export default AddCardWithListAndSpacePicker;
