import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Views } from 'react-big-calendar';
import BaseComponent from 'commonEnhancers/BaseComponent';
import endOfDay from 'date-fns/end_of_day';

import {
  selectProjectCardEvents,
  selectConversationCardEvents,
  selectTasksColors,
} from 'models/domain/TasksModel/selectors';
import {
  selectProjectColor,
  selectDirectChatPartner,
  selectConversationIdByProjectId,
} from 'models/domain/ProjectsModel/selectors';
import * as AppModelActions from 'models/domain/AppModel/actions';
import { onTaskUpdate } from 'models/domain/TasksModel/actions';
import { selectCurrentUserId } from 'models/domain/UsersModel/selectors/domain';
import { makeFilterId } from 'models/component/FiltersModel/utils';
import isWithinRange from 'date-fns/is_within_range';
import addDays from 'date-fns/add_days';
import { TaskFiltersTargetType } from 'models/component/FiltersModel/types';
import { ProjectPanelType } from 'models/domain/ProjectsSettingsModel/types';
import { onSetDateRange, onSetCurrentView, onSetCurrentDate } from 'models/component/FullCalendarModel/actions';
import {
  selectDateRange,
  selectCurrentView,
  selectCurrentDate,
  selectCurrentOffset,
} from 'models/component/FullCalendarModel/selectors';
import subMinutes from 'date-fns/sub_minutes';
import isEqual from 'date-fns/is_equal';
import getDiffInDays from 'date-fns/difference_in_calendar_days';
import EhanceWithUserTrackerEvent from 'enhancers/EhanceWithUserTrackerEvent';
import { UserTrackerEvent } from 'models/component/UserTrackerEventModel/constants';
import { selectHasAccessToExtension } from 'models/domain/SubscriptionLimitsModel/selectors';
import { ExtensionNamespace } from 'models/domain/ExtensionsModel/types';
import { onSetProjectLastOpenedPanel } from '../../../../../../utils/lastOpenedPanelController';

function Enhance(ComposedComponent) {
  @EhanceWithUserTrackerEvent(UserTrackerEvent.pageOpen, { type: 'calendar' })
  class EnhanceSpaceCalendarView extends BaseComponent {
    static propTypes = {
      projectId: PropTypes.string.isRequired,
      filterId: PropTypes.string,
      innerClassName: PropTypes.string,
      isConversation: PropTypes.bool.isRequired,
    };

    render() {
      return (
        <ComposedComponent
          className={this.props.className}
          innerClassName={this.props.innerClassName}
          projectId={this.props.projectId}
          cardEvents={this.props.cardEvents}
          color={this.props.color}
          currentOffset={this.props.currentOffset}
          currentView={this.props.currentView}
          currentDate={this.props.currentDate}
          dateRange={this.props.dateRange}
          shouldRenderEmptyPage={this.shouldRenderEmptyPage()}
          tasksColors={this.props.tasksColors}
          isInternalCalendarEnabled={this.props.isInternalCalendarEnabled}
          onEventClick={this.onEventClick}
          onEventDrop={this.onEventDrop}
          onEventResize={this.onEventUpdate}
          onSetDateRange={this.onSetDateRange}
          onSetCurrentView={this.onSetCurrentView}
          onSetCurrentDate={this.onSetCurrentDate}
        />
      );
    }

    shouldRenderEmptyPage() {
      if (!this.props.isInternalCalendarEnabled) {
        return;
      }
      const filteredEvents = this.props.cardEvents.filter(this.inRange);
      return filteredEvents.length === 0 && this.props.currentView === Views.AGENDA;
    }

    onSetCurrentView(view) {
      if (!this.props.isInternalCalendarEnabled) {
        return;
      }
      this.props.onSetCurrentView(this.props.projectId, view);
    }

    onSetCurrentDate(date) {
      if (!this.props.isInternalCalendarEnabled) {
        return;
      }
      this.props.onSetCurrentDate(this.props.projectId, date);
    }

    onEventClick(event) {
      if (!this.props.isInternalCalendarEnabled) {
        return;
      }
      if (event.id) {
        this.props.onOpenCardDetailsModal(event.id);
      }
    }

    onEventUpdate(data) {
      if (!this.props.isInternalCalendarEnabled) {
        return;
      }
      const { event, start, end } = data;
      const startDate = start ? start.getTime() : null;
      const dueDate = end ? end.getTime() : null;
      this.props.onTaskUpdate(event.id, { startDate, dueDate });
    }

    onEventDrop(data) {
      if (!this.props.isInternalCalendarEnabled) {
        return;
      }
      const { event, start, end, isAllDay: droppedOnAllDaySlot } = data;
      const isMonthView = this.props.currentView === Views.MONTH;
      let { allDay } = event;

      if (!event.allDay && droppedOnAllDaySlot) {
        allDay = true;
      } else if (event.allDay && !droppedOnAllDaySlot && !isMonthView) {
        allDay = false;
      }

      let startDate = null;
      if (!allDay || getDiffInDays(end, start) > 1) {
        startDate = start ? start.getTime() : null;
      }

      if (event.allDay && isEqual(start, end) && !isMonthView) {
        startDate = subMinutes(start, 30).getTime();
      }

      const dueDate = end ? end.getTime() : null;
      this.props.onTaskUpdate(event.id, { startDate, dueDate });
    }

    onSetDateRange(dateRange) {
      if (!this.props.isInternalCalendarEnabled) {
        return;
      }

      const end = dateRange.end && this.props.currentView === Views.MONTH ? endOfDay(dateRange.end) : dateRange.end;
      this.props.onSetDateRange(this.props.projectId, {
        start: dateRange.start,
        end,
      });
    }

    inRange(event) {
      const { start, end } = event;
      const rangeStart = this.props.currentDate;
      const rangeEnd = addDays(rangeStart, this.props.currentOffset);
      return isWithinRange(start, rangeStart, rangeEnd) || isWithinRange(end, rangeStart, rangeEnd);
    }

    onUpdateLastPanelType() {
      onSetProjectLastOpenedPanel(this.props.projectId, ProjectPanelType.CALENDAR);
    }

    componentDidMount() {
      this.onUpdateLastPanelType();
      if (!this.props.currentView) {
        this.onSetCurrentView(Views.MONTH);
      }
    }

    componentDidUpdate() {
      this.onUpdateLastPanelType();
    }
  }

  function mapStateToProps(state, props) {
    const currentUserId = selectCurrentUserId(state);
    const conversationId = selectConversationIdByProjectId(state, {
      projectId: props.projectId,
    });
    const filterId = props.filterId || makeFilterId(currentUserId, TaskFiltersTargetType.CALENDAR, props.projectId);
    const userId = selectDirectChatPartner(state, { conversationId });
    return {
      cardEvents: props.isConversation
        ? selectConversationCardEvents(state, {
            projectId: props.projectId,
            filterId,
            userId,
          })
        : selectProjectCardEvents(state, {
            projectId: props.projectId,
            filterId,
          }),
      color: selectProjectColor(state, { projectId: props.projectId }),
      tasksColors: selectTasksColors(state),
      dateRange: selectDateRange(state, { objectId: props.projectId }),
      currentView: selectCurrentView(state, { objectId: props.projectId }),
      currentDate: selectCurrentDate(state, { objectId: props.projectId }),
      currentOffset: selectCurrentOffset(state, { objectId: props.projectId }),
      isInternalCalendarEnabled: selectHasAccessToExtension(state, {
        extensionNamespace: ExtensionNamespace.INTERNAL_CALENDAR,
      }),
    };
  }

  function mapDispatchToProps(dispatch, props) {
    return {
      onOpenCardDetailsModal: (taskId) => dispatch(AppModelActions.onSetOpenedCardDetailsModalId(taskId)),
      onTaskUpdate: (taskId, fields) => dispatch(onTaskUpdate(taskId, fields, true)),
      onSetDateRange: (projectId, dateRange) => dispatch(onSetDateRange(projectId, dateRange)),
      onSetCurrentView: (projectId, currentView) => dispatch(onSetCurrentView(projectId, currentView)),
      onSetCurrentDate: (projectId, currentDate) => dispatch(onSetCurrentDate(projectId, currentDate)),
    };
  }

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceSpaceCalendarView);
}

export default Enhance;
