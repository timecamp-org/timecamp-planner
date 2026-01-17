import PropTypes from 'prop-types';

import styles from './styles.css';

LoadingDots.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
};

function LoadingDots(props) {
  return (
    <div className={props.className} style={props.style}>
      <span className={styles.dot}></span>
      <span className={`${styles.second} ${styles.dot}`}></span>
      <span className={`${styles.third} ${styles.dot}`}></span>
    </div>
  );
}

export default LoadingDots;
