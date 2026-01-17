import React from "react";
import { connect } from "react-redux";
import BaseComponent from "commonEnhancers/BaseComponent";

import { onUnsetDateRange } from "models/component/FullCalendarModel/actions";
import {
  selectDateRange,
  selectCurrentView,
} from "models/component/FullCalendarModel/selectors";
import {
  selectProjectIdByConversationId,
  selectMyselfConversationId,
} from "models/domain/ProjectsModel/selectors";

function Enhance(ComposedComponent) {
  class EnhanceDateCellWrapper extends BaseComponent {
    render() {
      return (
        <ComposedComponent
          className={this.props.className}
          projectId={this.props.projectId}
          dateRange={this.props.dateRange}
          currentView={this.props.currentView}
          // custom component stuff
          value={this.props.value}
          range={this.props.value}
          children={this.props.children}
          onUnsetDateRange={this.onUnsetDateRange}
        />
      );
    }

    onUnsetDateRange() {
      this.props.onUnsetDateRange(this.props.projectId);
    }
  }

  function mapStateToProps(state, props) {
    const objectId =
      props.match.params.projectId || selectMyselfConversationId(state);
    const projectId =
      selectProjectIdByConversationId(state, { conversationId: objectId }) ||
      objectId;
    return {
      projectId,
      dateRange: selectDateRange(state, { objectId: projectId }),
      currentView: selectCurrentView(state, { objectId: projectId }),
    };
  }

  function mapDispatchToProps(dispatch, props) {
    return {
      onUnsetDateRange: (projectId) => dispatch(onUnsetDateRange(projectId)),
    };
  }

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceDateCellWrapper);
}

export default Enhance;
