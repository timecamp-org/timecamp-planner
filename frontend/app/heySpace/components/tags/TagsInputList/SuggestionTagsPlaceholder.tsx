import { Box, SxProps } from '@mui/material';
import { Folder } from 'commonComponents/Icons/fontawesome/Folder';

const placeholderStyles: SxProps = {
  height: '100%',
  flex: 1,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const SuggestionTagsPlaceholder = () => {
  return (
    <Box sx={placeholderStyles}>
      <Folder />
    </Box>
  );
};

export default SuggestionTagsPlaceholder;
