/* eslint-disable no-unused-expressions */
import { useDispatch, useSelector } from 'react-redux';

import ChevronDecider from 'commonComponents/ChevronDecider/ChevronDecider';
import { ButtonPopover } from 'components/buttons/ButtonPopover';
import { onOpenModal } from 'models/component/ModalsModel/actions';
import { ModalType } from 'models/component/ModalsModel/types';
import { selectHasTimecampIntegration } from 'models/domain/Timecamp/selectors';

import { TimeButton } from '../components/styled';
import styles from '../components/styles.css';

import { TaskTimePopOverContent } from './TaskTimePopoverContent';
import { TaskTimer } from './TaskTimer';

export interface TaskTimerInterface {
  taskId: string;
}

export const TimecampTimerPopoverButton = ({ taskId }: { taskId: string }) => {
  const dispatch = useDispatch();
  const hasIntegration = useSelector(selectHasTimecampIntegration);

  return (
    <ButtonPopover
      popperComponent={<TaskTimePopOverContent taskId={taskId} />}
      targetRenderer={({ isOpen, onOpen }) => (
        <TimeButton
          $isActive={isOpen}
          onClick={() => {
            hasIntegration ? onOpen() : dispatch(onOpenModal(ModalType.TIMECAMP_API_KEY_MODAL));
          }}
        >
          <TaskTimer taskId={taskId} />
          <ChevronDecider direction={isOpen ? 'up' : 'down'} />
        </TimeButton>
      )}
      popperContentWrapperClassName={styles.contentWrapper}
      shouldRenderArrow
      arrowClassName={styles.popperArrow}
    />
  );
};
