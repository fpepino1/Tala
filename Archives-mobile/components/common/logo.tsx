import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

export default function Logo(){
  return (
    <View style={styles.container}>
      <Image source={require('../../assets/images/2.png')} style={styles.logo} />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 200,
    height: 200,
  },
});
