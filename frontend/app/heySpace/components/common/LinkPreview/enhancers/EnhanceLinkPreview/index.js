import React from 'react';

import audioExtensions from 'audio-extensions';
import imageExtensions from 'image-extensions';
import isNil from 'lodash/isNil';
import PropTypes from 'prop-types';
import ReactPlayer from 'react-player/lazy';
import { connect } from 'react-redux';
import videoExtensions from 'video-extensions';

import { onOpenLink } from 'common/utils';
import BaseComponent from 'commonEnhancers/BaseComponent';
import { selectEntityType } from 'models/domain/EntityModel/selectors';
import { EntityType } from 'models/domain/EntityModel/types';
import * as LinkPreviewModelActions from 'models/domain/LinkPreviewModel/actions';
import { selectLinkPreviewProperty } from 'models/domain/LinkPreviewModel/selectors';
import { onDeleteLinkPreview } from 'models/domain/MessagesModel/actions';
import { selectDoesMessageBelongToCurrentUser } from 'models/domain/MessagesModel/selectors';
import {
  selectMessageIsLinkPreviewEnabled,
  selectMessageContainerId,
} from 'models/domain/MessagesModel/selectors/domain';
import { selectProjectColor } from 'models/domain/ProjectsModel/selectors';
import { getLinkMetadata } from 'models/domain/RequestModel/constants/requestTypes';
import {
  selectRequestIsLoading,
  selectIsRequestRepeatable,
} from 'models/domain/RequestModel/selectors';
import { selectTaskColor } from 'models/domain/TasksModel/selectors';

const SPOTIFY_REGEX = /^(spotify:|https:\/\/[a-z]+\.spotify\.com\/)/;

function enhance(ComposedComponent) {
  class EnhanceLinkPreview extends BaseComponent {

    static propTypes = {
      url: PropTypes.string.isRequired,
      messageId: PropTypes.string,
    };

    state = {
      imageLoadError: null,
      mouseAbovePreview: false,
    };

    render() {
      return (
        <ComposedComponent
          url={this.props.url}
          linkText={this.props.linkText}
          linkTitle={this.props.linkTitle}
          imageUrl={this.props.imageUrl}
          title={this.props.title}
          logo={this.props.logo}
          publisher={this.props.publisher}
          description={this.props.description}
          videoUrl={this.props.videoUrl}
          isLoading={this.props.isLoading}
          isLinkPreviewEnabled={this.props.isLinkPreviewEnabled}
          imageLoadError={this.state.imageLoadError}
          color={this.props.color}
          shouldRenderPlayer={this.shouldRenderPlayer()}
          shouldRenderSpotifyPlayer={this.shouldRenderSpotifyPlayer()}
          shouldRenderImage={this.shouldRenderImage()}
          shouldRenderDeleteIcon={this.shouldRenderDeleteIcon()}
          shouldRenderUrl={this.props.shouldRenderUrl}
          onImageLoadError={this.onImageLoadError}
          onDeleteLinkPreview={this.props.onDeleteLinkPreview}
          onPreviewMouseEnter={this.onPreviewMouseEnter}
          onPreviewMouseLeave={this.onPreviewMouseLeave}
          onClick={this.onClick}
        />
      );
    }

    isDirectImageLink() {
      return imageExtensions.includes(this.getExtension());
    }

    isDirectVideoLink() {
      return videoExtensions.includes(this.getExtension());
    }

    isDirectAudioLink() {
      return audioExtensions.includes(this.getExtension());
    }

    getExtension() {
      let extension = this.props.url.split('.').pop();
      if (extension) {
        extension = extension.toLowerCase();
      }
      return extension;
    }

    isPlayable() {
      return ReactPlayer.canPlay(this.props.url);
    }

    shouldRenderPlayer() {
      return (
        !isNil(this.props.videoUrl) ||
        this.isPlayable() ||
        this.isDirectVideoLink() ||
        this.isDirectAudioLink()
      );
    }

    shouldRenderSpotifyPlayer() {
      return SPOTIFY_REGEX.test(this.props.url);
    }

    shouldRenderImage() {
      return (
        !this.shouldRenderPlayer() &&
        !this.shouldRenderSpotifyPlayer() &&
        (!isNil(this.props.imageUrl) || this.isDirectImageLink())
      );
    }

    shouldRenderDeleteIcon() {
      return this.props.isOwnMessage && this.state.mouseAbovePreview;
    }

    onImageLoadError(error) {
      this.setState({ imageLoadError: error });
    }

    onPreviewMouseEnter() {
      this.setState({
        mouseAbovePreview: true,
      });
    }

    onPreviewMouseLeave() {
      this.setState({
        mouseAbovePreview: false,
      });
    }

    onClick() {
      onOpenLink(this.props.url);
    }

    componentDidMount() {
      if (
        !this.props.canBeFetched ||
        this.isDirectImageLink() ||
        this.isDirectAudioLink() ||
        this.isDirectVideoLink() ||
        !this.props.isLinkPreviewEnabled
      ) {
        // don't fetch metadata because we are rendering player only
      } else {
        this.props.onFetchLinkMetadata();
      }
    }
  
}

  const mapStateToProps = (state, props) => {
    const objectId = selectMessageContainerId(state, {
      messageId: props.messageId,
    });
    const entityType = selectEntityType(state, { entityId: objectId });
    let color = selectProjectColor(state, { projectId: objectId });
    if (entityType === EntityType.TASK_DATA) {
      color = selectTaskColor(state, { taskId: objectId });
    }
    return {
      imageUrl: selectLinkPreviewProperty(state, {
        targetUrl: props.url,
        property: 'image',
      }),
      logo: selectLinkPreviewProperty(state, {
        targetUrl: props.url,
        property: 'logo',
      }),
      title: selectLinkPreviewProperty(state, {
        targetUrl: props.url,
        property: 'title',
      }),
      description: selectLinkPreviewProperty(state, {
        targetUrl: props.url,
        property: 'description',
      }),
      videoUrl: selectLinkPreviewProperty(state, {
        targetUrl: props.url,
        property: 'video',
      }),
      publisher: selectLinkPreviewProperty(state, {
        targetUrl: props.url,
        property: 'publisher',
      }),
      isLoading: selectRequestIsLoading(state, {
        requestType: getLinkMetadata,
        objectId: props.url,
      }),
      canBeFetched: selectIsRequestRepeatable(state, {
        requestType: getLinkMetadata,
        objectId: props.url,
      }),
      color,

      isOwnMessage: selectDoesMessageBelongToCurrentUser(state, {
        messageId: props.messageId,
      }),
      isLinkPreviewEnabled: selectMessageIsLinkPreviewEnabled(state, {
        messageId: props.messageId,
      }),
    };
  };

  const mapDispatchToProps = (dispatch, props) => ({
    onFetchLinkMetadata: () =>
      dispatch(LinkPreviewModelActions.onFetchLinkMetadata(props.url)),
    onDeleteLinkPreview: () => dispatch(onDeleteLinkPreview(props.messageId)),
  });

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceLinkPreview);
}

export default enhance;
