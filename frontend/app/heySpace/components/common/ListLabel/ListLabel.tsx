import OutlinedXMark from 'commonComponents/OutlinedXMark';
import styles from './styles.css';

interface ListLabelInterface {
  label: React.ReactNode;
  onRemove?: () => void;
  className?: string;
}

const ListLabel = ({ label, onRemove, className = '' }: ListLabelInterface) => {
  return (
    <div className={`${styles.assignableLabel} ${className}`}>
      <span className={styles.label}>{label}</span>
      <OutlinedXMark onClick={onRemove} />
    </div>
  );
};

export default ListLabel;
