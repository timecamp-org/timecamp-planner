/* eslint-disable no-shadow */
import { ChangeEvent, useEffect, useState } from 'react';

import { useDispatch } from 'react-redux';

import { Id } from 'client/src/types';
import { i18mark } from 'common/i18n';
import { useCreateProjectTemplate } from 'components/menu/AddSpaceControllerNext/hooks';
import { useValidateTemplate } from 'components/menu/AddSpaceControllerNext/hooks/useValidateTemplate';
import * as PopUpAlertsModelActions from 'models/component/PopUpAlertsModel/actions';
import { HumanMessage } from 'models/domain/HumanMessageModel/models';
import { HumanMessageKind } from 'models/domain/HumanMessageModel/types';

const errorMessage = HumanMessage({
  kind: HumanMessageKind.error,
  text: i18mark('Template creation error. Try agin later'),
});

const successMessage = HumanMessage({
  kind: HumanMessageKind.success,
  text: i18mark('The template has been created.'),
});

export const useTemplateNameInput = () => {
  const [name, setName] = useState('');
  const validateTemplate = useValidateTemplate();
  const [error, setError] = useState(null);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const validateName = () => {
    const { isValid, error } = validateTemplate({ name });
    setError(error);

    return isValid;
  };

  useEffect(() => {
    if (error) {
      validateName();
    }
  }, [name, error]);

  return {
    error,
    name,
    onChange,
    validateName,
  };
};

interface UseAddProjectTemplateInterface {
  onClose: VoidFunction;
  projectId: Id;
}

export const useAddProjectTemplate = ({ projectId, onClose }: UseAddProjectTemplateInterface) => {
  const dispatch = useDispatch();
  const [includeTasks, setIncludeTasks] = useState(false);
  const { error, name, onChange, validateName } = useTemplateNameInput();
  const { isLoading, saveTemplate } = useCreateProjectTemplate({
    projectId,
    includeTasks,
    onError: () => {
      dispatch(
        PopUpAlertsModelActions.onAddAlert(
          {
            humanMessage: errorMessage,
          },
          projectId
        )
      );
      onClose();
    },
    onSuccess: () => {
      dispatch(
        PopUpAlertsModelActions.onAddAlert(
          {
            humanMessage: successMessage,
          },
          projectId
        )
      );
      onClose();
    },
  });

  const onSave = () => {
    const isValid = validateName();
    if (isValid) {
      saveTemplate(name);
    }
  };

  const toggleIncludeTasks = () => setIncludeTasks((includeTasks) => !includeTasks);

  return {
    onSave,
    isLoading,
    onChange,
    name,
    error,
    includeTasks,
    toggleIncludeTasks,
  };
};
