import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.css';

import colorStyles from 'styles/colors.css';

import { useTranslation } from 'i18n';

FileDragBackdrop.propTypes = {
  color: PropTypes.string,
};

FileDragBackdrop.defaultProps = {
  color: colorStyles.dodgerBlueColor,
};

function FileDragBackdrop(props) {
  const { t } = useTranslation();
  return (
    <div className={styles.dragOver} style={{ borderColor: props.color }}>
      <div className={styles.cloudIcon}>
        <svg xmlns="http://www.w3.org/2000/svg" width="84" height="62" viewBox="0 0 84 62">
          <path
            fill={props.color}
            fillRule="nonzero"
            d="M80.345 34.588c-2.435-3.068-5.548-5.056-9.34-5.966 1.196-1.82 1.793-3.846 1.793-6.077 0-3.112-1.094-5.768-3.28-7.97-2.188-2.201-4.827-3.302-7.92-3.302-2.77 0-5.19.91-7.261 2.73-1.72-4.228-4.47-7.618-8.247-10.172C42.314 1.277 38.15 0 33.6 0c-6.184 0-11.463 2.202-15.838 6.606-4.375 4.402-6.562 9.716-6.562 15.94 0 .381.029 1.013.087 1.893-3.441 1.614-6.183 4.036-8.225 7.265C1.021 34.934 0 38.456 0 42.273c0 5.431 1.918 10.076 5.753 13.936C9.588 60.07 14.204 62 19.6 62h47.6c4.637 0 8.596-1.652 11.878-4.954C82.359 53.744 84 49.76 84 45.091c0-3.934-1.219-7.434-3.655-10.503zM55.583 33.4a1.344 1.344 0 0 1-.984.417h-9.8v15.5c0 .382-.138.712-.415.991-.278.28-.605.418-.984.418H35c-.38 0-.707-.138-.984-.418a1.36 1.36 0 0 1-.416-.99v-15.5h-9.8c-.408 0-.744-.133-1.006-.396-.262-.264-.393-.602-.393-1.013 0-.352.145-.705.437-1.057l15.356-15.455c.263-.265.598-.397 1.006-.397.409 0 .744.132 1.007.397l15.4 15.5c.262.263.392.6.392 1.013 0 .38-.138.712-.415.99z"
          />
        </svg>
      </div>
      <div className={styles.dragOverTitle}>{t('Drag files')}</div>
      <div className={styles.dragOverSubtitle}>{t('Simply drag and drop your files here')}</div>
    </div>
  );
}

export default FileDragBackdrop;
