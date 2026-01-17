
import { makeConversationLink } from 'common/utils/routerHelpers';
import TooltipedDisabledElement from 'commonComponents/TooltipedDisabledElement';
import TabNavButton from 'components/buttons/TabNavButton';

import { LeftPanelIconType } from '../../types';

type LeftPanelLinkProps = Pick<
  LeftPanelIconType,
  | 'to'
  | 'projectId'
  | 'conversationId'
  | 'projectColor'
  | 'projectPanelType'
  | 'isDisabled'
  | 'tabName'
  | 'disabledMessage'
  | 'currentProjectPanelType'
>;

const LeftPanelLink = (props: LeftPanelLinkProps) => {
  const { projectId, conversationId, projectPanelType, isDisabled = false, tabName, to, disabledMessage } = props;

  const link = conversationId
    ? makeConversationLink(conversationId, projectPanelType)
    : `/projects/${projectId}/${projectPanelType}`;

  const element = (
    <TabNavButton
      color={props.projectColor}
      isDisabled={isDisabled}
      isActive={props.projectPanelType === props.currentProjectPanelType}
      to={to || link}
    >
      {tabName}
    </TabNavButton>
  );

  return disabledMessage ? (
    <TooltipedDisabledElement isDisabled={isDisabled} message={disabledMessage}>
      {element}
    </TooltipedDisabledElement>
  ) : (
    element
  );
};

export default LeftPanelLink;
