import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import queryString from 'query-string';
import ImmutablePropTypes from 'react-immutable-proptypes';

import BaseComponent from 'BaseComponent';
import { NavigationService } from 'common/services';
import RouteName from '../../../../AppNavigation/routeNames';
import { selectCurrentUserAccessibleProjectIds } from 'common/models/domain/ProjectsModel/selectors/accessSelectors';
import * as PopUpAlertsModelActions from 'common/models/component/PopUpAlertsModel/actions';
import { HumanMessage } from 'common/models/domain/HumanMessageModel/model';
import { HumanMessageKinds } from 'common/models/domain/HumanMessageModel/types';
import { i18n } from 'common/i18n';
import projectViewTabTypes from '../../../../projects/ProjectView/constants';

const projectIdRegex = /\/projects\/([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})/;

function enhance(ComposedComponent) {
  class EnhanceMessageInternalLink extends BaseComponent {
    static propTypes = {
      target: PropTypes.string.isRequired,

      currentUserAccessibleProjectsIds: ImmutablePropTypes.listOf(PropTypes.string).isRequired,
      onAddAlert: PropTypes.func.isRequired,
    };

    render() {
      return <ComposedComponent key={this.props.key} text={this.props.text} onPress={this.onPress} />;
    }

    onPress() {
      const { query } = queryString.parseUrl(this.props.target);
      if (query.taskId) {
        // current user task accessibility check is in CardDetails component
        NavigationService.navigate(RouteName.CARD_DETAILS, { taskId: query.taskId });
        return;
      }

      const projectRegexMatch = projectIdRegex.exec(this.props.target);
      // projectId is first capturing group so it's placed at index 1
      if (projectRegexMatch && projectRegexMatch[1]) {
        const projectId = projectRegexMatch[1];
        if (this.checkIsProjectAccessible(projectId)) {
          NavigationService.navigate(RouteName.PROJECT, {
            projectId: projectRegexMatch[1],
            selectedTab: this.checkIsKanbanOpen(projectId) ? projectViewTabTypes.BOARD : projectViewTabTypes.CHAT,
          });
        } else {
          this.onPermissionDenied('project');
        }
      }
    }

    checkIsKanbanOpen(projectId) {
      return this.props.target.includes(`${projectId}/kanban`);
    }

    checkIsProjectAccessible(projectId) {
      return this.props.currentUserAccessibleProjectsIds.includes(projectId);
    }

    onPermissionDenied(objectName = 'project') {
      this.props.onAddAlert(
        HumanMessage({
          kind: HumanMessageKinds.warning,
          text: i18n.t(`You don't have necessary permision to access this {{objectName}}.`, { objectName }),
        }),
        `${objectName}-permission-denied`
      );
    }
  }

  const mapStateToProps = (state, props) => ({
    currentUserAccessibleProjectsIds: selectCurrentUserAccessibleProjectIds(state),
  });

  const mapDispatchToProps = (dispatch, props) => ({
    onAddAlert: (humanMessage, id = '') =>
      dispatch(
        PopUpAlertsModelActions.onAddAlert(
          {
            humanMessage,
          },
          id
        )
      ),
  });

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceMessageInternalLink);
}

export default enhance;
