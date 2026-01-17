import React from "react";
import { connect } from "react-redux";
import BaseComponent from "commonEnhancers/BaseComponent";
import { Views } from "react-big-calendar";
import addMonths from "date-fns/add_months";
import subMonths from "date-fns/sub_months";
import addDays from "date-fns/add_days";
import subDays from "date-fns/sub_days";
import addWeeks from "date-fns/add_weeks";
import subWeeks from "date-fns/sub_weeks";
import getDiffInDays from "date-fns/difference_in_calendar_days";

import {
  onSetCurrentDate,
  onSetCurrentView,
} from "models/component/FullCalendarModel/actions";
import {
  selectCurrentView,
  selectCurrentOffset,
} from "models/component/FullCalendarModel/selectors";
import {
  selectProjectIdByConversationId,
  selectMyselfConversationId,
  selectProjectColor,
} from "models/domain/ProjectsModel/selectors";

function Enhance(ComposedComponent) {
  class EnhanceToolbarWrapper extends BaseComponent {
    render() {
      return (
        <ComposedComponent
          {...this.props}
          className={this.props.className}
          from={this.props.date}
          to={addDays(this.props.date, this.props.currentOffset)}
          onClickNext={this.onClickNext}
          onClickPrevious={this.onClickPrevious}
          onSetCurrentDateRange={this.onSetCurrentDateRange}
          onSetCurrentView={this.onSetCurrentView}
        />
      );
    }

    onClickNext() {
      const { date, currentView } = this.props;
      switch (currentView) {
        case Views.MONTH:
        case Views.AGENDA:
          return this.props.onSetCurrentDate(
            this.props.projectId,
            addMonths(date, 1)
          );
        case Views.DAY:
          return this.props.onSetCurrentDate(
            this.props.projectId,
            addDays(date, 1)
          );
        case Views.WEEK:
          return this.props.onSetCurrentDate(
            this.props.projectId,
            addWeeks(date, 1)
          );
        default:
          return null;
      }
    }

    onClickPrevious() {
      const { date, currentView } = this.props;
      switch (currentView) {
        case Views.MONTH:
        case Views.AGENDA:
          return this.props.onSetCurrentDate(
            this.props.projectId,
            subMonths(date, 1)
          );
        case Views.DAY:
          return this.props.onSetCurrentDate(
            this.props.projectId,
            subDays(date, 1)
          );
        case Views.WEEK:
          return this.props.onSetCurrentDate(
            this.props.projectId,
            subWeeks(date, 1)
          );
        default:
          return null;
      }
    }

    onSetCurrentDateRange(dateRange) {
      const { from, to } = dateRange;
      if (from && to) {
        const offset = getDiffInDays(to, from);
        this.props.onSetCurrentDate(this.props.projectId, from, offset);
      }
    }

    onSetCurrentView(currentView) {
      this.props.onSetCurrentView(this.props.projectId, currentView);
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
      color: selectProjectColor(state, { projectId }),
      currentView: selectCurrentView(state, { objectId: projectId }),
      currentOffset: selectCurrentOffset(state, { objectId: projectId }),
    };
  }

  function mapDispatchToProps(dispatch) {
    return {
      onSetCurrentDate: (projectId, date, offset) =>
        dispatch(onSetCurrentDate(projectId, date, offset)),
      onSetCurrentView: (projectId, currentView) =>
        dispatch(onSetCurrentView(projectId, currentView)),
    };
  }

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceToolbarWrapper);
}

export default Enhance;
