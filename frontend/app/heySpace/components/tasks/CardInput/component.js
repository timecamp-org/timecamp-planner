import PropTypes from 'prop-types';

import { doNothing } from 'common/utils';
import { Plus } from 'commonComponents/Icons/fontawesome/Plus';
import PrimaryButton from 'components/buttons/PrimaryButton';
import SecondaryButton from 'components/buttons/SecondaryButton';
import { useTranslation } from 'i18n';

import { AssigneesControllerView } from 'commonComponents/AssigneesController/AssignieControllerView';
import { useDataHooksFactory } from 'commonComponents/AssigneesController/hooks/dataHooks';
import { useComponent } from 'commonComponents/AssigneesController/hooks/hook';
import { EntityType } from 'models/domain/EntityModel/types';
import { useRef } from 'react';
import styles from './styles.css';

CardInput.propTypes = {
  className: PropTypes.string,
  taskNameInputValue: PropTypes.string,
  isFocused: PropTypes.bool,
  onClick: PropTypes.func,
  onSetIsFocused: PropTypes.func,
  onChangeTaskName: PropTypes.func,
  onCancel: PropTypes.func,
};

CardInput.defaultProps = {
  taskNameInputValue: '',
  isFocused: false,
  onClick: doNothing,
  onSetIsFocused: doNothing,
  onChangeTaskName: doNothing,
  onCancel: doNothing,
};

function CardInput(props) {
  const { t } = useTranslation();

  const cardInputRef = useRef(null);
  const { useDataPersister, useDataProvider } = useDataHooksFactory(EntityType.TASK_DATA);
  const assigneesControllerViewProps = {
    objectType: EntityType.TASK_DATA,
    maxAssigneesRenderCount: 2,
    shouldRenderTitle: false,
    assigneeIds: props.assigneeIds,
    onAddAssignee: props.onAddAssigneeId,
    onRemoveAssignee: props.onRemoveAssigneeId,
    isEditable: true,
    onSetAssigneeControllerRef: props.onSetAssigneeControllerRef,
  };
  const dataPersister = useDataPersister(undefined);
  const dataProvider = useDataProvider(undefined);
  const hook = useComponent({
    ...assigneesControllerViewProps,
    dataPersister: {
      ...dataPersister,
      onAddAssignee: props.onAddAssigneeId,
      onRemoveAssignee: props.onRemoveAssigneeId,
    },
    dataProvider: {
      ...dataProvider,
      assigneeIds: props.assigneeIds,
    },
    isAssigneesPickerOpen: props.isAssigneesIdsPickerOpen,
    onSetIsPickerOpen: props.onSetIsAssigneesIdsPickerOpen,
    assigneeIds: props.assigneeIds,
  });

  return (
    <div
      ref={cardInputRef}
      className={`${props.className || styles.Component} ${props.isFocused ? styles.focused : ''}`}
      onMouseDown={() => props.onSetIsFocused(true)}
    >
      {props.isFocused ? renderCaseFocused() : renderCaseNotFocused()}
    </div>
  );

  function renderCaseNotFocused() {
    return (
      <div className={styles.notFocused}>
        <div className={styles.plusIconWrapper}>
          <Plus />
        </div>
        {t('Add a task...')}
      </div>
    );
  }

  function renderCaseFocused() {
    return (
      <div>
        <textarea
          rows={3}
          className={styles.taskNameInput}
          value={props.taskNameInputValue}
          ref={props.inputRef}
          onKeyDown={props.onKeyDown}
          onChange={props.onChangeTaskName}
          placeholder={t('Add task name...')}
          style={{ borderColor: `${props.color}` }}
        />
        <div className={styles.buttons}>
          <div className={styles.assigneesControllerViewWrapper}>
            <AssigneesControllerView
              {...assigneesControllerViewProps}
              hook={{
                ...hook,
                notAssignedUserIds: dataProvider.notAssignedUserIds
                  .filter((userId) => !props.assigneeIds.includes(userId))
                  .toList(),
              }}
              onSetAssigneeControllerRef={props.onSetAssigneeControllerRef}
            />
          </div>

          <SecondaryButton onClick={props.onCancel} color={props.color}>
            {t('Cancel')}
          </SecondaryButton>
          <PrimaryButton onClick={props.onClick} color={props.color} className={styles.createTaskButton}>
            {t('Add task')}
          </PrimaryButton>
        </div>
      </div>
    );
  }
}

export default CardInput;
