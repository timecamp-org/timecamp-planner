import styled from 'styles/styled';
import { Box, Button, SxProps } from '@mui/material';
import { useTranslation } from 'i18n';
import { FC } from 'react';

const wrapperStyles: SxProps = {
  display: 'flex',
  alignItems: 'center',
  padding: '0 1rem',
};

const buttonStyles: SxProps = {
  marginLeft: 'auto',
};

const ProjectsHeader = styled.h4`
  margin-left: 1rem;
  font-weight: var(--fontWeight-semibold);
`;

interface ToolbarInterface {
  onSelectAllProjects: () => void;
  onDeselectAllProjects: () => void;
}

const Toolbar: FC<ToolbarInterface> = ({ onDeselectAllProjects, onSelectAllProjects }) => {
  const { t } = useTranslation();
  return (
    <Box sx={wrapperStyles}>
      <ProjectsHeader>{t('SELECT PROJECTS')}:</ProjectsHeader>

      <Button variant="text" sx={buttonStyles} onClick={onSelectAllProjects}>
        {t('Select all')}
      </Button>
      <Button variant="text" onClick={onDeselectAllProjects}>
        {t('Clear all')}
      </Button>
    </Box>
  );
};

export default Toolbar;
