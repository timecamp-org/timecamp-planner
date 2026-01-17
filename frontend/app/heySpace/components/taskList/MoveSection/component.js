import React from 'react';
import styles from './styles.css';

import { ChevronUp, ChevronDown } from 'commonComponents/Icons';

import ProjectName from 'components/projects/projectName/ProjectName/withTooltip';
import UserInput from 'commonComponents/UserInput';
import SecondaryButton from 'components/buttons/SecondaryButton';
import PrimaryButton from 'components/buttons/PrimaryButton';

import Dropdown from 'commonComponents/Dropdown';

import { useTranslation } from 'i18n';

function MoveSection(props) {
  const { t } = useTranslation();
  return (
    <div className={styles.Component}>
      <div className={styles.row}>
        <div className={styles.dropdown}>
          <div className={styles.dropdownLabel}>{t('Project:')}</div>
          <Dropdown
            color={props.color}
            items={props.spaceIds}
            dropdownClassName={styles.dropdownContent}
            onSelectItem={props.onChangeSpaceId}
            buttonRenderer={renderDropdownButton}
            dropdownItemRenderer={renderDropdownItem}
          />
        </div>
        {renderPositionInput()}
      </div>
      <div className={styles.buttons}>
        <SecondaryButton color={props.color} onClick={props.onCancel}>
          {t('Cancel')}
        </SecondaryButton>
        <PrimaryButton color={props.color} onClick={props.onMoveSection}>
          {t('Move List')}
        </PrimaryButton>
      </div>
    </div>
  );

  function renderDropdownButton(isOpen) {
    return (
      <SecondaryButton className={styles.dropdownButton} onClick={props.onClickDropdownButton} color={props.color}>
        <ProjectName projectId={props.selectedSpaceId} className={styles.projectName} />
        {isOpen ? (
          <ChevronUp className={styles.dropdownButtonIcon} />
        ) : (
          <ChevronDown className={styles.dropdownButtonIcon} />
        )}
      </SecondaryButton>
    );
  }

  function renderPositionInput() {
    return (
      <UserInput
        className={styles.positionInput}
        label={t('Position:')}
        type={'number'}
        autoFocus
        value={props.selectedPosition}
        onChange={props.onChangePosition}
        onKeyDown={props.onKeyDown}
      />
    );
  }

  function renderDropdownItem(spaceId) {
    return (
      <SecondaryButton
        key={`MoveSection_${spaceId}`}
        className={styles.dropdownItem}
        onClick={() => props.onChangeSpaceId(spaceId)}
        color={props.color}
      >
        <ProjectName className={styles.projectName} projectId={spaceId} />
      </SecondaryButton>
    );
  }
}

export default MoveSection;
