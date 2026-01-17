import React from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import PureBaseComponent from 'commonEnhancers/PureBaseComponent';
import EnhanceWithRouter from 'enhancers/EnhanceWithRouter';
import * as AppModelActions from 'models/domain/AppModel/actions';
import { selectIsExtensionEnabled } from 'models/domain/ExtensionsModel/selectors/domain';
import { ExtensionNamespace } from 'models/domain/ExtensionsModel/types';
import { selectProjectNotArchivedListIdsInOrder } from 'models/domain/ListsModel/selectors';
import { selectListIdByTaskIdDomain } from 'models/domain/ListsModel/selectors/domain';
import { selectIsEditingCardMessage } from 'models/domain/MessagesModel/selectors';
import { selectCurrentEditingMessageId } from 'models/domain/MessagesModel/selectors/domain';
import { selectCurrentOrganizationId } from 'models/domain/OrganizationsModel/selectors/domain';
import { onFetchProject } from 'models/domain/ProjectsModel/actions';
import {
  getProjectWithPeopleQueryParams,
  projectWithPeopleRequestType,
} from 'models/domain/ProjectsModel/requestQueryParams';
import { selectIsProjectExist } from 'models/domain/ProjectsModel/selectors';
import { onFetchProjectListsData } from 'models/domain/RequestModel/actions';
import * as RequestTypes from 'models/domain/RequestModel/constants/requestTypes';
import {
  isRequestRepeated,
  selectIsForbiddenError,
  selectIsRequestRepeatable,
  selectRequestIsFailure,
  selectRequestIsSuccess,
} from 'models/domain/RequestModel/selectors';
import * as TasksActions from 'models/domain/TasksModel/actions';
import * as TasksSelectors from 'models/domain/TasksModel/selectors';
import { selectIsTaskDescriptionDirty } from 'models/domain/TasksModel/selectors/domain';

import { dateNow } from '../../../../../../common/utils/date';

function enhance(ComposedComponent) {
  class EnhanceCardDetailsModal extends PureBaseComponent {
    static propTypes = {
      taskId: PropTypes.string,
      projectId: PropTypes.string,
      onCloseCardDetailsModal: PropTypes.func.isRequired,
      onSetUserLatestTaskVisitDate: PropTypes.func.isRequired,

      color: PropTypes.string,
    };

    state = {
      isCardDescriptionFocused: false,
    };

    render() {
      return (
        <ComposedComponent
          color={this.props.color}
          taskId={this.props.taskId}
          projectId={this.props.projectId}
          isFree={this.props.isFree}
          canMoveToNextList={this.canMoveToNextList()}
          isLoading={this.isLoading()}
          isTaskLoaded={this.props.isTaskLoaded}
          hasAccessToTask={this.props.hasAccessToTask}
          isCardDescriptionFocused={this.state.isCardDescriptionFocused}
          isEstimatesExtensionEnabled={this.props.isEstimatesExtensionEnabled}
          hasAccessToEstimates={this.props.hasAccessToEstimates}
          isModalOpen={this.props.isModalOpen}
          isAccessForbidden={this.props.isAccessForbidden}
          setTaskDetailsRef={this.setTaskDetailsRef}
          onUploadFiles={this.props.onAddFilesToTaskAttachments}
          onCloseTaskDetails={this.onCloseTaskDetails}
          onSetIsModalOpen={this.onSetIsModalOpen}
          onMoveTaskToNextList={this.onMoveTaskToNextList}
          onSetIsCardDescriptionFocused={this.onSetIsCardDescriptionFocused}
        />
      );
    }

    isLoading() {
      if (
        this.props.isTaskRequestFailure ||
        this.props.isProjectRequestFailure
      ) {
        return false;
      }
      return !this.props.isTaskLoaded && !this.props.isTaskRequestRepeated;
    }

    setTaskDetailsRef(ref) {
      this.taskDetailsRef = ref;
    }

    onSetIsModalOpen(isOpen) {
      if (!isOpen) {
        this.onCloseTaskDetails();
      }
    }

    onCloseTaskDetails() {
      if (
        !this.props.isTaskDescriptionDirty &&
        !this.props.isEditingCardMessage
      ) {
        this.props.onCloseCardDetailsModal();
      }
      this.props.history.push({
        pathname: '',
        search: '',
      });
    }

    canMoveToNextList() {
      const currentSectionId = this.props.taskSections.get(this.props.taskId);

      if (currentSectionId) {
        return (
          this.props.sectionIds.indexOf(currentSectionId) !==
          this.props.sectionIds.size - 1
        );
      } else {
        // ok
      }

      return false;
    }

    onMoveTaskToNextList() {
      const currentSectionId = this.props.taskSections.get(this.props.taskId);
      if (currentSectionId) {
        const index = this.props.sectionIds.indexOf(currentSectionId);

        if (index !== -1) {
          if (index !== this.props.sectionIds.size - 1) {
            const destinationSectionId = this.props.sectionIds.get(index + 1);

            this.props.onMoveTask(
              this.props.taskId,
              undefined,
              destinationSectionId,
              this.props.projectId
            );
          } else {
            // ok
          }
        } else {
          // ok
        }
      }
    }

    onSetIsCardDescriptionFocused(isCardDescriptionFocused) {
      this.setState({ isCardDescriptionFocused });
    }

    onSetLatestTaskVisit() {
      this.props.onSetUserLatestTaskVisitDate(this.props.taskId, dateNow());
    }

    onFetchProject(props = this.props) {
      const { isProjectRequestRepeatable, projectId } = props;
      if (isProjectRequestRepeatable && projectId) {
        this.props.onFetchProject(projectId);
      }
    }

    componentDidUpdate(prevProps, prevState, prevContext) {
      const { taskId, isTaskLoaded, hasAccessToTask, isModalOpen, projectId } =
        this.props;

      if (!prevProps.isTaskLoaded && isTaskLoaded && this.taskDetailsRef) {
        this.taskDetailsRef.focus();
      }

      const isTaskIdChanged = taskId !== prevProps.taskId;

      if (
        isModalOpen &&
        hasAccessToTask &&
        (!prevProps.hasAccessToTask || isTaskIdChanged)
      ) {
        this.onSetLatestTaskVisit();
      }

      if (!prevProps.isModalOpen && isModalOpen) {
        this.onFetchProject(this.props);

        if (projectId) {
          this.props.onFetchProjectListsData(projectId);
        }
      }
    }

    componentDidMount() {
      if (this.props.isModalOpen) {
        this.onSetLatestTaskVisit();
      }

      if (this.taskDetailsRef) {
        this.taskDetailsRef.focus();
      }

      this.onFetchProject();

      if (this.props.projectId) {
        this.props.onFetchProjectListsData(this.props.projectId);
      }
    }
  }

  const mapStateToProps = (state, props) => {
    const projectId = TasksSelectors.selectProjectIdByTaskId(state, {
      taskId: props.taskId,
    });
    const organizationId = selectCurrentOrganizationId(state);
    const currentEditingMessageId = selectCurrentEditingMessageId(state);

    return {
      isTaskDescriptionDirty: selectIsTaskDescriptionDirty(state),
      projectId,
      isProjectExists: selectIsProjectExist(state, { projectId }),
      isProjectRequestRepeatable: selectIsRequestRepeatable(state, {
        requestType: projectWithPeopleRequestType,
        objectId: projectId,
      }),
      isProjectRequestFailure: selectRequestIsFailure(state, {
        requestType: projectWithPeopleRequestType,
        objectId: projectId,
      }),
      color: TasksSelectors.selectTaskColor(state, { taskId: props.taskId }),
      taskSections: selectListIdByTaskIdDomain(state),
      sectionIds: selectProjectNotArchivedListIdsInOrder(state, { projectId }),
      isTaskRequestRepeated: isRequestRepeated(state, {
        requestType: RequestTypes.getTaskDetails,
        objectId: props.taskId,
      }),
      isTaskLoaded: selectRequestIsSuccess(state, {
        requestType: RequestTypes.getTaskDetails,
        objectId: props.taskId,
      }),
      isTaskRequestFailure: selectRequestIsFailure(state, {
        requestType: RequestTypes.getTaskDetails,
        objectId: props.taskId,
      }),
      isAccessForbidden: selectIsForbiddenError(state, {
        requestType: RequestTypes.getTaskDetails,
        objectId: props.taskId,
      }),
      hasAccessToTask: TasksSelectors.selectHasAccessToTask(state, {
        taskId: props.taskId,
      }),
      isEstimatesExtensionEnabled: selectIsExtensionEnabled(state, {
        organizationId,
        projectId,
        extensionNamespace: ExtensionNamespace.AGILE,
      }),
      hasAccessToEstimates: true,
      isEditingCardMessage: selectIsEditingCardMessage(state, {
        messageId: currentEditingMessageId,
      }),
      isFree: false,
    };
  };

  function mapDispatchToProps(dispatch, props) {
    return {
      onCloseCardDetailsModal: () =>
        dispatch(AppModelActions.onSetOpenedCardDetailsModalId(null)),
      onAddFilesToTaskAttachments: (files) =>
        dispatch(TasksActions.onAddFilesToTaskAttachments(files, props.taskId)),
      onMoveTask: (
        sourceTaskId,
        destinationTaskId,
        destinationListId,
        projectId
      ) =>
        dispatch(
          TasksActions.onMoveTask(
            sourceTaskId,
            destinationTaskId,
            destinationListId,
            projectId,
            projectId,
            true
          )
        ),
      onTaskUpdate: (fields = {}, ignoreDebounce = false) =>
        dispatch(
          TasksActions.onTaskUpdate(props.taskId, fields, ignoreDebounce)
        ),
      onSetUserLatestTaskVisitDate: (taskId, date) =>
        dispatch(TasksActions.onSetUserLatestTaskVisitDate(taskId, date)),
      onFetchProject: (projectId) =>
        dispatch(onFetchProject(projectId, getProjectWithPeopleQueryParams)),
      onFetchProjectListsData: (projectId) =>
        dispatch(onFetchProjectListsData(projectId)),
    };
  }

  return EnhanceWithRouter()(
    connect(mapStateToProps, mapDispatchToProps)(EnhanceCardDetailsModal)
  );
}

export default enhance;
