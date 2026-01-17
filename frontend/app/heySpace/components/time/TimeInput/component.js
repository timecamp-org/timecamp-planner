import { IconButton } from '@mui/material';
import PropTypes from 'prop-types';
import TimeField from 'react-simple-timefield';

import { doNothing } from 'common/utils';
import { Clock } from 'commonComponents/Icons/fontawesome/Clock';
import UserInput from 'commonComponents/UserInput/component';

TimeInput.propTypes = {
  className: PropTypes.string,
  placeholder: PropTypes.string,
  hideIcon: PropTypes.boolean,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onKeyPress: PropTypes.func,
  onEnterPress: PropTypes.func,
  onSetRef: PropTypes.func,
  onClick: PropTypes.func,
  onKeyDown: PropTypes.func,
};

TimeInput.defaultProps = {
  placeholder: 'HH:MM',
  value: '',

  onFocus: doNothing,
  onBlur: doNothing,
  onChange: doNothing,
  onKeyPress: doNothing,
  onSetRef: doNothing,
  onClick: doNothing,
  onKeyDown: doNothing,
};

function TimeInput(props) {
  return <TimeField value={props.value} onChange={props.onValueChange} input={renderInnerInput(props)} colon=":" />;
}

function renderInnerInput(props) {
  return (
    <UserInput className={props.className} type="text" value={props.value} placeholder={props.placeholder}>
      {!props.hideIcon && (
        <IconButton>
          <Clock />
        </IconButton>
      )}
    </UserInput>
  );
}

export default TimeInput;
