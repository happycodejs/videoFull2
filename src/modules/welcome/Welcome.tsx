import React, {useEffect} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import welcomePic from '../../assets/images/welcome.jpg';

export default () => {
  const navigation = useNavigation<StackNavigationProp<any>>();

  useEffect(() => {
    setTimeout(() => {
      navigation.replace('Home');
    }, 2000);
  }, []);

  return (
    <View style={styles.root}>
      <Image source={welcomePic} style={styles.welcomePic} />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    flexDirection: 'column',
    alignItems: 'center',
  },
  welcomePic: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});
