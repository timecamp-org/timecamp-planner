import { LinkPreviewInterface } from './index';
import imageExtensions from 'image-extensions';
import audioExtensions from 'audio-extensions';
import videoExtensions from 'video-extensions';
import isNil from 'lodash/isNil';

import { GestureResponderEvent, Linking } from 'react-native';
import { useDataProvider, useDataPersister } from './dataHooks';
import { GestureResponderHandler } from '../../../types';

import { useEffect, useCallback } from 'react';
import { getExtension } from '../../../utils/fileUtils';

export type LinkPreviewHookInterface = {
  url: string;
  imageUrl: string;
  logo: string;
  title: string;
  description: string;
  publisher: string;
  isLoading: boolean;
  canBeFetched: boolean;
  color: string;
  isOwnMessage: boolean;
  isLinkPreviewEnabled: boolean;
  shouldRenderImage: boolean;
  onPress: GestureResponderHandler;
};

export default function useComponent(props: LinkPreviewInterface): LinkPreviewHookInterface {
  const dataProvider = useDataProvider(props);
  const dataPersister = useDataPersister(props);
  const { canBeFetched, isLinkPreviewEnabled, imageUrl } = dataProvider;
  const extension = getExtension(props.url);

  const isDirectImageLink = imageExtensions.includes(extension);
  const isDirectVideoLink = videoExtensions.includes(extension);
  const isDirectAudioLink = audioExtensions.includes(extension);

  const shouldRenderImage = !isNil(imageUrl) || isDirectImageLink;

  useEffect(() => {
    if (!canBeFetched || isDirectImageLink || isDirectAudioLink || isDirectVideoLink || !isLinkPreviewEnabled) {
      // don't fetch metadata because we are rendering player only
    } else {
      dataPersister.onFetchLinkMetadata();
    }
  }, []);

  const onPress = useCallback((event: GestureResponderEvent) => Linking.openURL(props.url), [props.url]);

  return {
    url: props.url,
    canBeFetched: dataProvider.canBeFetched,
    color: dataProvider.color,
    description: dataProvider.description,
    imageUrl: dataProvider.imageUrl,
    isLoading: dataProvider.isLoading,
    isLinkPreviewEnabled: dataProvider.isLinkPreviewEnabled,
    isOwnMessage: dataProvider.isOwnMessage,
    logo: dataProvider.logo,
    publisher: dataProvider.publisher,
    title: dataProvider.title,
    shouldRenderImage,
    onPress,
  };
}
