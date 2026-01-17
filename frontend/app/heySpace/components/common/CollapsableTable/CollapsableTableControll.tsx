import { Box, styled } from '@mui/material';
import { Pen } from 'commonComponents/Icons/fontawesome/Pen';
import { TrashCan } from 'commonComponents/Icons/fontawesome/TrashCan';
import { FC } from 'react';

import styles from './styles.css';

interface CollapsableTableControllInterface {
  onDelete: () => void;
  onEdit: () => void;
}

const CollapsableTableControllWrapper = styled(Box)`
  display: flex;
  gap: 2rem;
  justify-content: flex-end;
`;

const CollapsableTableControll: FC<CollapsableTableControllInterface> = ({ onDelete, onEdit }) => {
  return (
    <CollapsableTableControllWrapper>
      <Pen className={styles.controllIcon} onClick={onEdit} />
      <TrashCan className={styles.controllIcon} onClick={onDelete} />
    </CollapsableTableControllWrapper>
  );
};

export default CollapsableTableControll;
