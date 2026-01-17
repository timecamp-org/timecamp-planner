import { useParamsSelector } from 'common/hooks/useParamsSelector';
import { selectProjectColor } from 'models/domain/ProjectsModel/selectors';

import { AddonsRightPanelChatInterface } from '.';

interface AddonsRightPanelChatHookInterface {
  projectColor: string;
}

export function useComponent({ projectId }: AddonsRightPanelChatInterface): AddonsRightPanelChatHookInterface {
  const projectColor = useParamsSelector(selectProjectColor, { projectId });

  return {
    projectColor,
  };
}
