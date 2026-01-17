import { Fragment } from 'react';

import { Button } from '@mui/material';
import PropTypes from 'prop-types';
import ProgressiveImage from 'react-progressive-image';

import { doNothing } from 'common/utils';
import InfoTooltip from 'commonComponents/InfoTooltip';
import CalendarSyncExtensionSettings from 'components/extensions/CalendarSyncExtensionSettings';
import ExtensionItemSettings from 'components/extensions/ExtensionItemSettings';
import OAuth1AuthorizedDataImportSettings from 'components/extensions/OAuth1AuthorizedDataImportSettings';
import { useTranslation } from 'i18n';
import { ExtensionNamespace } from 'models/domain/ExtensionsModel/types';
import { TRELLO } from 'models/domain/OAuthModel/constants/oauth1AuthorizedApplications';

import styles from './styles.css';

ExtensionItem.propTypes = {
  className: PropTypes.string,
  isExtensionEnabled: PropTypes.bool,
  extensionName: PropTypes.string,
  extensionDescription: PropTypes.string,
  extensionThumbnailUrl: PropTypes.string,
  hasAccessToExtension: PropTypes.bool,
  isHoveringNoAccessWrapper: PropTypes.bool,

  onEnableExtensionEnabledForOrganization: PropTypes.func,
  onDisableExtensionEnabledForOrganization: PropTypes.func,
  onSetIsHoveringNoAccessWrapper: PropTypes.func,
};

ExtensionItem.defaultProps = {
  isExtensionEnabled: false,
  hasAccessToExtension: true,
  isHoveringNoAccessWrapper: false,

  onEnableExtensionEnabledForOrganization: doNothing,
  onDisableExtensionEnabledForOrganization: doNothing,
  onSetIsHoveringNoAccessWrapper: doNothing,
};

const transitionDuration = 100;

function ExtensionItem(props) {
  const { t } = useTranslation();
  if (!props.hasAccessToExtension) {
    return haveNoAccessWrapper(renderExtension());
  }

  return renderExtension();

  function haveNoAccessWrapper(targetComponent) {
    return (
      <div className={styles.noAccessWrapper}>
        <InfoTooltip
          shouldRenderInfoTooltip={props.isHoveringNoAccessWrapper}
          popperPlacement={'bottom'}
          targetComponent={targetComponent}
          message={t(`To use our awesome {{extensionName}} upgrade to Premium!`, {
            extensionName: props.extensionName,
          })}
          transitionDuration={transitionDuration}
        />
        <div
          className={styles.backdrop}
          onMouseEnter={() => props.onSetIsHoveringNoAccessWrapper(true)}
          onMouseLeave={() => props.onSetIsHoveringNoAccessWrapper(false)}
        ></div>
      </div>
    );
  }

  function renderExtension() {
    return (
      <div className={props.className || styles.Component}>
        <div className={styles.imageWrapper}>
          <ProgressiveImage src={props.extensionThumbnailUrl}>{renderImage}</ProgressiveImage>
        </div>
        <div className={styles.extensionInfo}>
          <div className={styles.extensionName}>{t(props.extensionName)}</div>
          <div className={styles.extensionDescription}>{t(props.extensionDescription)}</div>
          {renderExtensionSettings()}
        </div>
      </div>
    );
  }

  function renderExtensionSettings() {
    switch (props.extensionNamespace) {
      case ExtensionNamespace.CALENDAR_SYNC:
        return <CalendarSyncExtensionSettings extensionId={props.extensionId} />;
      case ExtensionNamespace.TRELLO_DATA_IMPORT: {
        return (
          <OAuth1AuthorizedDataImportSettings
            extensionId={props.extensionId}
            oauth1AuthorizedApplicationName={TRELLO}
          />
        );
      }
      default:
        return renderDefaultExtensionSettings();
    }
  }

  function renderDefaultExtensionSettings() {
    return (
      <Fragment>
        <ExtensionItemSettings className={styles.extensionSettings} extensionId={props.extensionId} />
        {props.isExtensionEnabled ? (
          <Button className={styles.extensionDisableButton} onClick={props.onDisableExtensionEnabledForOrganization}>
            {t('Remove from Planner')}
          </Button>
        ) : (
          <Button className={styles.extensionEnableButton} onClick={props.onEnableExtensionEnabledForOrganization}>
            {t('Add to Planer')}
          </Button>
        )}
      </Fragment>
    );
  }
}

function renderImage(src, loading) {
  return loading ? (
    <div className={styles.imagePlacegolder}></div>
  ) : (
    <img src={src} className={styles.extensionThumbnail} />
  );
}

export default ExtensionItem;
