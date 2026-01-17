import { ProjectPanelType, RightPanelType } from 'models/domain/ProjectsSettingsModel/types';

export type BaseHeaderProps = {
  projectId: string;
  projectPanelType: ProjectPanelType;
  projectColor: string;

  isTaskSearchFocused: boolean;
  isRightActionsVisible?: boolean;
  isTimelineEnabled?: boolean;
  isTaskListEnabled?: boolean;

  onOpenRightPanelChat: () => void;
  onSetIsTaskSearchFocused: (isTaskSearchFocused: boolean) => void;
  isRightPanelActive: (rightPanelType: RightPanelType) => boolean;
};

export type LeftPanelIconType = {
  conversationId?: string;
  projectId?: string;
  projectColor: string;
  currentProjectPanelType: string;
  projectPanelType: ProjectPanelType;
  tabName: React.ReactNode;
  isDisabled?: boolean;
  to?: string;
  disabledMessage?: string;
  itemBadge?: React.ReactNode;
  name?: ProjectPanelType;
};

export type RightPanelIconType = {
  onClick?: (args?: any) => void;
  isActive?: boolean;
  color?: string;
  to?: string;
  message?: string;
  icon?: React.ReactNode;
};

export type RightPanelIconOrComponentType = RightPanelIconType | React.FC;
