import { FC } from 'react';

import { Button } from '@mui/material';

import { Plus } from 'commonComponents/Icons/fontawesome/Plus';
import { Rocket } from 'commonComponents/Icons/fontawesome/Rocket';
import ProgressSteps from 'commonComponents/ProgressSteps/component';
import { useTranslation } from 'i18n';

import { ButtonBox, ButtonSubTitle, ButtonTitle, WorkflowButton, Wrapper } from './styled';

export interface WorkflowSelectorInterface {
  onCreateEmptyProject: () => void;
  onOpenTemplateSelection: () => void;
  onGoBack: () => void;
}

const IconColor = 'var(--color-primary-500)';

export const WorkflowSelector: FC<WorkflowSelectorInterface> = ({
  onCreateEmptyProject,
  onGoBack,
  onOpenTemplateSelection,
}) => {
  const { t } = useTranslation();

  return (
    <Wrapper>
      <p>{t('Select workflow template to quickly set up your project board:')}</p>
      <ButtonBox>
        <WorkflowButton onClick={onCreateEmptyProject}>
          <Plus color={IconColor} size="3x" />
          <ButtonTitle>{t('Empty')}</ButtonTitle>
          <ButtonSubTitle>{t('create your own workflow')}</ButtonSubTitle>
        </WorkflowButton>
        <WorkflowButton onClick={onOpenTemplateSelection}>
          <Rocket color={IconColor} size="3x" />
          <ButtonTitle>{t('Template')}</ButtonTitle>
          <ButtonSubTitle>{t('choose from library')}</ButtonSubTitle>
        </WorkflowButton>
      </ButtonBox>
      <ProgressSteps currentStep={2} stepsCount={2} />
      <Button variant="text" onClick={onGoBack}>
        {t('Back')}
      </Button>
    </Wrapper>
  );
};
