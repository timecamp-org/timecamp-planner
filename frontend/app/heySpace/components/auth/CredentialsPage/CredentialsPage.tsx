//@ts-nocheck
import { ReactNode } from 'react';

import { useSelector } from 'react-redux';

import NotSupportedBrowser from 'commonComponents/NotSupportedBrowser';
import { selectDoUserWantToUseNotSupportedBrowser } from 'models/domain/AppModel/selectors';

import styles from './styles.css';
import { useSupportedDesktopBrowser } from './useSupportedDesktop';

interface CredentialsPageInterface {
  leftSideRenderer?: () => ReactNode;
  rightSideRenderer?: () => ReactNode;
}

const CredentialsPage = ({ leftSideRenderer, rightSideRenderer }: CredentialsPageInterface) => {
  const doUserWantToUseNotSupportedBrowser = useSelector(selectDoUserWantToUseNotSupportedBrowser);
  const { isSupportedDesktopBrowser } = useSupportedDesktopBrowser();
  const shouldRenderContent = isSupportedDesktopBrowser || doUserWantToUseNotSupportedBrowser;

  return (
    <div className={styles.Component}>
      {leftSideRenderer && <div className={styles.left}>{leftSideRenderer?.()}</div>}

      <div className={styles.right}>{shouldRenderContent ? rightSideRenderer?.() : <NotSupportedBrowser />}</div>
    </div>
  );
};

export default CredentialsPage;
