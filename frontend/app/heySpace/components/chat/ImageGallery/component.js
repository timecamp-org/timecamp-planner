import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.css';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { List } from 'immutable';

import { doNothing } from 'common/utils';
import LoadingDots from 'commonComponents/LoadingDots';
import ProgressiveFileImage from 'commonComponents/ProgressiveFileImage';
import { X, ChevronRight, ChevronLeft } from 'commonComponents/Icons';

ImageGallery.propTypes = {
  fileIds: ImmutablePropTypes.listOf(PropTypes.string).isRequired,
  isLoading: PropTypes.bool.isRequired,
  currentIndex: PropTypes.number.isRequired,

  onKeyDown: PropTypes.func.isRequired,
  onClickBackdrop: PropTypes.func.isRequired,
  onSlideLeft: PropTypes.func.isRequired,
  onSlideRight: PropTypes.func.isRequired,
  onSetContainerRef: PropTypes.func.isRequired,
};

ImageGallery.defaultProps = {
  fileIds: new List(),
  isLoading: false,
  currentIndex: 0,

  onKeyDown: doNothing,
  onClickBackdrop: doNothing,
  onSlideLeft: doNothing,
  onSlideRight: doNothing,
  onSetContainerRef: doNothing,
};

function ImageGallery(props) {
  return (
    <div
      className={styles.imageGallery}
      ref={props.onSetContainerRef}
      onKeyDown={props.onKeyDown}
      tabIndex={0}
    >
      <div className={styles.images}>
        {props.isLoading ? (
          <div className={styles.loaderWrapper}>
            <LoadingDots className={styles.loadingDots} />{' '}
          </div>
        ) : (
          renderItem(props.currentImageId)
        )}
      </div>
      <div className={`${styles.backdrop}`} onClick={props.onClickBackdrop} />

      {props.currentIndex !== 0 && renderLeftNav()}
      {props.currentIndex !== props.fileIds.size - 1 && renderRightNav()}

      <X className={styles.x} onClick={props.onClickBackdrop} />
    </div>
  );

  function renderLeftNav() {
    return (
      <ChevronLeft className={styles.leftNav} onClick={props.onSlideLeft} />
    );
  }

  function renderRightNav() {
    return (
      <ChevronRight className={styles.rightNav} onClick={props.onSlideRight} />
    );
  }
}

function renderItem(id) {
  return (
    <ProgressiveFileImage
      id={id}
      maxSize={window.innerHeight}
      shouldOpenInNewTabOnClick={true}
      useOriginalUrl={true}
    />
  );
}

export default ImageGallery;
