import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import ProfileSetUpScreen from '../screens/Profile/ProfileSetUpScreen';
import Profile from '../screens/Profile/Profile';
import ProfileScreen from '../screens/Profile/ProfileScreen';

export type RootStackParamList = {
  Profile: { name: string; username: string; bio: string };
  ProfileSetUpScreen: { name: string; username: string; bio: string };
  LoginScreen: { name: string; username: string };
  RegisterScreen:  undefined;
  ProfileScreen:  { name: string; username: string; bio: string };
};

const RootStack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator: React.FC = () => {
  
  return (
    <NavigationContainer>
      <RootStack.Navigator>
        <RootStack.Screen 
          name="LoginScreen" 
          component={LoginScreen} 
          options={{
            headerTitle: '', 
            headerBackTitleVisible: false, 
            headerTintColor: '#0d0d0d', 
            headerTransparent: true,
          }} 
        />
        <RootStack.Screen 
          name="RegisterScreen" 
          component={RegisterScreen} 
          options={{
            headerTitle: '', 
            headerBackTitleVisible: false, 
            headerTintColor: '#0d0d0d', 
            headerTransparent: true,
          }} 
        />
        <RootStack.Screen 
          name="ProfileScreen" 
          component={ProfileScreen} 
          options={{
            headerTitle: '', 
            headerBackTitleVisible: false, 
            headerTintColor: '#0d0d0d', 
            headerTransparent: true,
          }} 
        />
        <RootStack.Screen 
          name="ProfileSetUpScreen" 
          component={ProfileSetUpScreen} 
          options={{
            headerTitle: '', 
            headerBackTitleVisible: false, 
            headerTintColor: '#0d0d0d', 
            headerTransparent: true,
          }} 
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
