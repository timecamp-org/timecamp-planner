import { FC, memo, useCallback } from 'react';

import { Id } from 'common/utils/identifier';
import ListContentSkeletonLoader from 'commonComponents/ListContentSkeletonLoader';
import { useTranslation } from 'i18n';
import colors from 'styles/colors.css';

import SpaceNavLink from '../SpaceNavLink';

import useComponent from './hook';
import styles from './styles.css';

type SpaceNavLinkListInterface = {};

const defaultProps = {};

const SpaceNavLinkList: FC<SpaceNavLinkListInterface> = (props) => {
  const { t } = useTranslation();
  const hook = useComponent();

  const renderSpaceLink = useCallback(
    (spaceId: Id) => (
      <SpaceNavLink spaceId={spaceId} key={spaceId} isSelected={hook.isSelected(spaceId)} maxTextLength={20} />
    ),
    [hook.isSelected],
  );

  if (!hook.isRequestFinished) {
    return renderSkeleton();
  }

  return (
    <div className={styles.Component}>
      {hook.isEmptySpacesVisible && renderNoSpacesHint(t)}
      {hook.spaceList.map(renderSpaceLink)}
    </div>
  );
};

function renderNoSpacesHint(t) {
  return <span className={styles.noSpacesHint}>{t(`You don't belong to any project yet`)}</span>;
}

function renderSkeleton() {
  return (
    <div className={styles.skeletonWrapper}>
      <ListContentSkeletonLoader backgroundColor={colors.darkTwoColor} foregroundColor={colors.duskColor} />
    </div>
  );
}

SpaceNavLinkList.defaultProps = defaultProps;

export default memo(SpaceNavLinkList);
