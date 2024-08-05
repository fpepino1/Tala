import React from 'react';
import AppNavigator from './navigation/AppNavigator';
import { StyleSheet, View} from 'react-native';
import EditProfileScreen from './screens/Main/EditProfileScreen';
export default function App() {
  return (
    <AppNavigator />
     
  );
}

const style=StyleSheet.create({
  container:{
    backgroundColor: '#F8F3FA'
  }
});
 