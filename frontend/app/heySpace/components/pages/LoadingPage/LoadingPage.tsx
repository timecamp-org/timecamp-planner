import SpinnerDouble from 'commonComponents/SpinnerDouble';
import styles from './styles.css';

const LoadingPage = () => {
  return (
    <div className={styles.loadingPageWrapper}>
      <SpinnerDouble />
    </div>
  );
};

export default LoadingPage;
