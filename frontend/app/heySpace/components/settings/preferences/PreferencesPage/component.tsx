import React from 'react';

import Preferences from 'components/settings/preferences/Preferences';

import styles from './styles.css';

function PreferencesPage() {
  return (
    <div className={styles.component}>
      <div className={styles.page}>
        <div className={styles.main}>
          <div className={styles.content}>
            <Preferences />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PreferencesPage;
