import { i18mark } from 'i18n';
import { HumanMessage } from 'models/domain/HumanMessageModel/models';
import { HumanMessageKind } from 'models/domain/HumanMessageModel/types';

import { ProjectTemplateInterface } from '../types';

import { useTemplateData } from './useTemplateData';

const nameTakenError = HumanMessage({
  text: i18mark('This name is already taken, try something else'),
  kind: HumanMessageKind.error,
});

const nameToShortError = HumanMessage({
  text: i18mark('Name is required'),
  kind: HumanMessageKind.error,
});

export const useValidateTemplate = () => {
  const { organizationTemplates } = useTemplateData();

  const checkTemplateNameAvailability = (templateName: string) =>
    !organizationTemplates.find(({ name }) => name === templateName);

  const validateTemplate = ({ name }: Pick<ProjectTemplateInterface, 'name'>) => {
    if (name.length < 1) {
      return {
        isValid: false,
        error: nameToShortError,
      };
    } else if (!checkTemplateNameAvailability(name)) {
      return {
        isValid: false,
        error: nameTakenError,
      };
    } else {
      return { isValid: true };
    }
  };

  return validateTemplate;
};
