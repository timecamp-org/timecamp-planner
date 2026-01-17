import React, { memo } from 'react';
import { useDispatch } from 'react-redux';
import styles from './styles.css';
import WrappedAction from '../WrappedAction';
import { ActionType } from '../WrappedAction/constants';

import { Delete, Refresh } from 'commonComponents/Icons';
import SecondaryButton from '../../buttons/SecondaryButton';
import { onMessageResend } from '../../../../common/models/domain/MessagesModel/actions';

import * as MessagesModelActions from 'models/domain/MessagesModel/actions';

const MessageUndeliveredActionButtons: React.FC<any> = (props) => {
  const { color, messageId, objectId } = props;
  const dispatch = useDispatch();

  const handleRefresh = () => {
    dispatch(onMessageResend({ messageId, objectId }));
  };
  const handleDelete = () => {
    dispatch(MessagesModelActions.onSetMessageDeleteConfirmationVisibility(messageId, true));
  };

  return (
    <div className={styles.messageUndeliveredActionButtons}>
      <WrappedAction actionType={ActionType.RESEND_UNDELIVERED}>
        <SecondaryButton
          className={styles.customButton}
          color={color}
          buttonShadeClassName={styles.buttonShadeClassName}
          onClick={handleRefresh}
        >
          <Refresh />
        </SecondaryButton>
      </WrappedAction>
      <WrappedAction actionType={ActionType.DELETE_MESSAGE}>
        <SecondaryButton
          className={styles.customButton}
          color={color}
          buttonShadeClassName={styles.buttonShadeClassName}
          onClick={handleDelete}
        >
          <Delete />
        </SecondaryButton>
      </WrappedAction>
    </div>
  );
};

export default memo(MessageUndeliveredActionButtons);
