import { PeriodType } from 'common/types';
import { doNothing } from 'common/utils';
import BaseComponent from 'commonEnhancers/BaseComponent';
import { List } from 'immutable';
import {
  selectListIdByTaskId,
  selectProjectNotArchivedListIdsInOrder,
} from 'models/domain/ListsModel/selectors';
import {
  onDeleteTaskRecurrenceSettings,
  onSetTaskRecurrence,
} from 'models/domain/TaskRecurrenceModel/actions';
import {
  selectRecurrenceIdByTaskId,
  selectTaskNextRecurrenceAt,
  selectTaskRecurrenceDayOfMonth,
  selectTaskRecurrenceDueDateOffset,
  selectTaskRecurrenceDueDateOffsetPeriod,
  selectTaskRecurrenceInterval,
  selectTaskRecurrenceMonth,
  selectTaskRecurrencePeriodType,
  selectTaskRecurrencePosition,
  selectTaskRecurrenceUpdateDueDate,
  selectTaskRecurrenceWeekDays,
  selectTaskRecurrenTaskListId,
} from 'models/domain/TaskRecurrenceModel/selectors/domain';
import {
  selectProjectIdByTaskId,
  selectTaskColor,
} from 'models/domain/TasksModel/selectors';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Position } from '../../../../../../common/types';
import { monthKeys } from '../../../../common/MonthsShortDropdown/helpers';
import { getMaxDayOfMonth, getNextRecurrenceAt } from '../../helpers';

const emptyList = new List();

function enhance(ComposedComponent) {
  class EnhanceCardRecurrencySettingsModalContent extends BaseComponent {
    static propTypes = {
      taskId: PropTypes.string.isRequired,
      onCloseModal: PropTypes.func,
    };

    static defaultProps = {
      onCloseModal: doNothing,
    };

    constructor(props) {
      super(props);
      this.state = this.getDefaultSettings();
    }

    render() {
      return (
        <ComposedComponent
          color={this.props.color}
          interval={this.state.interval}
          period={this.state.period}
          weekDays={this.state.weekDays}
          dayOfMonth={this.state.dayOfMonth}
          selectedMonth={this.state.selectedMonth}
          isDueDateEnabled={this.state.isDueDateEnabled}
          dueDateOffset={this.state.dueDateOffset}
          dueDateOffsetPeriod={this.state.dueDateOffsetPeriod}
          selectedListId={this.state.selectedListId}
          selectedPosition={this.state.selectedPosition}
          listIds={this.props.listIds}
          isSubmitEnabled={this.validateSettings()}
          nextRecurrenceAt={this.state.nextRecurrenceAt}
          maxDayOfMonth={this.getMaxDayOfMonth()}
          isUpdating={!!this.props.recurrenceId}
          onCloseModal={this.props.onCloseModal}
          onSave={this.onSave}
          onSelectRecurrencySettings={this.onSelectRecurrencySettings}
          onChangeInterval={this.onChangeInterval}
          onSelectPeriod={this.onSelectPeriod}
          onSelectWeekDay={this.onSelectWeekDay}
          onChangeDayOfMonth={this.onChangeDayOfMonth}
          onSelectMonth={this.onSelectMonth}
          onSetIsDueDateEnabled={this.onSetIsDueDateEnabled}
          onChangeDueDateOffset={this.onChangeDueDateOffset}
          onSelectDueDateOffsetPeriod={this.onSelectDueDateOffsetPeriod}
          onSelectListId={this.onSelectListId}
          onSelectPosition={this.onSelectPosition}
          onRemoveRecurrence={this.onRemoveRecurrence}
        />
      );
    }

    onSave() {
      const taskRecurrenceSettings = this.buildSettings();
      if (!this.validateSettings()) {
        return null;
      }
      this.props.onSetTaskRecurrence(taskRecurrenceSettings);
      this.props.onCloseModal();
    }

    getDefaultSettings() {
      return {
        period: this.props.periodType || PeriodType.WEEKLY,
        interval: this.props.interval || 1,
        weekDays: this.props.weekDays || emptyList,
        dayOfMonth: this.props.dayOfMonth || 1,
        selectedMonth: this.props.month || monthKeys.first(),
        selectedListId:
          this.props.targetTaskListId || this.props.sourceTaskListId,
        selectedPosition: this.props.position || Position.TOP,
        dueDateOffset: this.props.dueDateOffset || 1,
        dueDateOffsetPeriod:
          this.props.dueDateOffsetPeriod || PeriodType.MONTHLY,
        isDueDateEnabled: this.props.updateDueDate || true,
        nextRecurrenceAt: this.props.nextRecurrenceAt,
      };
    }

    buildSettings() {
      return {
        id: this.props.recurrenceId,
        taskId: this.props.taskId,
        targetTaskListId: this.state.selectedListId,
        periodType: this.state.period,
        interval: this.state.interval,

        dayOfMonth: this.state.dayOfMonth,
        month: this.state.selectedMonth,
        weekDays: this.state.weekDays.toArray(),

        nextRecurrenceAt: this.getNextRecurrenceAt(),
        position: this.state.selectedPosition,

        updateDueDate: this.state.isDueDateEnabled,
        dueDateOffset: this.state.dueDateOffset,
        dueDateOffsetPeriod: this.state.dueDateOffsetPeriod,
      };
    }

    invalidateNextRecurrenceAt(state = this.state) {
      this.setState({
        nextRecurrenceAt: this.getNextRecurrenceAt(state),
      });
    }

    validateSettings() {
      const { nextRecurrenceAt } = this.state;

      if (!nextRecurrenceAt) {
        return false;
      }
      return true;
    }

    getNextRecurrenceAt(state = this.state) {
      const { period, interval, weekDays, dayOfMonth, selectedMonth } = state;
      return getNextRecurrenceAt(
        period,
        interval,
        weekDays,
        dayOfMonth,
        selectedMonth
      );
    }

    getMaxDayOfMonth() {
      return getMaxDayOfMonth(this.state.selectedMonth);
    }

    setStateAndInvalidate(newStatePart) {
      this.setState((state) => {
        const newState = { ...state, ...newStatePart };
        this.invalidateNextRecurrenceAt(newState);
        return newStatePart;
      });
    }

    onChangeInterval(event) {
      const interval = parseInt(event.target.value);
      this.setStateAndInvalidate({ interval });
    }

    onSelectPeriod(period) {
      this.setStateAndInvalidate({ period });
    }

    onSelectWeekDay(weekDay) {
      let { weekDays } = this.state;
      if (weekDays.includes(weekDay)) {
        weekDays = weekDays.filter((wd) => wd !== weekDay);
      } else {
        weekDays = weekDays.push(weekDay);
      }
      this.setStateAndInvalidate({ weekDays });
    }

    onChangeDayOfMonth(event) {
      const dayOfMonth = parseInt(event.target.value);
      this.setStateAndInvalidate({ dayOfMonth });
    }

    onSelectMonth(selectedMonth) {
      this.setStateAndInvalidate({ selectedMonth, dayOfMonth: 1 });
    }

    onChangeDueDateOffset(event) {
      const dueDateOffset = parseInt(event.target.value);
      this.setState({ dueDateOffset });
    }

    onSetIsDueDateEnabled(isDueDateEnabled) {
      this.setState({ isDueDateEnabled });
    }

    onSelectDueDateOffsetPeriod(dueDateOffsetPeriod) {
      this.setState({ dueDateOffsetPeriod });
    }

    onSelectListId(listId) {
      this.setState({ selectedListId: listId });
    }

    onSelectPosition(position) {
      this.setState({ selectedPosition: position });
    }

    onRemoveRecurrence() {
      this.props.onDeleteTaskRecurrenceSettings(this.props.recurrenceId);
      this.props.onCloseModal();
    }

    componentDidUpdate(prevProps) {
      if (!prevProps.recurrenceId && this.props.recurrenceId) {
        this.setStateAndInvalidate(this.getDefaultSettings());
      }
    }
  }

  const mapStateToProps = (state, props) => {
    const projectId = selectProjectIdByTaskId(state, { taskId: props.taskId });
    return {
      color: selectTaskColor(state, { taskId: props.taskId }),
      sourceTaskListId: selectListIdByTaskId(state, { taskId: props.taskId }),
      listIds: selectProjectNotArchivedListIdsInOrder(state, { projectId }),

      recurrenceId: selectRecurrenceIdByTaskId(state, { taskId: props.taskId }),
      periodType: selectTaskRecurrencePeriodType(state, {
        taskId: props.taskId,
      }),
      interval: selectTaskRecurrenceInterval(state, { taskId: props.taskId }),
      weekDays: selectTaskRecurrenceWeekDays(state, { taskId: props.taskId }),
      dayOfMonth: selectTaskRecurrenceDayOfMonth(state, {
        taskId: props.taskId,
      }),
      month: selectTaskRecurrenceMonth(state, { taskId: props.taskId }),
      targetTaskListId: selectTaskRecurrenTaskListId(state, {
        taskId: props.taskId,
      }),
      position: selectTaskRecurrencePosition(state, { taskId: props.taskId }),
      updateDueDate: selectTaskRecurrenceUpdateDueDate(state, {
        taskId: props.taskId,
      }),
      dueDateOffset: selectTaskRecurrenceDueDateOffset(state, {
        taskId: props.taskId,
      }),
      dueDateOffsetPeriod: selectTaskRecurrenceDueDateOffsetPeriod(state, {
        taskId: props.taskId,
      }),
      nextRecurrenceAt: selectTaskNextRecurrenceAt(state, {
        taskId: props.taskId,
      }),
    };
  };

  const mapDispatchToProps = (dispatch) => ({
    onSetTaskRecurrence: (recurrenceSettings) =>
      dispatch(onSetTaskRecurrence(recurrenceSettings)),
    onDeleteTaskRecurrenceSettings: (recurrenceId) =>
      dispatch(onDeleteTaskRecurrenceSettings(recurrenceId)),
  });

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(EnhanceCardRecurrencySettingsModalContent);
}

export default enhance;
