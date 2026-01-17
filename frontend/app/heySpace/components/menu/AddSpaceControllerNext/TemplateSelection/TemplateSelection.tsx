import { FC, useEffect, useState } from 'react';

import { Button } from '@mui/material';

import { Id } from 'common/utils/identifier';
import { ArrowLeft } from 'commonComponents/Icons/fontawesome/ArrowLeft';
import BoardSkeletonLoader from 'commonComponents/skeletons/BoardSkeletonLoader';
import { useTranslation } from 'i18n';
import { head, isEmpty } from 'lodash';

import { useTemplateData } from '../hooks/useTemplateData';
import { TemplatePreview } from '../TemplatePreview/TemplatePreview';
import { ProjectTemplateInterface } from '../types';

import { CrateTasksCheckbox } from './components/CrateTasksChackbox';
import { TemplateList } from './components/TemplateList';
import {
  BackButton,
  ListHeader,
  ListSection,
  ListTitle,
  ListWrapper,
  PreviewHeader,
  PreviewSection,
  PreviewTitle,
  PreviewWrapper,
  TemplateSelectionFooter,
  Wrapper,
} from './styled';

export interface TemplateSelectionInterface {
  onCancel: () => void;
  onCreateProject: (config: { templateId: Id; shouldCreateTasks: boolean }) => void;
  isCreatingProject: boolean;
}

export const TemplateSelection: FC<TemplateSelectionInterface> = ({ onCancel, onCreateProject, isCreatingProject }) => {
  const { allTemplates, globalTemplates, organizationTemplates } = useTemplateData();
  const [currentTemplate, setCurrentTemplate] = useState<ProjectTemplateInterface | null>(null);
  const [shouldCreateTasks, setShouldCreateTasks] = useState(false);
  const { t } = useTranslation();

  const onUseTemplateClick = () => {
    if (currentTemplate) {
      onCreateProject({ templateId: currentTemplate.id, shouldCreateTasks });
    }
  };

  const onSelectTemplateButtonClick = (templateId: string) => {
    const template = allTemplates.find(({ id }) => id === templateId);
    setCurrentTemplate(template);
  };

  useEffect(() => {
    if (!currentTemplate) {
      const initialTemplate = head(globalTemplates) || head(organizationTemplates);
      setCurrentTemplate(initialTemplate);
    }
  }, [currentTemplate, globalTemplates, organizationTemplates]);

  const hasGlobalTemplates = !isEmpty(globalTemplates);
  const hasOrganizationTemplates = !isEmpty(organizationTemplates);
  const hasCurrentTemplateTasks = !isEmpty(head(currentTemplate?.taskListTemplates)?.taskTemplates) ?? false;

  return (
    <Wrapper>
      <ListSection>
        <div>
          <BackButton onClick={onCancel}>
            <ArrowLeft />
          </BackButton>
          <ListHeader>{t('Start with template to build your project or workflow')}</ListHeader>
        </div>
        <ListWrapper>
          {hasGlobalTemplates && (
            <TemplateList
              templates={globalTemplates}
              onTemplateSelect={onSelectTemplateButtonClick}
              selectedTemplateId={currentTemplate?.id}
              header={<ListTitle>{t('Recommended')}</ListTitle>}
            />
          )}
          {hasOrganizationTemplates && (
            <TemplateList
              templates={organizationTemplates}
              onTemplateSelect={onSelectTemplateButtonClick}
              selectedTemplateId={currentTemplate?.id}
              header={<ListTitle>{t('Saved')}</ListTitle>}
            />
          )}
        </ListWrapper>
      </ListSection>
      <PreviewSection>
        <PreviewHeader>{currentTemplate?.name || t('Select template')}</PreviewHeader>
        <PreviewTitle>{currentTemplate?.description}</PreviewTitle>
        <PreviewWrapper>
          {currentTemplate ? <TemplatePreview template={currentTemplate} /> : <BoardSkeletonLoader />}
        </PreviewWrapper>
        <TemplateSelectionFooter>
          <CrateTasksCheckbox
            hasTasks={hasCurrentTemplateTasks}
            shouldCreateTasks={shouldCreateTasks}
            onChangeShouldCrateTasks={setShouldCreateTasks}
          />
          <Button disabled={isCreatingProject || !currentTemplate} onClick={onUseTemplateClick}>
            {t(isCreatingProject ? 'Creating' : 'Use template')}
          </Button>
        </TemplateSelectionFooter>
      </PreviewSection>
    </Wrapper>
  );
};
