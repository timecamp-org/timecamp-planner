import { FC } from 'react';

import { Box, SxProps } from '@mui/material';

import OutlinedXMark from 'commonComponents/OutlinedXMark';
import Tag from 'components/tags/Tag';

import styles from './styles.css';

type SuggestionTagInterface = {
  suggestion: any;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  onRemove?: (id: string) => void;
};

const suggestionStyles: SxProps = {
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  padding: '0.7rem 1rem',
  margin: 0,
  borderRadius: '8px',
  ':hover': {
    backgroundColor: 'var(--color-gray-200)',
  },
};

const SuggestionTag: FC<SuggestionTagInterface> = ({ suggestion, isSelected, onSelect, onRemove }) => {
  const { id } = suggestion;

  return (
    <Box key={id} sx={suggestionStyles} onClick={() => onSelect?.(id)}>
      <Tag className={isSelected ? styles.suggestedTagActive : styles.suggestedTag} tagId={id} isDeletable={false} />
      {onRemove && (
        <OutlinedXMark
          onClick={(e) => {
            onRemove?.(id);
            e.stopPropagation();
          }}
        />
      )}
    </Box>
  );
};

export default SuggestionTag;
