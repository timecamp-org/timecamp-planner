import { FC, useCallback } from 'react';

import { debounce } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';

import { useTranslation } from 'i18n';
import * as TasksActions from 'models/domain/TasksModel/actions';
import { selectTaskDescription } from 'models/domain/TasksModel/selectors';

import { AppMarkupTextEditor } from '../AppMarkupTextEditor';

import styles from './styles.css';

interface CardDescriptionEditorNextInterface {
  taskId: string;
}

export const CardDescriptionEditorNext: FC<CardDescriptionEditorNextInterface> = ({ taskId }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const description = useSelector((state) => selectTaskDescription(state, { taskId }));

  const saveDescription = useCallback(
    (text: string) => dispatch(TasksActions.onTaskUpdate(taskId, { description: text }, true)),
    [dispatch, taskId]
  );

  const saveDescriptionDebounced = useCallback(
    debounce((text: string) => saveDescription(text), 4_000),
    [saveDescription]
  );

  return (
    <AppMarkupTextEditor
      text={description}
      placeholder={t('Add description...')}
      onBlur={saveDescription}
      onDescriptionChange={saveDescriptionDebounced}
      activeClassName={styles.editorActive}
      className={styles.editor}
    />
  );
};
