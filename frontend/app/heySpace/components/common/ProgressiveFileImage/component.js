import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.css';
import ProgressiveImage from 'commonComponents/ProgressiveImage';

import { doNothing } from 'common/utils';
import { ImageSize } from 'models/domain/FilesModel/types';

ProgressiveFileImage.propTypes = {
  className: PropTypes.string,
  fileUrl: PropTypes.string.isRequired,
  thumbnailUrl: PropTypes.string.isRequired,
  tinyThumbnailUrl: PropTypes.string,
  dimensionsAfterResize: PropTypes.shape({
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
  }),
  shouldOpenInNewTabOnClick: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
};

ProgressiveFileImage.defaultProps = {
  thumbnailUrl: '',
  fileUrl: '',
  dimensionsAfterResize: {
    width: ImageSize.MEDIUM,
    height: ImageSize.MEDIUM,
  },
  shouldOpenInNewTabOnClick: false,
  onClick: doNothing,
};

function ProgressiveFileImage(props) {
  return (
    <div className={props.className ? props.className : styles.Component}>
      {props.shouldOpenInNewTabOnClick ? (
        <a href={props.fileUrl} target={'_blank'}>
          {renderProgressiveImage(props)}
        </a>
      ) : (
        renderProgressiveImage(props)
      )}
    </div>
  );
}

function renderProgressiveImage(props) {
  return (
    <ProgressiveImage
      imageUrl={props.thumbnailUrl}
      tinyImageUrl={props.tinyThumbnailUrl}
      containerStyle={props.dimensionsAfterResize}
      imageStyle={props.dimensionsAfterResize}
      onClick={props.onClick}
    />
  );
}

export default ProgressiveFileImage;
