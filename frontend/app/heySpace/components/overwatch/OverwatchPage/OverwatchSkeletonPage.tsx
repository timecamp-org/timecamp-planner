import DefaultContentSkeletonLoader from 'commonComponents/skeletons/DefaultContentSkeletonLoader';
import styles from './styles.css';

const OverwatchSkeletonLoader = () => {
  return (
    <div className={styles.skeletonWrapper}>
      <DefaultContentSkeletonLoader />
    </div>
  );
};

export default OverwatchSkeletonLoader;
