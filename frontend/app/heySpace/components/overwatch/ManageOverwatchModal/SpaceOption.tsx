import Checkbox from 'commonComponents/Checkbox';

import ProjectName from '../../projects/projectName/ProjectName';

import { Id } from 'common/utils/identifier';
import CircleProjectIcon from 'commonComponents/CircleProjectIcon/CircleProjectIcon';
import { FC } from 'react';
import styles from './styles.css';

interface SpaceOptionInterface {
  isSelected: boolean;
  spaceId: Id;
  onClick: () => void;
}

const SpaceOption: FC<SpaceOptionInterface> = ({ isSelected, spaceId, onClick }) => {
  return (
    <div className={styles.spaceItem} key={spaceId} onClick={onClick}>
      <Checkbox isChecked={isSelected} className={styles.optionCheckbox} />
      <CircleProjectIcon projectId={spaceId} />

      <ProjectName
        // @ts-ignore
        className={styles.spaceLabel}
        projectId={spaceId}
      />
    </div>
  );
};

export default SpaceOption;
