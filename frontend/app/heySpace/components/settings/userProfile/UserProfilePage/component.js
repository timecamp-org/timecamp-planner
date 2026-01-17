import React from 'react';
import styles from './styles.css';

import UserProfileSettings from '../UserProfileSettings';

function UserProfilePage() {
  UserProfilePage.propTypes = {};

  UserProfilePage.defaultProps = {};

  return (
    <div className={styles.Component}>
      <div className={styles.main}>
        <div className={styles.content}>
          <UserProfileSettings />
        </div>
      </div>
    </div>
  );
}

export default UserProfilePage;
