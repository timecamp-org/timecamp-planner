import { ButtonBase } from '@mui/material';
import PropTypes from 'prop-types';

import { doNothing } from 'common/utils';
import { Eye } from 'commonComponents/Icons/fontawesome/Eye';
import { EyeSlash } from 'commonComponents/Icons/fontawesome/EyeSlash';

FollowObjectController.propTypes = {
  className: PropTypes.string,
  shouldRenderInfoTooltip: PropTypes.bool,
  isObjectFollowed: PropTypes.bool,
  isDisabled: PropTypes.bool,
  objectName: PropTypes.string,
  onClick: PropTypes.func,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
};

FollowObjectController.defaultProps = {
  shouldRenderInfoTooltip: false,
  isObjectFollowed: false,
  objectName: '',
  onClick: doNothing,
  onMouseEnter: doNothing,
  onMouseLeave: doNothing,
};

function FollowObjectController(props) {
  return (
    <ButtonBase disabled={props.isDisabled} onClick={props.onClick}>
      {props.isObjectFollowed ? <Eye /> : <EyeSlash />}
    </ButtonBase>
  );
}

export default FollowObjectController;
