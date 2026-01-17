import React from 'react';

import { useSelector } from 'common/hooks/useSelector';
import { Id } from 'common/utils/identifier';
import { selectExtensionIdsByType } from 'models/domain/ExtensionsModel/selectors/domain';
import { ExtensionType } from 'models/domain/ExtensionsModel/types';

import { Addon } from '../Addon';

import styles from './styles.css';

interface AddonList {
  projectId: Id;
}

export const AddonList: React.FC<AddonList> = ({ projectId }) => {
  const extensionIds = useSelector((state) => selectExtensionIdsByType(state, { type: ExtensionType.INTERNAL }));

  return (
    <div className={styles.list}>
      {extensionIds.map((extensionId) => (
        <Addon key={extensionId} extensionId={extensionId} projectId={projectId} />
      ))}
    </div>
  );
};
