import * as React from 'react';

import { Box, Button } from '@mui/material';

import { doNothing } from 'common/utils';
import { Id } from 'common/utils/identifier';
import { ProjectNewTaskAssigneesController } from 'commonComponents/AssigneesController/ProjectNewTaskAssigneController';
import { UnderlinedInputWrapper } from 'commonComponents/UnderlinedInputWrapper/UnderlinedInputWrapper';
import UserInput from 'commonComponents/UserInput';
import SpacesDropdown from 'components/projects/SpacesDropdown';
import ListsDropdown from 'components/taskList/ListsDropdown';
import { useTranslation } from 'i18n';
import { TranslateFunction } from 'i18n/types';
import { List } from 'immutable';
import { EntityType } from 'models/domain/EntityModel/types';
import { TaskCreateSource } from 'models/domain/TasksModel/types';

import StartAndDueDateButtonPicker from '../StartAndDueDateButtonPicker';

import useComponent, { CreateCardModalContentHookInterface } from './hook';
import styles from './styles.css';

export type CreateCardModalContentInterface = {
  projectId?: string;
  listId?: string;
  shouldAutoAssign?: boolean;
  taskCreateSource: TaskCreateSource;
  conversationWithUserId?: Id;
  newTimeOffset?: number;
  startDate?: number;
  dueDate?: number;
  initialAssignees?: List<Id>;
  onClosePopover?: VoidFunction;
};

const defaultProps: Partial<CreateCardModalContentInterface> = {
  newTimeOffset: 0,
  onClosePopover: doNothing,
};

const CreateCardModalContent: React.FC<CreateCardModalContentInterface> = (props) => {
  const { t } = useTranslation();
  const hook = useComponent(props);

  const isDatePickerOpen = hook.openedPickerType === 'DATE';
  const isAssigneesPickerOpen = hook.openedPickerType === 'USERS';

  const onSetIsDatePickerOpen = (isPickerOpen) => hook.onSetOpenedPickerType(isPickerOpen ? 'DATE' : null);
  const onSetIsAssigneesPickerOpen = (isPickerOpen) => hook.onSetOpenedPickerType(isPickerOpen ? 'USERS' : null);

  return (
    <>
      <div onKeyDown={hook.onKeyDown}>
        <UnderlinedInputWrapper>
          <UserInput
            placeholder={t('Name your task')}
            labelClassName={styles.label}
            value={hook.name}
            shouldFocusOnMount
            onChange={hook.onChangeName}
          />
        </UnderlinedInputWrapper>
        <Box className={styles.selectionSection}>
          {renderSpaceDropdown(hook, t)}
          {renderListDropdown(hook, t)}

          <div className={styles.buttonPickerSection}>
            <div className={styles.datePickerWrapper}>
              <StartAndDueDateButtonPicker
                startDate={hook.startDate}
                dueDate={hook.dueDate}
                onDateRangeChange={hook.onDateRangeChange}
                targetClassName={isDatePickerOpen ? styles.datePickerOpen : styles.datePicker}
                isPickerOpen={isDatePickerOpen}
                onSetIsPickerOpen={onSetIsDatePickerOpen}
              />
            </div>
            <ProjectNewTaskAssigneesController
              objectType={EntityType.TASK_DATA}
              projectId={props.projectId}
              onAssigneesChange={hook.onAssigneesChange}
              className={isAssigneesPickerOpen ? styles.inputGroupOpen : styles.inputGroup}
              initialAssignees={props?.initialAssignees}
              isAssigneesPickerOpen={isAssigneesPickerOpen}
              onSetIsPickerOpen={onSetIsAssigneesPickerOpen}
            />
          </div>
        </Box>
      </div>
      <div className={styles.actionButtons}>
        <Button variant="text" onClick={props.onClosePopover}>
          {t('Cancel')}
        </Button>
        <Button disabled={!hook.isCreateCardEnabled} onClick={hook.onCreateCard}>
          {t('Add Task')}
        </Button>
      </div>
    </>
  );
};

function renderSpaceDropdown(hook: CreateCardModalContentHookInterface, t: TranslateFunction) {
  return (
    <div className={styles.row}>
      <div className={styles.dropdownLabel}>{t('Project')}</div>
      <SpacesDropdown
        spaceIds={hook.spaceIds}
        selectedSpaceId={hook.selectedSpaceId}
        onSelectSpaceId={hook.onSelectSpaceId}
      />
    </div>
  );
}

function renderListDropdown(hook: CreateCardModalContentHookInterface, t: TranslateFunction) {
  return (
    <div className={styles.row}>
      <div className={styles.dropdownLabel}>{t('List')}</div>
      <ListsDropdown listIds={hook.listIds} selectedListId={hook.selectedListId} onSelectListId={hook.onSelectListId} />
    </div>
  );
}

CreateCardModalContent.defaultProps = defaultProps;

export default CreateCardModalContent;
