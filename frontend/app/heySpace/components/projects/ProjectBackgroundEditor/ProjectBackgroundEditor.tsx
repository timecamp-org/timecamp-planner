import { Button } from '@mui/material';

import ProjectColors from 'commonStyles/projectColors';
import ProjectColorDot from 'components/projects/ProjectColorDot/component';
import { useTranslation } from 'i18n';
import { onBackgroundUpdate } from 'models/domain/ProjectsModel/actions';
import { useDispatch } from 'react-redux/es/exports';

import styles from './styles.css';
import UploadBackgroundButton from './UploadBackgroundButton';
import { useProjectBackground } from './useProjectBackground';

interface ProjectBackgroundEditorInterface {
  projectId: string;
  className: string;
  isDisabled: boolean;
}

const ProjectBackgroundEditor = (props: ProjectBackgroundEditorInterface) => {
  const { background, onSetBackground } = useProjectBackground(props.projectId);
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const hasBackground = !!background;
  const onUnsetBackgroundClick = () => {
    dispatch(onBackgroundUpdate(props.projectId, ''));
  };

  return (
    <div className={props.className ? props.className : styles.Component} tabIndex={-1}>
      <div className={styles.colorOptions}>
        {ProjectColors.getProjectColors().map((color) => (
          <div key={color} onClick={() => onSetBackground(color)}>
            <ProjectColorDot
              className={color === background ? styles.selectedColorDot : styles.colorDot}
              innerClassName={styles.innerDot}
              projectColor={color}
              disabled={props.isDisabled}
              shouldRenderTick={color === background}
              shouldRenderInnerRing={false}
            />
          </div>
        ))}
      </div>
      <UploadBackgroundButton projectId={props.projectId} />
      {hasBackground && (
        <Button variant="text" onClick={onUnsetBackgroundClick}>
          {t('Unset background')}
        </Button>
      )}
    </div>
  );
};

export default ProjectBackgroundEditor;
