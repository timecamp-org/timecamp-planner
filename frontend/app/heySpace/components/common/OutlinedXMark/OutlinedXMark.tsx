import { Xmark } from 'commonComponents/Icons/fontawesome/Xmark';
import styles from './styles.css';

const OutlinedXMark = ({ onClick }) => {
  return (
    <div className={styles.xMarkWrapper} onClick={onClick}>
      <Xmark size="sm" className={styles.xMarkIcon} />
    </div>
  );
};

export default OutlinedXMark;
