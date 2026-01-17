import { SpaceViewHeaderInterface } from './SpaceViewHeader';
import { useSelector } from 'common/hooks/useSelector';
import { selectViewSettingsContainerId } from 'models/domain/ViewSettingsModel/selectors/domain';
import { selectProjectColor, selectProjectDescription } from 'models/domain/ProjectsModel/selectors';
import { Id } from 'common/utils/identifier';
import { wisteriaColor } from 'common/commonStyles/colors';

type DataProviderHookInterface = {
  spaceId: Id;
  description: string;
  spaceColor: string;
};

export const useDataProvider = (props: SpaceViewHeaderInterface): DataProviderHookInterface => {
  const spaceId = useSelector((state) => selectViewSettingsContainerId(state, { viewId: props.viewId }));
  const description = useSelector((state) => selectProjectDescription(state, { projectId: spaceId }));
  const spaceColor = useSelector((state) => selectProjectColor(state, { projectId: spaceId })) || wisteriaColor;

  return {
    spaceId,
    description,
    spaceColor,
  };
};
