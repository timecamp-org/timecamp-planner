import PropTypes from 'prop-types';

import { doNothing } from 'common/utils';
import colorStyles from 'styles/colors.css';

import styles from './styles.css';

Component.propTypes = {
  username: PropTypes.string.isRequired,
  color: PropTypes.string,
  isMentionPopoverOpen: PropTypes.bool,
  onClick: PropTypes.func,
};

Component.defaultProps = {
  color: colorStyles.wisteriaColor,
  isMentionPopoverOpen: false,
  onClick: doNothing,
};
function Component({ username, isMentionPopoverOpen, onClick, ...props }) {
  return (
    <span className={`${isMentionPopoverOpen ? styles.mentionActive : styles.mention}`} onClick={onClick} {...props}>
      {`@${username}`}
    </span>
  );
}

export default Component;
