import PropTypes from 'prop-types';
import React from 'react';
import { KeyboardAvoidingView, ScrollView, View } from 'react-native';
import styles from './styles';

import { isIphoneX } from '../../../utils/iphoneX';
import isIOS from '../../../utils/isIOS';
import { tabNavigationHeight } from '../../common/TabNavigation/styles';
import MessageList from '../MessageList';
import MessageOptionsModal from '../MessageOptionsModal';
import NewMessageInput from '../NewMessageInput';
import NewMessageInputActionIcons from '../NewMessageInputActionIcons';

const topOffset = isIphoneX() ? 90 : 70;

const KeyboardAvoidingViewBehaior = isIOS ? 'padding' : undefined;

MessageBoard.propTypes = {
  objectId: PropTypes.string.isRequired,
  objectType: PropTypes.string,
  isFirstRequestLoading: PropTypes.bool,
  onUploadFiles: PropTypes.func,
};

MessageBoard.defaultProps = {
  isFirstRequestLoading: false,
};

export default function MessageBoard(props) {
  return (
    <View style={styles.Component}>
      {renderMessageBoard(props)}
      {renderMessageOptionsModal()}
    </View>
  );

  function renderMessageBoard() {
    return (
      <ScrollView style={styles.messageBoardWrapper} scrollEnabled={false} keyboardShouldPersistTaps="always">
        <KeyboardAvoidingView
          style={props.isTabNavigationVisible ? styles.messageBoardWithTabNavigation : styles.messageBoard}
          behavior={KeyboardAvoidingViewBehaior}
          enabled
          keyboardVerticalOffset={getKeyboardVerticalOffset()}
        >
          <MessageList
            objectId={props.objectId}
            objectType={props.objectType}
            style={styles.messageList}
            onMessageLongPress={props.onMessageLongPress}
          />
          <View style={styles.inputWithIcons}>
            <NewMessageInputActionIcons objectId={props.objectId} />
            <NewMessageInput objectId={props.objectId} />
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    );
  }

  function getKeyboardVerticalOffset() {
    if (!isIOS) {
      return undefined;
    }

    let offset = topOffset;

    if (props.isTabNavigationVisible) {
      offset += tabNavigationHeight;
    }

    return offset;
  }

  function renderMessageOptionsModal() {
    return (
      <MessageOptionsModal
        messageId={props.messageOptionsModalParams.messageId}
        isOpen={props.isMessageOptionsModalOpen}
        onClose={props.onMessageOptionsModalHide}
      />
    );
  }
}
