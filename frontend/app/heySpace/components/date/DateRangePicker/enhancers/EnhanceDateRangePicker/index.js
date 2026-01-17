import React from 'react';

import isSameDay from 'date-fns/is_same_day';
import PropTypes from 'prop-types';
import EnhanceWithClickOutside from 'react-click-outside';
import { DateUtils } from 'react-day-picker';
import { connect } from 'react-redux';

import { doNothing } from 'common/utils';
import { epochNow } from 'common/utils/epoch';
import BaseComponent from 'commonEnhancers/BaseComponent';
import { selectCurrentUserLocale } from 'models/domain/UsersModel/selectors/domain';

function Enhance(ComposedComponent) {
  @EnhanceWithClickOutside
  class EnhanceDateRangePicker extends BaseComponent {
    static propTypes = {
      onChange: PropTypes.func,
      onReset: PropTypes.func,
      footerRenderer: PropTypes.func,
      selectStartDateOnly: PropTypes.bool,
      selectEndDateOnly: PropTypes.bool,
      color: PropTypes.string,
      from: PropTypes.date,
      to: PropTypes.to,
      className: PropTypes.string,
    };

    static defaultProps = {
      onChange: doNothing,
      onReset: doNothing,
    };

    state = this.getInitialState();

    render() {
      const { from, to, enteredTo } = this.state;
      const modifiers = { start: from, end: enteredTo };

      return (
        <ComposedComponent
          className={this.props.className}
          currentUserLocale={this.props.currentUserLocale}
          color={this.props.color}
          modifiers={modifiers}
          disabledDays={this.getDisabledDays()}
          selectedDays={this.getSelectedDays()}
          shouldRenderClearButton={this.props.shouldRenderClearButton}
          from={from}
          to={to}
          selectEndDateOnly={this.props.selectEndDateOnly}
          enteredTo={enteredTo}
          shouldDisplayAsToday={this.shouldDisplayAsToday}
          footerRenderer={this.props.footerRenderer}
          onDayClick={this.onDayClick}
          onClearDate={this.props.onClearDate}
          onDayMouseEnter={this.onDayMouseEnter}
          onDayMouseLeave={this.props.onDayMouseLeave}
          onSetRef={this.onSetRef}
        />
      );
    }

    getSelectedDays() {
      const { from, enteredTo } = this.state;
      let selectedDays = [from, { from, to: enteredTo }];

      if (this.props.selectEndDateOnly) {
        selectedDays = enteredTo;
      }

      return selectedDays;
    }

    getDisabledDays() {
      if (this.props.selectStartDateOnly) {
        return { after: this.state.to };
      }

      if (this.props.selectEndDateOnly) {
        return { before: this.state.from };
      }

      return undefined;
    }

    shouldDisplayAsToday(day) {
      const isToday = isSameDay(day, epochNow());
      const isSelected = isSameDay(day, this.props.date);
      return isToday && !isSelected;
    }

    isSelectingFirstDay(from, to, day) {
      const isBeforeFirstDay = from && DateUtils.isDayBefore(day, from);
      return !from || isBeforeFirstDay;
    }

    onDayMouseEnter(day) {
      const { from, to } = this.state;
      const isRangeSelected = from && to;
      const isSelectingFirstDay = this.isSelectingFirstDay(from, to, day);
      if (!isSelectingFirstDay && !isRangeSelected) {
        this.setState({
          enteredTo: day,
        });
      }
    }

    onDayClick(day) {
      const { from, to } = this.state;

      if (this.props.shouldResetOnClick && from && to && day >= from && day <= to) {
        this.onResetClick(day);
        return;
      }

      if (this.props.selectStartDateOnly && to && day > to) {
        this.onResetClick(day);
        return;
      }

      if (this.props.selectEndDateOnly && from && day < from) {
        this.onResetClick(day);
        return;
      }

      if (this.isSelectingFirstDay(from, to, day)) {
        this.onChange({
          from: day,
          to: null,
          enteredTo: null,
        });
      } else {
        this.onChange({
          to: day,
          enteredTo: day,
        });
      }
    }

    onResetClick(day) {
      this.setState(() => {
        const { selectStartDateOnly } = this.props;
        const outputData = {
          to: null,
          from: null,
          enteredTo: null,
        };

        if (selectStartDateOnly) {
          outputData.from = day;
        }

        this.props.onChange(outputData);
        this.props.onReset();
        return outputData;
      });
    }

    onChange(data) {
      this.setState((currentData) => {
        const { from, to, enteredTo } = data;
        const { selectEndDateOnly, selectStartDateOnly } = this.props;

        let outputData = { ...currentData, enteredTo };
        const updatetState = { ...currentData, ...data };

        const updatedDate = from || to;

        if (selectEndDateOnly && updatedDate) {
          outputData.to = updatedDate;
          if (!this.props.from) {
            outputData.from = null;
            updatetState.from = null;
          }
        } else if (selectStartDateOnly && updatedDate) {
          outputData.from = updatedDate;
        } else {
          outputData = { ...outputData, ...data };
        }

        this.props.onChange(outputData);
        return updatetState;
      });
    }

    getInitialState() {
      return {
        from: this.props.from,
        to: this.props.to,
        enteredTo: this.props.to, // Keep track of the last day for mouseEnter.
      };
    }

    onSetRef(dayPicker) {
      this.dayPicker = dayPicker;
    }

    componentDidUpdate(prevProps) {
      const { from, to } = this.props;
      if (prevProps.from !== from) {
        this.setState({ from });
      }

      if (prevProps.to !== to) {
        this.setState({ to, enteredTo: to });
      }
    }

    handleClickOutside(event) {
      if (this.props.onClickOutside) {
        this.props.onClickOutside(event);
      }
    }
  }

  function mapStateToProps(state) {
    return {
      currentUserLocale: selectCurrentUserLocale(state),
    };
  }

  return connect(mapStateToProps)(EnhanceDateRangePicker);
}

export default Enhance;
