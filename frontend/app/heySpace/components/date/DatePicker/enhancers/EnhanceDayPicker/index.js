import React from "react";
import { connect } from "react-redux";
import isSameDay from "date-fns/is_same_day";
import { epochNow } from "common/utils/epoch";
import isSameMonth from "date-fns/is_same_month";
import isBefore from "date-fns/is_before";

import BaseComponent from "commonEnhancers/BaseComponent";
import { selectCurrentUserLocale } from "models/domain/UsersModel/selectors/domain";
import EnhanceWithClickOutside from "react-click-outside";

function EnhanceDayPicker(ComposedComponent) {
  @EnhanceWithClickOutside
  class EnhanceDayPicker extends BaseComponent {
    static propTypes = {};

    render() {
      return (
        <ComposedComponent
          className={this.props.className}
          currentUserLocale={this.props.currentUserLocale}
          date={this.props.date}
          color={this.props.color}
          shouldRenderClearButton={this.props.shouldRenderClearButton}
          shouldDisplayAsToday={this.shouldDisplayAsToday}
          onDayClick={this.onDayClick}
          onChange={this.props.onChange}
          onClearDate={this.props.onClearDate}
          onDayMouseEnter={this.props.onDayMouseEnter}
          onDayMouseLeave={this.props.onDayMouseLeave}
          onSetRef={this.onSetRef}
        />
      );
    }

    shouldDisplayAsToday(day) {
      const isToday = isSameDay(day, epochNow());
      const isSelected = isSameDay(day, this.props.date);
      return isToday && !isSelected;
    }

    onDayClick(date) {
      if (isSameMonth(date, this.props.date)) {
        this.props.onChange(date);
      } else if (isBefore(date, this.props.date)) {
        this.props.onChange(date);
        this.dayPicker.showPreviousMonth();
      } else {
        this.props.onChange(date);
        this.dayPicker.showNextMonth();
      }
    }

    onSetRef(dayPicker) {
      this.dayPicker = dayPicker;
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

  return connect(mapStateToProps)(EnhanceDayPicker);
}

export default EnhanceDayPicker;
