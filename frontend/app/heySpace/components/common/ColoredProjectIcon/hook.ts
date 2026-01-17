import { useSelector } from 'react-redux';

import { wisteriaColor } from '../../../../common/commonStyles/colors';
import { selectProjectColor, selectProjectIconType } from '../../../../common/models/domain/ProjectsModel/selectors';

import { ProjectIconTypes } from './BaseProjectIcon';

import { ColoredProjectIconInterface } from './index';

export type ProjectPlanetIconHookInterface = {
  color: string;
  iconType: ProjectIconTypes;
};

export function useComponent(props: ColoredProjectIconInterface): ProjectPlanetIconHookInterface {
  const { projectId } = props;
  const color = useSelector((state) => selectProjectColor(state, { projectId })) || wisteriaColor;
  const iconType = useSelector((state) => selectProjectIconType(state, { projectId }));

  return {
    color,

    iconType,
  };
}
