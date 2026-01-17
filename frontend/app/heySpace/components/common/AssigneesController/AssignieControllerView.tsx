import React, { ReactNode } from 'react';

import { doNothing } from 'common/utils';
import { Id } from 'common/utils/identifier';
import { AssigneesContainerEntityType } from 'commonComponents/AssigneesController/types';
import AssigneeSearch from 'commonComponents/AssigneeSearch';
import { UserPlus } from 'commonComponents/Icons/fontawesome/UserPlus';
import { Xmark } from 'commonComponents/Icons/fontawesome/Xmark';
import PopoverContent from 'commonComponents/PopoverContent';
import UniversalPopover from 'commonComponents/UniversalPopover';
import { PropertyButton } from 'components/buttons/PropertyButton';
import { useTranslation } from 'i18n';
import { TranslateFunction } from 'i18n/types';
import { getConditionalClass } from 'utils/getConditionalClass';

import SecondaryButton from '../../buttons/SecondaryButton';
import PersonIcon from '../../person/PersonIcon';
import AddUsersToProjectModal from '../../projects/AddUsersToProjectModal/component';

import { AssigneesControllerHookInterface } from './hooks/hook';
import styles from './styles.css';

const avatarSize = 16;

export type AssigneesControllerInterface = {
  objectType: AssigneesContainerEntityType;
  objectId?: Id;
  className?: string;
  closedPopperNoAssigneesClass?: string;
  color?: string;
  personIconClass?: string;
  maxAssigneesRenderCount?: number;
  isEditable?: boolean;
  variant?: 'minimized' | 'hideButtonOnAssigned';
  shouldRenderTitle?: boolean;
  shouldRenderIfNoAssignees?: boolean;
  shouldClosePopoveronSelfUnassign?: boolean;
  hideOnEmpty?: boolean;
  isDisabled?: boolean;
  avatarSize?: number;
  hook: AssigneesControllerHookInterface;
  targetTitleLabel?: ReactNode;
  poperTitleLabel?: ReactNode;
  poperInputPlaceholder?: ReactNode;
  onSetIsPopoverOpen?: (isOpen: boolean) => void;
  onSetAssigneeControllerRef?: (ref: HTMLDivElement) => void;
};

export const defaultProps = {
  maxAssigneesRenderCount: 5,
  isEditable: true,
  shouldRenderTitle: true,
  shouldRenderIfNoAssignees: true,
  avatarSize: avatarSize,
  onSetIsPopoverOpen: doNothing,
};

const AssigneesControllerView: React.FC<AssigneesControllerInterface> = (props) => {
  const { hook } = props;
  const { t } = useTranslation();
  const hasAssignees = !hook.assigneeIds.isEmpty();
  const hasClosedPopperNoAssigneeClass = !hasAssignees && !hook.isAssigneesPickerOpen;

  if (props?.hideOnEmpty && hasAssignees) {
    return null;
  }

  if (!props.shouldRenderIfNoAssignees && hook.assigneeIds.size === 0 && !hook.isAssigneesPickerOpen) {
    return null;
  }

  return (
    <div
      className={`${props.className || styles.Component} ${getConditionalClass(
        props.closedPopperNoAssigneesClass,
        hasClosedPopperNoAssigneeClass,
      )}`}
    >
      {renderPopover(props, hook, t)}
      {hook.isAddUserToProjectModalOpen && renderAddUsersToProjectModal(hook)}
    </div>
  );
};

function renderPopover(
  props: AssigneesControllerInterface,
  hook: AssigneesControllerHookInterface,
  t: TranslateFunction,
) {
  return (
    <PopoverContent isVisible={hook.isAssigneesPickerOpen} onClickOutside={hook.onCloseAssigneesPicker}>
      <UniversalPopover
        popperContentWrapperClassName={styles.popoverWrapper}
        isPopoverOpened={hook.isAssigneesPickerOpen}
        targetComponent={renderTargetComponent(props, hook)}
        popperComponent={renderPopperContent(props, hook, t)}
        popperPlacement={'bottom'}
        popperModifiers={{
          offset: {
            offset: `-16, 16`,
          },
          preventOverflow: {
            boundariesElement: 'window',
          },
        }}
      />
    </PopoverContent>
  );
}

function renderTargetComponent(props: AssigneesControllerInterface, hook: AssigneesControllerHookInterface) {
  const assigneesToRender = hook.assigneeIds.take(props.maxAssigneesRenderCount);
  const extraAssigneesNumber = Math.max(0, hook.assigneeIds.size - props.maxAssigneesRenderCount);
  const isMinimized = props.variant === 'minimized';
  const minimizedClass = getConditionalClass(styles.iconMinimized, isMinimized);

  const AssigneeList = !!assigneesToRender.size && (
    <div className={styles.assigneeList}>
      {assigneesToRender.map((assigneeId, index) => (
        <div className={index !== 0 ? styles.assigneeIconWrapper : ''} key={assigneeId}>
          <PersonIcon
            userId={assigneeId}
            wrapperClassName={` ${minimizedClass} ${props.personIconClass || styles.personIcon}`}
            width={props.avatarSize}
            height={props.avatarSize}
          />
        </div>
      ))}

      {extraAssigneesNumber > 0 && (
        <div
          className={`${styles.extraAssigneesNumber} ${minimizedClass}`}
          style={{ width: `${props.avatarSize}px`, height: `${props.avatarSize}px` }}
        >{`+${extraAssigneesNumber}`}</div>
      )}
    </div>
  );

  const shouldRenderButton = !((isMinimized || props.variant === 'hideButtonOnAssigned') && assigneesToRender.size);

  return (
    <div
      className={styles.assigneesMenu}
      onClick={hook.onControllerClick}
      onDoubleClick={() => setTimeout(() => hook.onQuickAssignButtonClick(), 0)}
    >
      {AssigneeList}
      {shouldRenderButton && (
        <PropertyButton
          isDisabled={props.isDisabled}
          isActive={hook.isAssigneesPickerOpen}
          icon={<UserPlus size={isMinimized ? 'xxs' : 'sm'} />}
          className={minimizedClass}
        ></PropertyButton>
      )}
    </div>
  );
}

function renderPopperContent(
  props: AssigneesControllerInterface,
  hook: AssigneesControllerHookInterface,
  t: TranslateFunction,
) {
  return (
    <div ref={props.onSetAssigneeControllerRef}>
      <div className={styles.header}>
        <div className={styles.headerTitle}>{props.poperTitleLabel || t('Assign users')}</div>
        <SecondaryButton color={hook.color} onClick={hook.onCloseAssigneesPicker}>
          <Xmark />
        </SecondaryButton>
      </div>

      <AssigneeSearch
        onQuickAssignButtonClick={hook.onQuickAssignButtonClick}
        isCurrentUserAssigned={hook.isCurrentUserAssigned}
        objectType={props.objectType}
        objectId={props.objectId}
        assigneeIds={hook.assigneeIds}
        notAssignedUserIds={hook.notAssignedUserIds}
        onAddAssignee={hook.onAddAssignee}
        onRemoveAssignee={hook.onRemoveAssignee}
        poperInputPlaceholder={props.poperInputPlaceholder}
      />
    </div>
  );
}

function renderAddUsersToProjectModal(hook: AssigneesControllerHookInterface) {
  return (
    <AddUsersToProjectModal
      projectId={hook.projectId}
      userIds={hook.userIds}
      color={hook.color}
      onCloseModal={hook.onCloseAddUserToProjectModal}
      onAddUsers={hook.onAddUsersToProject}
    />
  );
}

AssigneesControllerView.defaultProps = defaultProps;
export { AssigneesControllerView };
