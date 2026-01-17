import styled from 'styles/styled';
import { Box } from '@mui/material';

import { Tags } from 'commonComponents/Icons/fontawesome/Tags';
import { useTranslation } from 'i18n';

import { Line, Switch } from '../components/styled';

const Text = styled.span`
  margin-left: 1.2rem;
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: flex-start;
`;

export const BillableTimeEntryLine = () => {
  const { t } = useTranslation();

  return (
    <Line>
      <Wrapper>
        <Switch />
        <Text>{t('Billable time entry')}</Text>
      </Wrapper>
      <Box>
        <Tags size="sm" />
      </Box>
    </Line>
  );
};
