import React from "react";
import PropTypes from "prop-types";
import BaseComponent from "commonEnhancers/BaseComponent";
import {
  format,
  parseDateIntoTimestamp,
  parseTimeIntoTimestamp,
} from "common/utils/dateOperations";
import { prepareDateToParse } from "../../helpers";
import { doNothing } from "common/utils";

const FULL_MASK_LENGTH = 10;

function Enhance(ComposedComponent) {
  class EnhanceDateInput extends BaseComponent {
    static propTypes = {
      format: PropTypes.string,
      onFocus: PropTypes.func,
      onChange: PropTypes.func,
      onBlur: PropTypes.func,
      inputRef: PropTypes.object,
    };

    static defaultProps = {
      format: "DD-MM-YYYY",
      onFocus: doNothing,
      onChange: doNothing,
      onBlur: doNothing,
    };

    state = {
      value: this.props.value
        ? format(this.props.value, this.props.format)
        : undefined,
      hour: this.props.value ? format(this.props.value, "HH:mm") : undefined,
    };

    render() {
      return (
        <ComposedComponent
          className={this.props.className}
          value={this.state.value}
          isDisabled={this.props.isDisabled}
          onFocus={this.onFocus}
          format={this.props.format}
          onAccept={this.onAccept}
          onSetRef={this.onSetRef}
        />
      );
    }

    onFocus(event) {
      event.target.select();
      this.props.onFocus();
    }

    onAccept(value) {
      this.setState({
        value,
      });
      const dateText = prepareDateToParse(value, this.props.format);
      const parsedValue = parseDateIntoTimestamp(dateText);
      const parsedTime = parseTimeIntoTimestamp(this.state.hour, parsedValue);

      if (value.length === FULL_MASK_LENGTH || !value) {
        this.props.onChange({
          value,
          parsedValue: value ? parsedTime : null,
        });
      }
    }

    onSetRef(ref) {
      this.timeInput = ref;
      if (this.props.inputRef) {
        this.props.inputRef.current = ref;
      }
    }

    componentDidMount() {
      if (this.timeInput && this.props.focusOnMount) {
        this.timeInput.focus();
      }
    }

    componentDidUpdate(prevProps) {
      const { value } = this.props;
      if (prevProps.value !== value) {
        const date = format(value, this.props.format);
        this.setState({
          value: value ? date : undefined,
          hour: value ? format(value, "HH:mm") : undefined,
        });
      }
    }
  }

  return EnhanceDateInput;
}

export default Enhance;
