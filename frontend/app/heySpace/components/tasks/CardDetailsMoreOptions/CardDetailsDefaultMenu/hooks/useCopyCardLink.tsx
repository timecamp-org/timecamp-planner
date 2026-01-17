import { makeTaskLink } from 'common/utils/routerHelpers';
import copyToClipboard from 'copy-to-clipboard';
import * as TasksModelSelectors from 'models/domain/TasksModel/selectors';
import { useSelector } from 'react-redux';
import { usePopperContext } from '../../CardDetailsPopperContext';

export const useCopyCardLink = () => {
  const { taskId, closePopper, onAction } = usePopperContext();
  const projectId = useSelector((state) =>
    TasksModelSelectors.selectProjectIdByTaskId(state, {
      taskId,
    })
  );

  return () => {
    const link = makeTaskLink({ projectId, taskId });
    const fullLink = `${window.location.protocol}//${window.location.host}${link}`;
    copyToClipboard(fullLink);
    closePopper();
    onAction();
  };
};
