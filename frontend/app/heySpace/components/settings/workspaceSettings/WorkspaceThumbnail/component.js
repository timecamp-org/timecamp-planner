import PropTypes from 'prop-types';
import ProgressiveImage from 'react-progressive-image';

import styles from './styles.css';

WorkspaceThumbnai.propTypes = {
  className: PropTypes.string,
  imageClassName: PropTypes.string,
  workspaceThumbnail: PropTypes.string,
  workspaceInitials: PropTypes.string,
};

WorkspaceThumbnai.defaultProps = {
  className: '',
};

function WorkspaceThumbnai(props) {
  return (
    <div
      className={`
      ${props.className || styles.Component}
      ${props.workspaceThumbnail ? '' : props.initialsClassName || styles.initialsBackground}
    `}
    >
      {props.workspaceThumbnail ? renderThumbnail(props) : renderInitials(props)}
    </div>
  );
}

function renderThumbnail(props) {
  return <ProgressiveImage src={props.workspaceThumbnail}>{renderImage}</ProgressiveImage>;

  function renderImage(src, loading) {
    return loading ? (
      <div className={styles.imagePlacegolder}></div>
    ) : (
      <img className={props.imageClassName || styles.image} src={src} />
    );
  }
}

function renderInitials(props) {
  return <div className={styles.initials}>{props.workspaceInitials}</div>;
}

export default WorkspaceThumbnai;
