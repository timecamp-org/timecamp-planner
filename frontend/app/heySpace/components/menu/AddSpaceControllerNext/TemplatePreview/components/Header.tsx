import { FC } from 'react';

import { TemplateProjectIcon } from 'commonComponents/Icons/index-NEW';
import { useTranslation } from 'i18n';

import styles from '../styles.css';
import { TemplatePreviewInterface } from '../TemplatePreview';

export const Header: FC<TemplatePreviewInterface> = ({ template: { color, description, name } }) => {
  const { t } = useTranslation();

  return (
    <div className={styles.header}>
      <div className={styles.leftContainer}>
        <div className={styles.projectNameContainer}>
          <TemplateProjectIcon />
          <p className={styles.projectName}>{name}</p>
          <p className={styles.projectDescription}>{description}</p>
        </div>
      </div>
    </div>
  );
};
