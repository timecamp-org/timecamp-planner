import PropTypes from 'prop-types';

import { doNothing } from 'common/utils';
import { format, parseTimeIntoTimestamp } from 'common/utils/dateOperations';
import BaseComponent from 'commonEnhancers/BaseComponent';

function Enhance(ComposedComponent) {
  class EnhanceTimeInput extends BaseComponent {
    // eslint-disable-line react/prefer-stateless-function

    static propTypes = {
      value: PropTypes.number,
      format: PropTypes.string,
      placeholder: PropTypes.string,
      onChange: PropTypes.func,
      onFocus: PropTypes.func,
      onEnterPress: PropTypes.func,
      onBlur: PropTypes.func,
    };

    static defaultProps = {
      format: 'HH:mm aa',
      onChange: doNothing,
      onFocus: doNothing,
      onEnterPress: doNothing,
      onBlur: doNothing,
    };

    state = {
      value: this.props.value ? format(this.props.value, this.props.format) : undefined,
    };

    startSelection = null;

    render() {
      return (
        <ComposedComponent
          className={this.props.className}
          value={this.state.value}
          onValueChange={this.onValueChange}
          hideIcon={this.props.hideIcon}
          placeholder={this.props.placeholder}
        />
      );
    }

    onSetRef(ref) {
      this.timeInput = ref;
    }

    onValueChange(event, value) {
      const parsedValue = parseTimeIntoTimestamp(value, this.props.value);
      this.setState({
        value,
      });
      this.props.onChange({ value, parsedValue });
    }

    componentDidUpdate(prevProps) {
      const { value } = this.props;
      if (prevProps.value !== value) {
        const time = format(value, this.props.format);
        this.setState({ value: value ? time : undefined });
      }
    }
  }

  return EnhanceTimeInput;
}

export default Enhance;
