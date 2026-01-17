import { useCallback } from 'react';

import PropTypes from 'prop-types';
import Textarea from 'react-textarea-autosize';

import { doNothing } from 'common/utils';
import AssigneesController from 'commonComponents/AssigneesController';
import Checkbox from 'commonComponents/Checkbox';
import { GripDotsVertical } from 'commonComponents/Icons/fontawesome/GripDotsVertical';
import TooltipedDisabledFreePlanElement from 'commonComponents/TooltipedDisabledFreePlanElement';
import ChecklistItemMoreOptions from 'components/tasks/taskCheckList/ChecklistItemMoreOptions';

import useElementOpen from '../../../../../common/hooks/useElementOpen';
import { EntityType } from '../../../../../common/models/domain/EntityModel/types';
import useOnHover from '../../../../hooks/useOnHover';

import styles from './styles.css';

ChecklistItem.propTypes = {
  color: PropTypes.string,
  taskId: PropTypes.string.isRequired,
  checklistItemId: PropTypes.string.isRequired,
  isDone: PropTypes.bool,
  text: PropTypes.string,

  onToggleStatus: PropTypes.func,
  onChangeText: PropTypes.func,
  onKeyDown: PropTypes.func,
  innerRef: PropTypes.func,
  onSetTextareaRef: PropTypes.func,
  onBlur: PropTypes.func,
};

ChecklistItem.defaultProps = {
  isDone: false,
  text: '',

  onToggleStatus: doNothing,
  onChangeText: doNothing,
  onKeyDown: doNothing,
  innerRef: doNothing,
  onSetTextareaRef: doNothing,
  onBlur: doNothing,
};

function ChecklistItem(props) {
  const { isHovering, onMouseEnter, onMouseLeave } = useOnHover(false);
  const { isOpen: isPopoverOpen, onClose, onToggleOpen: onThreeDotsClick } = useElementOpen(false);
  const shouldRenderPopoverTargetComponent = isHovering || isPopoverOpen || props.isInputFocused;

  const onClosePopover = useCallback(() => {
    onClose();
    onMouseLeave();
  }, []);

  return (
    <div className={styles.checklistItem} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <GripDotsVertical className={styles.moveIcon} />
      <Checkbox
        isChecked={props.isDone}
        color={props.color}
        onToggleStatus={props.onToggleStatus}
        className={styles.checkbox}
      />
      <Textarea
        id={`${props.checklistItemId}--text`}
        inputRef={(input) => props.innerRef(input)}
        textareaInstanceRef={props.onSetTextareaRef}
        className={styles.checklistItemText}
        value={props.text}
        onKeyDown={props.onKeyDown}
        onChange={props.onChangeText}
        onFocus={props.onFocus}
        onBlur={props.onBlur}
      />
      <TooltipedDisabledFreePlanElement>
        {(isDisabled) => (
          <AssigneesController
            className={
              shouldRenderPopoverTargetComponent ? styles.assigneesControllerHovered : styles.assigneesController
            }
            objectType={EntityType.CHECKLIST_ITEM}
            objectId={props.checklistItemId}
            shouldRenderIfNoAssignees={isHovering || props.isInputFocused}
            shouldRenderTitle={false}
            maxAssigneesRenderCount={2}
            isDisabled={isDisabled}
          />
        )}
      </TooltipedDisabledFreePlanElement>
      {shouldRenderPopoverTargetComponent && (
        <div className={styles.moreOptions}>
          <ChecklistItemMoreOptions
            isPopoverOpen={isPopoverOpen}
            taskId={props.taskId}
            checklistItemId={props.checklistItemId}
            onThreeDotsClick={onThreeDotsClick}
            onClosePopover={onClosePopover}
          />
        </div>
      )}
    </div>
  );
}

export default ChecklistItem;
