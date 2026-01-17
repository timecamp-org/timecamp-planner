import { Box, SxProps } from '@mui/material';
import { TagInterface } from 'models/domain/TagsModel/types';
import { CSSProperties } from 'react';

import SuggestionTag from './SuggestionTag';
import SuggestionTagsPlaceholder from './SuggestionTagsPlaceholder';

const tagsListStyles: SxProps = {
  margin: 0,
  overflowY: 'auto',
  transform: 'translateZ(0)',
  listStyleType: 'none',
  width: '100%',
  padding: '0 1rem 0 0.8rem',
  display: 'flex',
  flexDirection: 'column',
};

type TagsListProps = {
  tags: TagInterface[];
  onTagDetach?: (tagId: string) => void;
  onTagAttach?: (tagId: string) => void;
  style?: CSSProperties;
  placeholder?: boolean;
};

const TagsList = ({ tags, onTagDetach, onTagAttach, placeholder = true, style = {} }: TagsListProps) => {
  return (
    <Box sx={tagsListStyles} style={style}>
      {!tags.length
        ? placeholder && <SuggestionTagsPlaceholder />
        : tags.map((myTag) => {
            return (
              <SuggestionTag
                key={myTag.id}
                suggestion={myTag}
                isSelected={onTagAttach ? false : true}
                onSelect={onTagAttach}
                onRemove={onTagDetach}
              />
            );
          })}
    </Box>
  );
};

export default TagsList;
