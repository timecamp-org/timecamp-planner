import styled from 'styles/styled';
import { Box, SxProps } from '@mui/material';
import UnderlinedDropdown from 'commonComponents/UnderlinedDropdown/UnderlinedDropdown';
import { useTranslation } from 'i18n';
import { FC } from 'react';
import { Views } from 'react-big-calendar';
import { ToolbarWrapperInterface } from './types';

interface ViewsToolbarInterface extends Pick<ToolbarWrapperInterface, 'currentView' | 'onSetCurrentView'> {}

const ToolbarLabel = styled.span`
  margin-bottom: 0.5rem;
`;

const toolbarWrapperStyles: SxProps = {
  marginLeft: 'auto',
  display: 'flex',
  alignItems: 'flex-end',
  gap: '1rem',
};

const ToolbarViews: FC<ViewsToolbarInterface> = ({ currentView, onSetCurrentView }) => {
  const { t } = useTranslation();

  const labels = {
    [Views.WEEK]: t('Week'),
    [Views.MONTH]: t('Month'),
  };

  return (
    <Box sx={toolbarWrapperStyles}>
      <ToolbarLabel>{t('View')}:</ToolbarLabel>
      <div>
        <UnderlinedDropdown
          label={labels[currentView]}
          items={[
            {
              label: labels[Views.WEEK],
              isSelected: currentView === Views.WEEK,
              props: {
                onClick: () => onSetCurrentView(Views.WEEK),
              },
            },
            {
              label: labels[Views.MONTH],
              isSelected: currentView === Views.MONTH,
              props: {
                onClick: () => onSetCurrentView(Views.MONTH),
              },
            },
          ]}
        />
      </div>
    </Box>
  );
};

export default ToolbarViews;
