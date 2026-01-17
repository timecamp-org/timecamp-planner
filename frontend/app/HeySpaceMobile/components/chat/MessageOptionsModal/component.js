import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles';
import { doNothing } from 'common/utils';
import EmojiPicker from 'commonComponents/EmojiPicker';

import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import UniversalModal from 'commonComponents/UniversalModal';
import Trash from '../../Icons/Trash';
import CornerUpRight from '../../Icons/CornerUpRight';
import Copy from '../../Icons/Copy';
import Emot from '../../Icons/Emot';
import ArrowDown from '../../Icons/ArrowDown';
import { blueGreyColor, coralPinkTwoColor } from 'common/commonStyles/colors';
import DeleteConfirmationModalContent from 'commonComponents/DeleteConfirmationModal/content';
import contentTypes from './contentTypes';
import isIOS from '../../../utils/isIOS';

MessageOptionsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  canUserDeleteMessage: PropTypes.bool.isRequired,
  visibleContent: PropTypes.string.isRequired,

  onClose: PropTypes.func.isRequired,
  onNavigateToConvertMessageToTask: PropTypes.func.isRequired,
  onSetVisibleContentType: PropTypes.func.isRequired,
  onCancelDeleteMessage: PropTypes.func.isRequired,
  onMessageDelete: PropTypes.func.isRequired,
  onDownloadFile: PropTypes.func,
};

MessageOptionsModal.defaultProps = {
  onClose: doNothing,
  onSetVisibleContentType: doNothing,
  onNavigateToConvertMessageToTask: doNothing,
  onCancelDeleteMessage: doNothing,
  onMessageDelete: doNothing,
  onDownloadFile: doNothing,
};

function MessageOptionsModal(props) {
  return (
    <UniversalModal isVisible={props.isOpen} onBackdropPress={props.onClose}>
      <View style={styles.modalContainer}>{renderContent(props)}</View>
    </UniversalModal>
  );
}

function renderContent(props) {
  switch (props.visibleContent) {
    case contentTypes.EMOJI_PICKER: {
      return <EmojiPicker onChooseEmoji={props.onChooseEmoji} />;
    }

    case contentTypes.DELETE_CONFIRMATION: {
      return renderDeleteMessageConfirmation(props);
    }

    case contentTypes.TEXT: {
      return renderTextMessageModalContent(props);
    }

    case contentTypes.FILE: {
      return renderFileMessageModalContent(props);
    }
  }
}

function renderDeleteMessageConfirmation(props) {
  return (
    <DeleteConfirmationModalContent
      title={'Delete message'}
      description={'Are you sure you want to delete this message? This cannot be undone.'}
      onClose={props.onCancelDeleteMessage}
      onDelete={props.onMessageDelete}
    />
  );
}

function renderTextMessageModalContent(props) {
  return (
    <View style={styles.modalPadding}>
      <TouchableOpacity onPress={props.onCopyMessage}>
        <View style={styles.button}>
          <Copy style={styles.icon} color={blueGreyColor} />
          <Text style={styles.buttonText}>{'Copy message'}</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={props.onNavigateToConvertMessageToTask}>
        <View style={styles.button}>
          <CornerUpRight style={styles.icon} color={blueGreyColor} />
          <Text style={styles.buttonText}>{'Convert message to task'}</Text>
        </View>
      </TouchableOpacity>
      {!isIOS ? (
        <TouchableOpacity onPress={() => props.onSetVisibleContentType(contentTypes.EMOJI_PICKER)}>
          <View style={styles.button}>
            <Emot style={styles.icon} color={blueGreyColor} />
            <Text style={styles.buttonText}>{'Add reaction'}</Text>
          </View>
        </TouchableOpacity>
      ) : null}
      {props.canUserDeleteMessage ? (
        <TouchableOpacity onPress={() => props.onSetVisibleContentType(contentTypes.DELETE_CONFIRMATION)}>
          <View style={styles.button}>
            <Trash style={styles.icon} color={coralPinkTwoColor} />
            <Text style={StyleSheet.flatten([styles.buttonText, styles.deleteButtonText])}>
              {'Delete this message'}
            </Text>
          </View>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

function renderFileMessageModalContent(props) {
  return (
    <View style={styles.modalPadding}>
      {!isIOS ? (
        <TouchableOpacity onPress={() => props.onSetVisibleContentType(contentTypes.EMOJI_PICKER)}>
          <View style={styles.button}>
            <Emot style={styles.icon} color={blueGreyColor} />
            <Text style={styles.buttonText}>{'Add reaction'}</Text>
          </View>
        </TouchableOpacity>
      ) : null}
      <TouchableOpacity onPress={props.onDownloadFile}>
        <View style={styles.button}>
          <ArrowDown style={styles.icon} color={blueGreyColor} />
          <Text style={styles.buttonText}>{'Download file'}</Text>
        </View>
      </TouchableOpacity>
      {props.canUserDeleteMessage ? (
        <TouchableOpacity onPress={() => props.onSetVisibleContentType(contentTypes.DELETE_CONFIRMATION)}>
          <View style={styles.button}>
            <Trash style={styles.icon} color={coralPinkTwoColor} />
            <Text style={StyleSheet.flatten([styles.buttonText, styles.deleteButtonText])}>
              {'Delete this message'}
            </Text>
          </View>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

export default MessageOptionsModal;
