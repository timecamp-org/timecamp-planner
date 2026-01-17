import { connect } from 'react-redux';

import BaseComponent from 'commonEnhancers/BaseComponent';
import { selectCustomFieldValue } from 'models/domain/ExtensionsModel/selectors/domain';
import { ExtensionNamespace, FieldType, TargetType } from 'models/domain/ExtensionsModel/types';
import {
  selectCurrentOrganizationName,
  selectCurrentUserInOrganizationIdByUserId,
  selectIsUserActiveInCurrentOrganization,
  selectIsUserOrganizationGuest,
} from 'models/domain/OrganizationsModel/selectors/domain';
import {
  selectConversationType,
  selectDirectChatPartner,
  selectProjectColor,
  selectProjectIdByObjectId,
  selectProjectIsPrivate,
} from 'models/domain/ProjectsModel/selectors';
import { selectProjectPeople } from 'models/domain/ProjectsModel/selectors/domain';
import { ProjectPanelType, RightPanelType } from 'models/domain/ProjectsSettingsModel/types';
import { onFetchExportedBoardCardsData } from 'models/domain/RequestModel/actions';
import { selectHasAccessToExtension } from 'models/domain/SubscriptionLimitsModel/selectors';
import { selectCurrentUserId, selectUserFullName } from 'models/domain/UsersModel/selectors/domain';

import { onOpenModal } from 'models/component/ModalsModel/actions';
import { ModalType } from 'models/component/ModalsModel/types';
import { TaskCreateSource } from 'models/domain/TasksModel/types';
import { getIsRightPanelOpened } from '../../../../chat/rightPanelChat/RightPanelChat/isRightPanelOpenedController';

const focustSectionEvent = new Event('TaskList_FocusSectionInput');

function Enhance(ComposedComponent) {
  class EnhanceProjectViewHeader extends BaseComponent {
    // eslint-disable-line react/prefer-stateless-function

    static propTypes = {};

    state = {
      isTaskSearchFocused: false,
      isSectionInputFocused: false,
    };

    render() {
      return (
        <ComposedComponent
          projectId={this.props.projectId}
          conversationId={this.props.conversationId}
          projectColor={this.props.projectColor}
          projectPeopleSize={this.props.projectPeople.size}
          projectIsPrivate={this.props.projectIsPrivate}
          conversationType={this.props.conversationType}
          isTaskSearchFocused={this.state.isTaskSearchFocused}
          isSectionInputFocused={this.state.isSectionInputFocused}
          isInternalCalendarEnabled={this.props.isInternalCalendarEnabled}
          isTimelineEnabled={this.props.isTimelineEnabled}
          isTaskListEnabled={this.props.isTaskListEnabled}
          isFileListEnabled={this.props.isFileListEnabled}
          isAbleToDeactivateUser={this.isAbleToDeactivateUser()}
          isRightActionsVisible={this.isRightActionsVisible()}
          projectPanelType={this.props.projectPanelType}
          conversationPartnerId={this.props.conversationPartnerId}
          workspaceName={this.props.workspaceName}
          fullName={this.props.fullName}
          isRightPanelActive={this.isRightPanelActive}
          onSetIsTaskSearchFocused={this.onSetIsTaskSearchFocused}
          onOpenAddCardModal={this.onOpenAddCardModal}
          onDownloadSpaceAsCSV={this.onDownloadSpaceAsCSV}
        />
      );
    }

    onDownloadSpaceAsCSV() {
      this.props.onDownloadSpaceAsCSV(this.props.projectId);
    }

    isRightActionsVisible() {
      return [
        ProjectPanelType.KANBAN,
        ProjectPanelType.CALENDAR,
        ProjectPanelType.LIST,
        ProjectPanelType.TIMELINE,
        ProjectPanelType.TIMELINE_PROJECT,
        ProjectPanelType.TIMELINE_PEOPLE,
      ].includes(this.props.projectPanelType);
    }

    isAbleToDeactivateUser() {
      return (
        this.props.inviterId === this.props.currentUserId &&
        this.props.isUserActiveInCurrentOrganization &&
        this.props.isUserOrganizationGuest
      );
    }

    onSetIsTaskSearchFocused(isTaskSearchFocused) {
      this.setState({ isTaskSearchFocused });
    }

    onOpenAddCardModal() {
      this.props.onOpenAddCardModal(this.props.projectId);
    }

    isRightPanelActive(panelName) {
      let { rightPanelType } = this.props;
      const { projectPanelType } = this.props;
      if (projectPanelType === ProjectPanelType.CHAT) {
        const isRightPanelOpened = getIsRightPanelOpened(this.props.projectId);
        if (!isRightPanelOpened) {
          return false;
        }

        rightPanelType = rightPanelType || RightPanelType.TASKS;

        return rightPanelType === panelName;
      }

      return rightPanelType === panelName;
    }
  }

  const mapStateToProps = (state, props) => {
    const currentUserId = selectCurrentUserId(state);
    const objectId = props.projectId;
    const projectId = selectProjectIdByObjectId(state, { objectId });
    const conversationPartnerId = selectDirectChatPartner(state, {
      conversationId: objectId,
    });
    const userInOrganizationId = selectCurrentUserInOrganizationIdByUserId(state, { userId: conversationPartnerId });

    return {
      projectId,
      conversationId: objectId,
      currentUserId,
      isInternalCalendarEnabled: selectHasAccessToExtension(state, {
        extensionNamespace: ExtensionNamespace.INTERNAL_CALENDAR,
      }),
      isTaskListEnabled: selectHasAccessToExtension(state, {
        extensionNamespace: ExtensionNamespace.SPACE_TASK_LIST,
      }),
      isTimelineEnabled: selectHasAccessToExtension(state, {
        extensionNamespace: ExtensionNamespace.TIMELINE,
      }),
      isFileListEnabled: selectHasAccessToExtension(state, {
        extensionNamespace: ExtensionNamespace.FILE_LIST,
      }),
      conversationPartnerId,
      isUserActiveInCurrentOrganization: selectIsUserActiveInCurrentOrganization(state, {
        userId: conversationPartnerId,
      }),
      conversationType: selectConversationType(state, {
        conversationId: objectId,
      }),
      projectPeople: selectProjectPeople(state, { projectId }),
      projectColor: selectProjectColor(state, { projectId }),
      projectIsPrivate: selectProjectIsPrivate(state, { projectId }),
      workspaceName: selectCurrentOrganizationName(state),
      fullName: selectUserFullName(state, { userId: conversationPartnerId }),
      inviterId: selectCustomFieldValue(state, {
        extensionNamespace: ExtensionNamespace.CHAT_WITH_ME,
        targetType: TargetType.USER_IN_ORGANIZATION,
        targetId: userInOrganizationId,
        fieldType: FieldType.INVITER_ID,
      }),
      isUserOrganizationGuest: selectIsUserOrganizationGuest(state, {
        userId: conversationPartnerId,
      }),
    };
  };

  const mapDispatchToProps = (dispatch, props) => ({
    onDownloadSpaceAsCSV: (projectId) => dispatch(onFetchExportedBoardCardsData(projectId)),
    onOpenAddCardModal: (projectId) =>
      dispatch(
        onOpenModal(ModalType.ADD_NEW_CARD_MODAL, {
          projectId,
          taskCreateSource: TaskCreateSource.KANBAN,
          shouldAutoAssign: true,
        })
      ),
  });

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceProjectViewHeader);
}

export default Enhance;
