import { useTranslation } from 'i18n';

import { TaskTEmplateInterface } from '../types';

import { getRandomItems } from './utils';

let tasks: Partial<TaskTEmplateInterface>[];

export const useTaskPlaceholders = () => {
  const { t } = useTranslation();

  if (!tasks?.length) {
    tasks = [
      { name: t('Create Board') },
      { name: t('Add description') },
      { name: t('Set due date') },
      { name: t('Pick priority') },
    ];
  }

  return () => getRandomItems(tasks);
};
