import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';

import MarkdownRenderer from 'models/domain/MessagesModel/MarkdownRenderer';

import scrollIntoViewIfNeeded from 'scroll-into-view-if-needed';
import {
  selectMessageContainerId,
  selectMessageText,
} from 'models/domain/MessagesModel/selectors/domain';
import { selectUsersNicknames } from 'models/domain/UsersModel/selectors/domain';

import getBoundMarkdownToReactRenderers from '../../../../common/MarkdownOutput/markdownToReactRenderers';

import PureBaseComponent from 'commonEnhancers/PureBaseComponent';
import handleError from 'common/utils/handleError';

export const defaultMaxMessageTextHeight = '400px';

function Enhance(ComposedComponent) {
  class EnhanceMessageText extends PureBaseComponent {
    constructor(props) {
      super(props);

      this.state = {
        isMessageTextTooLong: false,
        isTextFolded: true,
        hasError: false,
      };

      this.markdownRenderer = new MarkdownRenderer({
        userNicknamesByIds: props.userNicknamesByIds,
        getBoundRenderers: getBoundMarkdownToReactRenderers({
          paragraphShouldHaveTopMargin: true,
          messageId: props.messageId,
          containerObjectId: this.props.containerObjectId,
        }),
      });
    }

    static propTypes = {
      maxMessageTextHeight: PropTypes.string,
      messageId: PropTypes.string.isRequired,

      userNicknamesByIds: ImmutablePropTypes.map.isRequired,
    };

    static defaultProps = {
      maxMessageTextHeight: defaultMaxMessageTextHeight,
    };

    render() {
      return (
        <ComposedComponent
          className={this.props.className}
          messageId={this.props.messageId}
          maxMessageTextHeight={this.props.maxMessageTextHeight}
          isMessageTextTooLong={this.state.isMessageTextTooLong}
          isTextFolded={this.state.isTextFolded}
          hasError={this.state.hasError}
          shouldRenderLinkPreview={this.props.shouldRenderLinkPreview}
          setMessageTextRef={this.setMessageTextRef}
          onClickMessageExpanderButton={this.onClickMessageExpanderButton}
          color={this.props.color}
          isEdited={this.props.isEdited}
          text={this.props.text}
          markdownOutput={this.getMarkdownOutput()}
          isMessageHovered={this.props.isMessageHovered}
        />
      );
    }

    setMessageTextRef(ref) {
      this.messageTextRef = ref;
    }

    getMarkdownOutput() {
      try {
        return typeof this.props.text === 'string'
          ? this.markdownRenderer.getRenderableOutput(
              this.props.text,
              this.props.color
            )
          : null;
      } catch (error) {
        if (!this.state.hasError) {
          this.setState({
            hasError: true,
          });
        }
        handleError(error);
        return null;
      }
    }

    onClickMessageExpanderButton() {
      this.setState(
        (prevState) => ({
          isTextFolded: !prevState.isTextFolded,
        }),
        () => {
          if (this.state.isTextFolded && this.messageTextRef) {
            scrollIntoViewIfNeeded(this.messageTextRef, {
              block: 'start',
              scrollMode: 'if-needed',
              behavior: (actions) => {
                actions.forEach(({ el, top, left }) => {
                  el.scrollTop = top - 55; // scroll a bit above the messageText node to show whole message container
                  el.scrollLeft = left;
                });
              },
            });
          }
        }
      );
    }

    setIsMessageTextToLong() {
      if (this.messageTextRef) {
        const height = this.messageTextRef.offsetHeight;
        if (height > parseInt(this.props.maxMessageTextHeight, 10)) {
          this.setState({
            isMessageTextTooLong: true,
          });
        } else {
          this.setState({
            isMessageTextTooLong: false,
          });
        }
      }
    }

    componentDidMount() {
      this.setIsMessageTextToLong();
    }

    componentDidUpdate(prevProps, prevState, prevContext) {
      if (this.messageTextRef) {
        const height = this.messageTextRef.offsetHeight;
        if (height >= parseInt(this.props.maxMessageTextHeight, 10)) {
          if (prevState.isMessageTextTooLong === false) {
            this.setState({
              isMessageTextTooLong: true,
            });
          }
        } else if (prevState.isMessageTextTooLong === true) {
          this.setState({
            isMessageTextTooLong: false,
          });
        }
      }
    }
  }

  const mapStateToProps = (state, props) => {
    return {
      text:
        selectMessageText(state, { messageId: props.messageId }) || props.text,
      userNicknamesByIds: selectUsersNicknames(state),
      containerObjectId: selectMessageContainerId(state, {
        messageId: props.messageId,
      }),
    };
  };

  return connect(mapStateToProps)(EnhanceMessageText);
}

export default Enhance;
