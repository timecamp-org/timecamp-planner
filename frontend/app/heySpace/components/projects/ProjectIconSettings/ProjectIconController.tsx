import { FC } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { ProjectIconTypes } from 'commonComponents/ColoredProjectIcon/BaseProjectIcon';
import { onIconTypeUpdate, onProjectUpdate } from 'models/domain/ProjectsModel/actions';
import { selectProjectIconType } from 'models/domain/ProjectsModel/selectors';
import { getConditionalClass } from 'utils/getConditionalClass';

import { ProjectIconPicker } from './ProjectIconPicker';
import styles from './styles.css';

interface ProjectIconControllerInterface {
  projectId: string;
  className?: string;
  isDisabled?: boolean;
}

export const ProjectIconController: FC<ProjectIconControllerInterface> = ({ projectId, className, isDisabled }) => {
  const icon = useSelector((state) => selectProjectIconType(state, { projectId }));
  const dispatch = useDispatch();

  const onIconChange = (iconType: ProjectIconTypes) => {
    if (isDisabled) {
      return;
    }

    dispatch(onIconTypeUpdate(projectId, iconType));
  };

  const onBlur = () => {
    if (isDisabled) {
      return;
    }

    dispatch(onProjectUpdate(projectId, { iconType: icon }, true));
  };

  return (
    <ProjectIconPicker
      iconType={icon}
      onIconChange={onIconChange}
      className={`${className} ${getConditionalClass(styles.disabled, isDisabled)}`}
      onBlur={onBlur}
    />
  );
};
