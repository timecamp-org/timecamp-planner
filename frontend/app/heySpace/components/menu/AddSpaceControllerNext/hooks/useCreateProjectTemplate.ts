/* eslint-disable consistent-return */
import { useMutation } from 'react-query';
import { useSelector } from 'react-redux';

import { Id } from 'client/src/types';
import { HeySpaceClient } from 'common/services';
import { selectTemplateDataFromProject } from 'models/domain/ProjectsModel/selectors/projectTemplates';

import { useValidateTemplate } from './useValidateTemplate';

interface UseCreateProjectTemplateInterface {
  projectId: Id;
  includeTasks?: boolean;
  onSuccess?: VoidFunction;
  onError?: VoidFunction;
}

export const useCreateProjectTemplate = ({
  onError,
  onSuccess,
  projectId,
  includeTasks,
}: UseCreateProjectTemplateInterface) => {
  const validateTemplate = useValidateTemplate();
  const mutation = useMutation(HeySpaceClient.restApiClient.createTemplate);
  const template = useSelector((state) => selectTemplateDataFromProject(state, { projectId, includeTasks }));

  const saveTemplate = (name: string) => {
    const { isValid } = validateTemplate({ name });
    if (!isValid) {
      return;
    }

    mutation.mutate({ template: { ...template, name }, includeTasks }, { onError, onSuccess });
  };

  const { isLoading } = mutation;

  return {
    isLoading,
    saveTemplate,
  };
};
