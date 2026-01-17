import { FC } from 'react';

import { ProjectCreationControllerInterface } from './hooks/useProjectCreationController';
import { ProjectCreationStep } from './hooks/useProjectCreationStep';
import ProjectData from './ProjectData';
import { TemplateSelection } from './TemplateSelection/TemplateSelection';
import { WorkflowSelector } from './WorkflowSelector/WorkflowSelector';

interface AddProjectControllerInterface {
  hook: ProjectCreationControllerInterface;
}

export const AddProjectController: FC<AddProjectControllerInterface> = ({
  hook: {
    step,
    projectData,
    isCreatingProject,
    onCreateEmptyProject,
    onShowProjectDetails,
    onShowTemplates,
    onShowWorkflowSelect,
    onSubmitDetails,
    onCreateProjectFromTemplate,
    onCancel,
  },
}) => {
  switch (step) {
    case ProjectCreationStep.DETAILS:
      return <ProjectData onSubmit={onSubmitDetails} initialData={projectData} onCancel={onCancel} />;
    case ProjectCreationStep.WORKFLOW:
      return (
        <WorkflowSelector
          onCreateEmptyProject={onCreateEmptyProject}
          onGoBack={onShowProjectDetails}
          onOpenTemplateSelection={onShowTemplates}
        />
      );
    case ProjectCreationStep.TEMPLATE:
      return (
        <TemplateSelection
          onCancel={onShowWorkflowSelect}
          onCreateProject={onCreateProjectFromTemplate}
          isCreatingProject={isCreatingProject}
        />
      );
    default:
      return null;
  }
};
