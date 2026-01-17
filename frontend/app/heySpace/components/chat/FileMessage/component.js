import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.css';
import { File } from 'commonComponents/Icons';

const fileIconSize = 18;

FileMessage.propTypes = {
  fileUrl: PropTypes.string.isRequired,
  fileName: PropTypes.string.isRequired,
};

FileMessage.defaultProps = {
  fileUrl: '',
  fileName: '',
};

function FileMessage(props) {
  return (
    <div className={styles.Component}>
      <a href={props.fileUrl} target={'_blank'}>
        <div className={styles.file}>
          <File size={fileIconSize} />
          <div className={`${styles.fileName}`}>{props.fileName}</div>
        </div>
      </a>
    </div>
  );
}

export default FileMessage;
