import { makeConversationLink } from 'common/utils/routerHelpers';
import NavTab from 'commonComponents/NavTabs/NavTab';
import { ProjectPanelType } from 'models/domain/ProjectsSettingsModel/types';
import React from 'react';
import { LeftPanelIconType } from '../../types';

type ConvertLeftPanelLinksProps = {
  leftPanelLinks: Array<LeftPanelIconType>;
};

export const convertLeftPanelLinks = ({
  leftPanelLinks,
}: ConvertLeftPanelLinksProps): Array<{ Component: React.ReactNode; name: ProjectPanelType }> => {
  return leftPanelLinks.map((props, index) => {
    const {
      currentProjectPanelType,
      projectPanelType,
      projectColor,
      projectId,
      tabName,
      disabledMessage,
      isDisabled,
      name,
      to,
      conversationId,
    } = props;

    const link = conversationId
      ? makeConversationLink(conversationId, projectPanelType)
      : `/projects/${projectId}/${projectPanelType}`;

    return {
      Component: (
        <NavTab
          isDisabled={isDisabled}
          isActive={projectPanelType === currentProjectPanelType}
          projectColor={projectColor}
          to={to || link}
          tabName={tabName}
          disabledMessage={disabledMessage}
        />
      ),
      name: name || projectPanelType,
    };
  });
};
