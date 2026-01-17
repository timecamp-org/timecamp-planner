import { useDispatch, useSelector } from 'react-redux';

import { Id } from 'common/utils/identifier';
import { onBackgroundUpdate } from 'models/domain/ProjectsModel/actions';
import { selectProjectBackground } from 'models/domain/ProjectsModel/selectors';

export const useProjectBackground = (projectId: Id) => {
  const dispatch = useDispatch();
  const background = useSelector((state) => selectProjectBackground(state, { projectId }));

  // eslint-disable-next-line no-shadow
  const onSetBackground = (background: string) => {
    dispatch(onBackgroundUpdate(projectId, background));
  };

  return {
    background,
    onSetBackground,
  };
};
