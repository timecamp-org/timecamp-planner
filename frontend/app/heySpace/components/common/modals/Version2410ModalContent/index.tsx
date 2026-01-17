import React from 'react';
import { useTranslation } from '../../../../../common/i18n';
import styles from './styles.css';
import imageUrl from './projectHeaderWithList.png';
import { TranslateFunction } from 'i18n/types';

const Version2410ModalContent = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.component}>
      <p>
        <b>{t('Check out our latest changes.')}</b>
      </p>
      <br />

      {renderPremiumContent(t)}
    </div>
  );
};

function renderPremiumContent(t: TranslateFunction) {
  return (
    <>
      <p>
        <b>{t(`We've introduced a new list view in our Premium Plan, and we invite you to test it.`)}</b>
      </p>
      <br />
      <img src={imageUrl} />
      <br />
      <p>{t('We are changing the maximum number of users in the Free Plan from 10 to 5.')}</p>
      <br />
      <p>{t(`Premium features, such as Timeline and Project Folders, are no longer available to free users.`)}</p>
    </>
  );
}

export default Version2410ModalContent;
