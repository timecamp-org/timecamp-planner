import { FC } from 'react';

import styled from '@emotion/styled';
import { Checkbox } from '@mui/material';

import { useTranslation } from 'common/i18n';

const StyledCheckbox = styled(Checkbox)`
  padding: 0.5rem;
  font-size: 1.6rem;
`;

const NoTemplatesInfo = styled.span`
  color: var(--color-gray-500);
`;

const StyledLabel = styled.label`
  margin-left: 0;
  text-align: center;
  display: inline-block;
  line-height: 1;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  text-align: center;
`;

interface CrateTasksCheckboxInterface {
  hasTasks: boolean;
  shouldCreateTasks: boolean;
  onChangeShouldCrateTasks: (shouldCreateWitchTasks) => void;
}

export const CrateTasksCheckbox: FC<CrateTasksCheckboxInterface> = ({
  hasTasks,
  onChangeShouldCrateTasks: onChangeShouldCrateWitchTasks,
  shouldCreateTasks: shouldCreateWithTasks,
}) => {
  const { t } = useTranslation();
  const onChange = () => {
    onChangeShouldCrateWitchTasks(!shouldCreateWithTasks);
  };

  return hasTasks ? (
    <Wrapper>
      <StyledCheckbox checked={shouldCreateWithTasks} onChange={onChange} id={t('Create project with tasks')} />
      <StyledLabel htmlFor={t('Create project with tasks')}>{t('Create project with tasks')}</StyledLabel>
    </Wrapper>
  ) : (
    <NoTemplatesInfo>{t('Template without tasks')}</NoTemplatesInfo>
  );
};
