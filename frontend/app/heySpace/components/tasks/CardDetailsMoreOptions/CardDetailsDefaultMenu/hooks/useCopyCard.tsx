import * as TasksModelActions from 'models/domain/TasksModel/actions';
import * as TasksModelSelectors from 'models/domain/TasksModel/selectors';
import { ChangeEvent, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { usePopperContext } from '../../CardDetailsPopperContext';


export const useCopyCard = () => {
  const { taskId, closePopper, onAction, resetContent } = usePopperContext();
  const dispatch = useDispatch();
  const [isCopyAttachmentsChecked, setIsCopyAttachmentsChecked] = useState(true);
  const initialName = useSelector((state) => TasksModelSelectors.selectTaskName(state, {
    taskId,
  })
  );
  const [newCardNameValue, setNewCardNameValue] = useState(initialName);

  const onChangeCardName = (event: ChangeEvent<HTMLInputElement>) => {
    setNewCardNameValue(event.target.value);
  };

  const onCopyCard = () => {
    dispatch(
      TasksModelActions.onCopyCard(taskId, newCardNameValue, {
        withAttachments: isCopyAttachmentsChecked,
      })
    );
    closePopper();
    onAction();
  };

  const onKeyDownCardNameInput = (event: KeyboardEvent) => {
    switch (event.key) {
      case 'Enter': {
        onCopyCard();
        break;
      }
      case 'Escape': {
        resetContent();
        break;
      }
      default:
        break;
    }
  };

  const onToggleIsCopyAttachmentsChecked = () => {
    setIsCopyAttachmentsChecked(!isCopyAttachmentsChecked);
  };

  const onNavigateToCopyCard = (event) => {
    // onChangeContentType('copyCard');
  };

  return {
    isCopyAttachmentsChecked,
    newCardNameValue,
    onChangeCardName,
    onCopyCard,
    onKeyDownCardNameInput,
    onToggleIsCopyAttachmentsChecked,
    onNavigateToCopyCard,
  };
};
