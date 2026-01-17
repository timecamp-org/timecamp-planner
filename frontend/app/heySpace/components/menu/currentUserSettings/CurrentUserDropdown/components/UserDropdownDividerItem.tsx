import { Divider } from '@mui/material';
import styles from '../styles.css';

const UserDropdownDividerItem = () => (
  <div className={styles.dividerWrapper}>
    <Divider
      sx={{
        margin: 0,
      }}
    />
  </div>
);

export default UserDropdownDividerItem;
