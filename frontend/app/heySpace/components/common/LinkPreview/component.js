import React, { memo } from 'react';

import PropTypes from 'prop-types';
import ProgressiveImage from 'react-progressive-image';
import SpotifyPlayer from 'react-spotify-player';

import { doNothing } from 'common/utils';
import { Delete } from 'commonComponents/Icons';
import Player from 'commonComponents/Player';
import SecondaryButton from 'components/buttons/SecondaryButton';
import { i18n } from 'i18n';

import styles from './styles.css';

const spotifyPlayerSize = {
  width: 360,
  height: 300,
};

LinkPreview.propTypes = {
  className: PropTypes.string,
  url: PropTypes.string.isRequired,
  linkText: PropTypes.string,
  linkTitle: PropTypes.string,
  imageUrl: PropTypes.string,
  title: PropTypes.string,
  logo: PropTypes.string,
  publisher: PropTypes.string,
  description: PropTypes.string,
  shouldRenderImage: PropTypes.bool,
  shouldRenderPlayer: PropTypes.bool,
  shouldRenderSpotifyPlayer: PropTypes.bool,
  shouldRenderUrl: PropTypes.bool,
  isLoading: PropTypes.bool,
  color: PropTypes.string,
  onClick: PropTypes.func,
  onImageLoadError: PropTypes.func,
};

LinkPreview.defaultProps = {
  shouldRenderImage: false,
  shouldRenderPlayer: false,
  shouldRenderSpotifyPlayer: false,
  shouldRenderUrl: false,
  isLoading: false,
  onClick: doNothing,
  onImageLoadError: doNothing,
};

function LinkPreview(props) {
  return (
    <div className={props.className || styles.Component}>
      {props.shouldRenderUrl && (
        <a
          className={styles.link}
          href={props.url}
          target={'_blank'}
          title={props.linkTitle}
        >
          {props.linkText || props.url}
        </a>
      )}
      {props.isLinkPreviewEnabled ? renderPreview(props) : null}
    </div>
  );
}

function renderPreview(props) {
  return (
    <div
      className={props.title ? styles.previewContainer : ''}
      onMouseEnter={props.onPreviewMouseEnter}
      onMouseLeave={props.onPreviewMouseLeave}
    >
      {props.shouldRenderDeleteIcon && renderDeleteIcon(props)}
      {props.publisher && renderPublisher(props)}
      {props.title && renderTitle(props)}
      {props.description && renderDescription(props)}
      {props.shouldRenderImage && renderImageContent(props)}
      {props.shouldRenderPlayer && renderPlayer(props)}
      {props.shouldRenderSpotifyPlayer && renderSpotifyPlayer(props)}
    </div>
  );
}

function renderDeleteIcon(props) {
  return (
    <SecondaryButton
      className={styles.deleteIconWrapper}
      color={props.color}
      onClick={props.onDeleteLinkPreview}
    >
      <Delete />
    </SecondaryButton>
  );
}

function renderImageContent(props) {
  return (
    <ProgressiveImage
      src={props.imageUrl || props.url}
      onError={props.onImageLoadError}
    >
      {(src, loading) =>
        props.imageLoadError
          ? renderErrorImage(props)
          : renderImage(loading, src, props.onClick)
      }
    </ProgressiveImage>
  );
}

function renderPublisher(props) {
  return (
    <div className={styles.publisher}>
      {props.logo ? <img src={props.logo} className={styles.logo} /> : null}
      <span>{props.publisher}</span>
    </div>
  );
}

function renderImage(loading, src, onClick) {
  return loading ? (
    <div className={styles.imagePlaceholder}></div>
  ) : (
    <img src={src} className={styles.image} onClick={onClick} />
  );
}

function renderErrorImage() {
  return (
    <div className={styles.errorImageWrapper}>
      <div className={styles.errorImage} />
      <span>{i18n.t('This content is not available')}</span>
    </div>
  );
}

function renderTitle(props) {
  return (
    <a className={styles.link} href={props.url} target={'_blank'}>
      <div className={styles.title}>{props.title}</div>
    </a>
  );
}

function renderDescription(props) {
  return <div className={styles.description}>{props.description}</div>;
}

function renderPlayer(props) {
  return <Player url={props.videoUrl || props.url} />;
}

function renderSpotifyPlayer(props) {
  return (
    <div className={styles.player}>
      <SpotifyPlayer
        uri={props.url}
        size={spotifyPlayerSize}
        view={'list'}
        theme={'black'}
      />
    </div>
  );
}

export default memo(LinkPreview);
