/* eslint-disable no-shadow */

import { useMutation } from 'react-query';

import { HeySpaceClient, UserTracker } from 'common/services';
import { AnyDict } from 'common/types';
import { Id } from 'common/utils/identifier';
import { UserTrackerEvent } from 'models/component/UserTrackerEventModel/constants';
import { selectCurrentOrganizationId } from 'models/domain/OrganizationsModel/selectors/domain';
import { onProjectCreate } from 'models/domain/ProjectsModel/actions';
import { ProjectInterface } from 'models/domain/ProjectsModel/types';
import { useDispatch, useSelector } from 'react-redux';

import { ProjectTemplateInterface } from '../types';

import { ProjectCreationStep, useProjectCreationStep } from './useProjectCreationStep';
import { useProjectData } from './useProjectData';

type ProjectDetailsType = Partial<ProjectInterface>;
type OnCreateProjectFromTemplate = (config: { templateId: Id; shouldCreateTasks?: boolean }) => void;

export interface ProjectCreationControllerInterface {
  step: ProjectCreationStep;
  projectData: ProjectDetailsType;
  isCreatingProject: boolean;
  onSubmitDetails: (projectDetails: ProjectDetailsType) => void;
  onCreateProjectFromTemplate: OnCreateProjectFromTemplate;
  onCreateEmptyProject: VoidFunction;
  onShowTemplates: VoidFunction;
  onShowWorkflowSelect: VoidFunction;
  onShowProjectDetails: VoidFunction;
  onCancel: VoidFunction;
}

interface UseProjectCreationControllerInterface {
  onCancel: VoidFunction;
  onSuccess: (data: ProjectTemplateInterface) => void;
  onError: (error: unknown) => void;
}

export const useProjectCreationController = ({
  onCancel,
  onSuccess,
  onError,
}: UseProjectCreationControllerInterface): ProjectCreationControllerInterface => {
  const dispatch = useDispatch();
  const organizationId = useSelector(selectCurrentOrganizationId);
  const { projectData, setProjectData } = useProjectData();
  const { setStep, step } = useProjectCreationStep();
  const { isLoading: isCreatingProject, mutate: creteProject } = useMutation(
    (props: { templateId: string; shouldCreateTasks: boolean; project: AnyDict }) =>
      HeySpaceClient.restApiClient.createProjectFromTemplate(props),
  );

  const onSubmitDetails = (projectData: ProjectDetailsType) => {
    setProjectData(projectData);
    setStep(ProjectCreationStep.WORKFLOW);
  };

  const onCreateEmptyProject = () => {
    dispatch(onProjectCreate(projectData, undefined, false, () => onSuccess(projectData as ProjectTemplateInterface)));
  };

  const onShowTemplates = () => setStep(ProjectCreationStep.TEMPLATE);

  const onShowWorkflowSelect = () => setStep(ProjectCreationStep.WORKFLOW);

  const onShowProjectDetails = () => setStep(ProjectCreationStep.DETAILS);

  const onCreateProjectFromTemplate: OnCreateProjectFromTemplate = ({ templateId, shouldCreateTasks }) => {
    projectData.organizationId = organizationId;
    creteProject({ templateId, shouldCreateTasks, project: projectData }, { onSuccess, onError });

    UserTracker.track(UserTrackerEvent.featureUsed, { name: 'project template' });
  };

  return {
    step,
    projectData,
    isCreatingProject,
    onSubmitDetails,
    onCreateEmptyProject,
    onShowTemplates,
    onShowWorkflowSelect,
    onShowProjectDetails,
    onCreateProjectFromTemplate,
    onCancel,
  };
};
