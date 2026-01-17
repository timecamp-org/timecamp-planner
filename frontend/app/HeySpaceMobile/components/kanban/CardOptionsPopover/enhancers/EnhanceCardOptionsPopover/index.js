import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import BaseComponent from 'BaseComponent';
import * as NavigationModelActions from 'common/models/mobile/NavigationModel/actions';
import { selectIsCardMoreOptionsActionSheetOpened } from 'common/models/mobile/NavigationModel/selectors';
import cardOptionsEnum from '../../../CardDetailsOptionsActionSheet/cardOptionsEnum';
import { onArchiveTask } from 'common/models/domain/TasksModel/actions';
import { selectProjectIdByTaskId, selectTaskName } from 'common/models/domain/TasksModel/selectors';
import RouteName from '../../../../AppNavigation/routeNames';
import * as PopUpAlertsModelActions from 'common/models/component/PopUpAlertsModel/actions';
import { HumanMessage } from 'common/models/domain/HumanMessageModel/model';
import { HumanMessageKinds } from 'common/models/domain/HumanMessageModel/types';
import { NavigationService } from 'common/services';

function enhance(ComposedComponent) {
  class EnhanceCardOptionsPopover extends BaseComponent {
    static propTypes = {
      taskId: PropTypes.string.isRequired,
    };

    render() {
      return (
        <ComposedComponent
          taskId={this.props.taskId}
          isOpened={this.props.isOpened}
          onOpen={this.onOpen}
          onClose={this.onClose}
          onSelectOption={this.onSelectOption}
        />
      );
    }

    onSelectOption(option) {
      switch (option) {
        case cardOptionsEnum.ARCHIVE_CARD: {
          this.onClose();
          this.props.onArchiveCard();
          NavigationService.navigate(RouteName.PROJECT, { projectId: this.props.projectId });
          // TODO: Move displaying alert to saga
          this.props.onAddAlert(`You've successfully archived task: ${this.props.cardName}`);
          break;
        }
        default: {
          break;
        }
      }
    }

    onOpen() {
      this.props.onSetIsOpened(true);
    }

    onClose() {
      this.props.onSetIsOpened(false);
    }
  }

  const mapStateToProps = (state, props) => {
    const projectId = selectProjectIdByTaskId(state, { taskId: props.taskId });
    return {
      projectId,
      isOpened: selectIsCardMoreOptionsActionSheetOpened(state),
      cardName: selectTaskName(state, { taskId: props.taskId }),
    };
  };

  const mapDispatchToProps = (dispatch, props) => ({
    onSetIsOpened: (isOpened) => dispatch(NavigationModelActions.onSetIsCardMoreOptionsActionSheetOpened(isOpened)),
    onArchiveCard: () => dispatch(onArchiveTask(props.taskId)),
    onAddAlert: (message) =>
      dispatch(
        PopUpAlertsModelActions.onAddAlert(
          {
            humanMessage: HumanMessage({
              kind: HumanMessageKinds.success,
              text: message,
            }),
          },
          `task-${props.taskId}-archived`
        )
      ),
  });

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceCardOptionsPopover);
}

export default enhance;
