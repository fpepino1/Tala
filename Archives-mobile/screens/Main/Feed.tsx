import React from 'react';
import { SafeAreaView, Text, StyleSheet } from 'react-native';

export default function FeedScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text>Feed Screen</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
