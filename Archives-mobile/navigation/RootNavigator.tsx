import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import ProfileSetUpScreen from '../screens/Profile/ProfileSetUpScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import { FIREBASE_AUTH } from '../FirebaseConfig';

export type RootStackParamList = {
  LoginScreen: undefined;
  RegisterScreen: undefined;
  ProfileSetUpScreen: { name: string; username: string };
  ProfileScreen: { name: string; username: string; bio: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();


const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="LoginScreen" 
        component={LoginScreen} 
        options={{
          headerTitle: '', 
          headerBackTitleVisible: false, 
          headerTintColor: '#0d0d0d', 
          headerTransparent: true,
        }} 
      />
      <Stack.Screen 
        name="RegisterScreen" 
        component={RegisterScreen} 
        options={{
          headerTitle: '', 
          headerBackTitleVisible: false, 
          headerTintColor: '#0d0d0d', 
          headerTransparent: true,
        }} 
      />
      <Stack.Screen 
        name="ProfileSetUpScreen" 
        component={ProfileSetUpScreen} 
        options={{
          headerTitle: '', 
          headerBackTitleVisible: false, 
          headerTintColor: '#0d0d0d', 
          headerTransparent: true,
        }} 
      />
    </Stack.Navigator>
  );
};

const MainNavigator: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="ProfileScreen" 
        component={ProfileScreen} 
        options={{
          headerTitle: '', 
          headerBackTitleVisible: false, 
          headerTintColor: '#0d0d0d', 
          headerTransparent: true,
        }} 
      />
    </Stack.Navigator>
  );
};

const RootNavigator: React.FC = () => {
  const auth = FIREBASE_AUTH;
  const user = auth.currentUser;
  const userLoggedIn = !!user;



  return (
    <NavigationContainer>
      {userLoggedIn ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default RootNavigator;
