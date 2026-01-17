import { FC } from 'react';

import { Button } from '@mui/material';

import { doNothing } from 'common/utils';
import { Id } from 'common/utils/identifier';
import ColoredProjectIcon from 'commonComponents/ColoredProjectIcon';
import { useTranslation } from 'i18n';
import { TranslateFunction } from 'i18n/types';

import ProjectName from '../../projects/projectName/ProjectName';

import { useComponent } from './hook';
import styles from './styles.css';

export enum SpaceRowType {
  JOINABLE,
  JOINED,
  ARCHIVED,
}

export type BrowseSpacesSpaceRowInterface = {
  type: SpaceRowType;
  spaceId: Id;
  onClick: VoidFunction;
};

const defaultProps = {
  onClick: doNothing,
};

const BrowseSpacesSpaceRow: FC<BrowseSpacesSpaceRowInterface> = (props) => {
  const { t } = useTranslation();
  const { onClick } = useComponent(props);

  return (
    <div className={styles.searchRow} onClick={onClick}>
      <ColoredProjectIcon projectId={props.spaceId} />
      <ProjectName projectId={props.spaceId} className={styles.searchRowSpaceName} />
      <Button size="small" className={styles.joinButton}>
        {getLabel(props.type, t)}
      </Button>
    </div>
  );
};

function getLabel(type: SpaceRowType, t: TranslateFunction) {
  switch (type) {
    case SpaceRowType.JOINED: {
      return t('Go to project');
    }

    case SpaceRowType.ARCHIVED: {
      return t('Unarchive');
    }

    case SpaceRowType.JOINABLE:
    default: {
      return t('Join project');
    }
  }
}

BrowseSpacesSpaceRow.defaultProps = defaultProps;
export default BrowseSpacesSpaceRow;
