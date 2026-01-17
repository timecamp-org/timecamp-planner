import { useState, useEffect } from 'react';

import { useDispatch } from 'react-redux';

import { useParamsSelector } from 'common/hooks/useParamsSelector';
import usePrevious from 'common/hooks/usePrevious';
import { useSelector } from 'common/hooks/useSelector';
import {
  onSetIsExtensionEnabledForSpace,
  onSetIsExtensionEnabledForOrganization,
  onSetExtensionEnabledStatus,
} from 'models/domain/ExtensionsModel/actions';
import {
  selectExtensionName,
  selectExtensionDescription,
  selectIsExtensionEnabled,
  selectExtensionNamespace,
  selectIsExtensionEnabledForOrganization,
  selectIsExtensionEnabledForAllSpaces,
} from 'models/domain/ExtensionsModel/selectors/domain';
import { EnabledStatus } from 'models/domain/ExtensionsModel/types';
import { selectCurrentOrganizationId } from 'models/domain/OrganizationsModel/selectors/domain';
import { selectProjectColor } from 'models/domain/ProjectsModel/selectors';

import { AddonInterface } from '.';

interface AddonHookInterface {
  name: string;
  description: string;
  projectColor: string;
  isEnabled: boolean;
  isEnabledForAllSpaces: boolean;
  onToggleExtensionEnabled: VoidFunction;
}

export const useComponent = ({ extensionId, projectId }: AddonInterface): AddonHookInterface => {
  const name = useParamsSelector(selectExtensionName, { extensionId });
  const description = useParamsSelector(selectExtensionDescription, {
    extensionId,
  });
  const extensionNamespace = useParamsSelector(selectExtensionNamespace, {
    extensionId,
  });

  const projectColor = useParamsSelector(selectProjectColor, { projectId });

  const organizationId = useSelector(selectCurrentOrganizationId);

  const isEnabled = useSelector((state) =>
    selectIsExtensionEnabled(state, {
      organizationId,
      projectId,
      extensionNamespace,
    })
  );
  const isEnabledForAllSpaces = useSelector((state) =>
    selectIsExtensionEnabledForAllSpaces(state, {
      organizationId,
      extensionNamespace,
    })
  );
  const prevIsEnabled = usePrevious(isEnabled);

  const isEnabledForOrganization = useSelector((state) =>
    selectIsExtensionEnabledForOrganization(state, {
      organizationId,
      extensionId,
    })
  );

  const [isEnabledLocal, setIsEnabled] = useState(isEnabled);

  const dispatch = useDispatch();

  const onToggleExtensionEnabled = () => {
    setIsEnabled((prevIsEnabledLocal) => !prevIsEnabledLocal);

    if (!isEnabledForOrganization) {
      dispatch(onSetIsExtensionEnabledForOrganization(extensionId, organizationId, true));
    }
    if (isEnabled && isEnabledForAllSpaces) {
      dispatch(onSetExtensionEnabledStatus(extensionId, organizationId, EnabledStatus.ENABLE_FOR_SPECIFIC_SPACES));
    }
    dispatch(onSetIsExtensionEnabledForSpace(extensionId, projectId, !isEnabled));
  };

  useEffect(() => {
    if (prevIsEnabled !== isEnabled) {
      setIsEnabled(isEnabled);
    }
  }, [prevIsEnabled, isEnabled]);

  return {
    name,
    description,
    projectColor,
    isEnabled: isEnabledLocal,
    isEnabledForAllSpaces,
    onToggleExtensionEnabled,
  };
};
