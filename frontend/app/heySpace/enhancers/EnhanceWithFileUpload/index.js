import React from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { doNothing } from 'common/utils';
import handleError from 'common/utils/handleError';
import PureBaseComponent from 'commonEnhancers/PureBaseComponent';
import { isImage } from 'models/domain/FilesModel/helpers';
import * as FilesModelSelectors from 'models/domain/FilesModel/selectors';

function Enhance(ComposedComponent) {
  class EnhanceWithFileUpload extends PureBaseComponent {

    // eslint-disable-line react/prefer-stateless-function

    static propTypes = {
      onUploadFiles: PropTypes.func.isRequired,
      className: PropTypes.string,
      // this enhancer
      nameOfFileInUpload: PropTypes.string,
    };

    static defaultProps = {
      onUploadFiles: doNothing,
    };

    state = {
      isBackdropVisible: false,
    };

    render() {
      return (
        <ComposedComponent
          {...this.props}
          onDropFile={this.onDropFile}
          onDragEnter={this.onDragEnter}
          onDragLeave={this.onDragLeave}
          isBackdropVisible={this.state.isBackdropVisible}
          onSetOpenCallback={this.onSetOpenCallback}
          onOpenFilePrompt={this.onOpenFilePrompt}
          nameOfFileInUpload={this.props.nameOfFileInUpload}
          onPaste={this.onPaste}
        />
      );
    }

    onPaste(event) {
      const files = [];
      const itemList = event.clipboardData.items;

      for (let i = 0; i < itemList.length; i++) {
        if (itemList[i].kind === 'file') {
          files.push(itemList[i].getAsFile());
        }
      }

      if (files.length > 0) {
        this.onUploadFiles(files);
        event.preventDefault();
      }
    }

    onOpenFilePrompt() {
      if (this.openCallback) {
        this.openCallback();
      }
    }

    onSetOpenCallback(openCallback) {
      this.openCallback = openCallback;
    }

    onDropFile(files) {
      this.setState({ isBackdropVisible: false });
      this.onUploadFiles(files);
    }

    onDragEnter(event) {
      if (event.dataTransfer) {
        const dt = event.dataTransfer;
        // check if any file is dragged
        if (
          (dt.files && dt.files.length) ||
          (event.target && event.target.files)
        ) {
          this.setState({ isBackdropVisible: true });
        } else if (dt.items && dt.items.length) {
          // convert to native array
          const itemsArr = Array.prototype.slice.call(dt.items);
          if (itemsArr.some((item) => item.kind === 'file')) {
            this.setState({ isBackdropVisible: true });
          }
        }
      }
    }

    onDragLeave() {
      this.setState({ isBackdropVisible: false });
    }

    onUploadFiles(files) {
      this.normalizeFiles(files)
        .then((normalizedFiles) => this.props.onUploadFiles(normalizedFiles))
        .catch((error) => handleError(error));
    }

    normalizeFiles(files) {
      return Promise.all(files.map(this.setSize));
    }

    setSize(file) {
      return new Promise(function (resolve, reject) {
        if (!isImage(file.type)) {
          file.width = null;
          file.height = null;
          resolve(file);
        } else {
          var url = URL.createObjectURL(file);
          var img = new Image();

          img.onload = function () {
            file.width = img.width;
            file.height = img.height;
            resolve(file);
          };

          img.onerror = function (error) {
            reject(error);
          };

          img.src = url;
        }
      });
    }
  
}

  function mapStateToProps(state) {
    return {
      nameOfFileInUpload: FilesModelSelectors.selectFileInUploadName(state),
    };
  }

  return connect(mapStateToProps)(EnhanceWithFileUpload);
}

export default Enhance;
