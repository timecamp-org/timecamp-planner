import CircularProgress from '@mui/material/CircularProgress';
import styles from './styles.css';

const DEFAULT_SPINNER_SIZE = 30;

const SpinnerDouble = () => {
  return (
    <div className={styles.spinnerWrapper}>
      <CircularProgress
        variant="determinate"
        value={100}
        className={styles.spinnerBackground}
        size={DEFAULT_SPINNER_SIZE}
      />
      <CircularProgress variant="indeterminate" size={DEFAULT_SPINNER_SIZE} />
    </div>
  );
};

export default SpinnerDouble;
