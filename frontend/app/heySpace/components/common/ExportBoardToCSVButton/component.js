import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.css';
import { useTranslation } from 'i18n';
import { doNothing } from 'common/utils';

import SecondaryButton from 'components/buttons/SecondaryButton';
import { CSVFile } from 'commonComponents/Icons';
import TooltipedDisabledFreePlanElement from 'commonComponents/TooltipedDisabledFreePlanElement';
import TooltipedHoveredComponent from 'commonComponents/TooltipedHoveredComponent';

ExportBoardToCSVButton.propTypes = {
  className: PropTypes.string,
  color: PropTypes.string,
  iconWidth: PropTypes.number,
  iconHeight: PropTypes.number,
  onOpenModal: PropTypes.func,
};

ExportBoardToCSVButton.defaultProps = {
  onOpenModal: doNothing,
};

function ExportBoardToCSVButton(props) {
  const { t } = useTranslation();

  return (
    <>
      <TooltipedDisabledFreePlanElement>
        {(isDisabled) => (
          <TooltipedHoveredComponent
            isDisabled={isDisabled || props.isDownloadModalOpened}
            message={t('Export board tasks to CSV')}
          >
            <SecondaryButton
              className={props.className}
              isDisabled={isDisabled}
              color={props.color}
              onClick={props.onOpenModal}
            >
              <CSVFile width={props.iconWidth} height={props.iconHeight} />
              <div className={styles.buttonText}>{t('Export to CSV')}</div>
            </SecondaryButton>
          </TooltipedHoveredComponent>
        )}
      </TooltipedDisabledFreePlanElement>
    </>
  );
}

export default ExportBoardToCSVButton;
