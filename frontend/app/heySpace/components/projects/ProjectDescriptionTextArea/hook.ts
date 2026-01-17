import {
  ChangeEvent,
  ChangeEventHandler,
  useCallback,
  useState,
  FocusEvent,
  FocusEventHandler,
} from 'react';

import { useDataProvider, useDataPersister } from './dataHooks';

import { ProjectDescriptionTextAreaInterface } from '.';

export type ProjectDescriptionTextAreaHookInterface = {
  localProjectDescription: string;
  onDescriptionUpdate: ChangeEventHandler;
  onFocusLocal: FocusEventHandler<HTMLTextAreaElement>;
  onBlurLocal: FocusEventHandler<HTMLTextAreaElement>;
};

const useComponent = (
  props: ProjectDescriptionTextAreaInterface
): ProjectDescriptionTextAreaHookInterface => {
  const { projectDescription } = useDataProvider(props);
  const { onPersistProjectUpdate } = useDataPersister(props);
  const [localProjectDescription, onSetLocalProjectDescription] =
    useState<string>(projectDescription);

  const onDescriptionUpdate = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement>) => {
      const text = event.target.value;
      onSetLocalProjectDescription(text);
    },
    []
  );

  const onFocusLocal = useCallback(
    (event: FocusEvent<HTMLTextAreaElement>) => {
      const text = event.target.value;
      onSetLocalProjectDescription(text);
      props.onFocus(event);
    },
    [props.onFocus]
  );

  const onBlurLocal = useCallback(
    (event: FocusEvent<HTMLTextAreaElement>) => {
      if (localProjectDescription !== projectDescription) {
        onPersistProjectUpdate({ description: localProjectDescription });
        props.onBlur(event);
      }
    },
    [localProjectDescription, onPersistProjectUpdate, props.onBlur]
  );

  return {
    localProjectDescription,
    onDescriptionUpdate,
    onFocusLocal,
    onBlurLocal,
  };
};

export default useComponent;
