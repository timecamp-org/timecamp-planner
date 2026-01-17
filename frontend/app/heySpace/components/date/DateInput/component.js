import parse from 'date-fns/parse';
import PropTypes from 'prop-types';
import { IMaskMixin } from 'react-imask';

import { doNothing } from 'common/utils';
import { format, parseDateIntoTimestamp } from 'common/utils/dateOperations';
import UserInput from 'commonComponents/UserInput';

import { prepareDateToParse } from './helpers';

const customFormat = 'd{-}`m{-}`Y';
const minDate = new Date(1970, 0, 1);
const maxDate = new Date(2030, 0, 1);
DateInput.propTypes = {
  className: PropTypes.string,

  placeholder: PropTypes.string,
  value: PropTypes.string,
  isDisabled: PropTypes.bool,

  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onKeyPress: PropTypes.func,
  onEnterPress: PropTypes.func,
  onSetRef: PropTypes.func,
};

DateInput.defaultProps = {
  placeholder: 'DD-MM-YYYY',
  value: '',
  isDisabled: false,

  onFocus: doNothing,
  onBlur: doNothing,
  onChange: doNothing,
  onKeyPress: doNothing,
  onEnterPress: doNothing,
  onSetRef: doNothing,
};

function DateInput(props) {
  return (
    <MaskedInput
      className={props.className}
      tabIndex={props.tabIndex}
      pattern={customFormat}
      mask={Date}
      min={minDate}
      max={maxDate}
      radix="-"
      autofix={true}
      overwrite={true}
      lazy={true}
      value={props.value}
      format={(date) => format(date, props.format)}
      parse={(text) => {
        const date = prepareDateToParse(text, props.format);
        const parsedValue = parseDateIntoTimestamp(date);

        return parse(parsedValue);
      }}
      unmask={true}
      inputRef={props.onSetRef}
      onAccept={props.onAccept}
      onBlur={props.onBlur}
      placeholder={props.placeholder}
    />
  );
}

const MaskedInput = IMaskMixin(({ inputRef, ...props }) => (
  <UserInput {...props} onSetInnerRef={inputRef} type="text" />
));

export default DateInput;
