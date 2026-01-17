import React from 'react';
import { View, ActivityIndicator, Image, Text } from 'react-native';
import styles from './styles';
import { purpleHeartColor } from 'common/commonStyles/colors';
import Assets from 'common/commonAssets';
import isIOS from '../../utils/isIOS';

const iconUri = isIOS ? Assets.IOS_APP_ICON : Assets.FAVICON;

function AppLoader(props) {
  return props.isLoading ? renderLoader() : null;
}

function renderLoader() {
  return (
    <View style={styles.Component}>
      <View style={styles.brand}>
        <Image source={{ uri: iconUri }} style={styles.image} />
        <Text style={styles.text}>{'Planner'}</Text>
      </View>
      <ActivityIndicator size={'large'} color={purpleHeartColor} />
    </View>
  );
}

export default AppLoader;
