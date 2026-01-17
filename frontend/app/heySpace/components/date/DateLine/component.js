import getIsToday from 'date-fns/is_today';
import PropTypes from 'prop-types';

import { getFormattedDateForDateLine } from 'common/utils/dateOperations';
import HorizontalDivider from 'commonComponents/HorizontalDivider';
import { getConditionalClass } from 'utils/getConditionalClass';

import styles from './styles.css';

DateLine.propTypes = {
  timestamp: PropTypes.number,
};

DateLine.defaultProps = {
  timestamp: 0,
};

function DateLine(props) {
  const isToday = getIsToday(props.timestamp);

  return (
    <div ref={props.innerRef} className={styles.dateLine}>
      {props.shouldRenderTopBackground && <div className={styles.topBackground}></div>}
      <HorizontalDivider className={`${styles.horizontalDivider} ${getConditionalClass(styles.today, isToday)}`} />
      <div className={`${styles.text} ${getConditionalClass(styles.today, isToday)}`}>
        {getFormattedDateForDateLine(props.timestamp)}
      </div>
    </div>
  );
}

export default DateLine;
