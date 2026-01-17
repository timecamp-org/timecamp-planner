import React from "react";
import PropTypes from "prop-types";

import getTime from "date-fns/get_time";
import isNil from "lodash/isNil";

import BaseComponent from "commonEnhancers/BaseComponent";

function Enhance(ComposedComponent) {
  class EnhanceDateController extends BaseComponent {
    static propTypes = {
      date: PropTypes.number,
      shouldClosePickerOnSelect: PropTypes.bool,
      shouldRenderClearButton: PropTypes.bool,
    };

    state = {
      isDatePickerOpen: false,
      localStateTimestamp: null,
      shouldRenderInfoTooltip: false,
    };

    modalRootNode = null;

    popperRootNode = null;

    showTooltipTimeout = null;

    render() {
      return (
        <ComposedComponent
          {...this.props}
          className={this.props.className}
          color={this.props.color}
          timestamp={this.props.date}
          from={this.props.from}
          to={this.props.to}
          localStateTimestamp={this.state.localStateTimestamp}
          isDatePickerOpen={this.state.isDatePickerOpen}
          shouldRenderClearButton={this.props.shouldRenderClearButton}
          isRangePicker={this.props.isRangePicker}
          onMouseEnterControllerButton={this.onMouseEnterControllerButton}
          onMouseLeaveControllerButton={this.onMouseLeaveControllerButton}
          onControllerClick={this.onControllerClick}
          onCloseDatePicker={this.onCloseDatePicker}
          onClearDate={this.onClearDate}
          onChangeDate={this.onChangeDate}
          onChangeDateRange={this.onChangeDateRange}
          onSelectTomorrow={this.onSelectTomorrow}
          onSelectNextWeek={this.onSelectNextWeek}
          onSelectNextMonth={this.onSelectNextMonth}
          renderTargetComponent={this.props.renderTargetComponent}
        />
      );
    }

    onCloseDatePicker() {
      this.setState({
        isDatePickerOpen: false,
      });
      if (this.props.date !== this.state.localStateTimestamp) {
        this.props.onUpdateDate(this.state.localStateTimestamp);
      }
    }

    onOpenDatePicker() {
      this.setState({
        isDatePickerOpen: true,
        localStateTimestamp: this.props.date,
      });
    }

    onControllerClick() {
      if (this.state.isDatePickerOpen) {
        this.onCloseDatePicker();
      } else {
        this.onOpenDatePicker();
      }
    }

    onClearDate() {
      this.setState({
        isDatePickerOpen: false,
      });
      if (!isNil(this.state.localStateTimestamp)) {
        this.props.onUpdateDate(null);
      }
    }

    onChangeDate(newDate) {
      const newTimestamp = getTime(newDate);
      this.setState({
        localStateTimestamp: newTimestamp,
      });
      if (this.props.shouldClosePickerOnSelect) {
        this.props.onUpdateDate(newTimestamp);
        this.setState({
          isDatePickerOpen: false,
        });
      }
    }

    onChangeDateRange(dateRange) {
      const { from, to } = dateRange;
      this.props.onChangeDateRange(dateRange);

      if (this.props.shouldClosePickerOnSelect && from && to) {
        this.onCloseDatePicker();
      }
    }

    componentDidMount() {
      this.popperRootNode = document.getElementById("popper-root");
    }

    componentDidUpdate(prevProps) {
      if (!this.state.isDatePickerOpen && prevProps.date !== this.props.date) {
        this.setState({
          localStateTimestamp: this.props.date,
        });
      }
    }
  }

  return EnhanceDateController;
}

export default Enhance;
