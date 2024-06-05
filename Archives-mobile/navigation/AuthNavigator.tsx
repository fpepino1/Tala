import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import ProfileSetUpScreen from '../screens/Auth/ProfileSetUpScreen';

export type RootStackParamList = {
  LoginScreen: undefined;
  RegisterScreen: undefined;
  ProfileSetUpScreen: { name: string; username: string };
}
const Stack = createNativeStackNavigator<RootStackParamList>();

const AuthNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="LoginScreen" 
          component={LoginScreen} 
          options={{
            headerTitle: '', 
            headerBackTitleVisible: false, 
            headerTintColor: '#0d0d0d', 
            headerTransparent: true,
            
          }} />
        <Stack.Screen 
          name="RegisterScreen" 
          component={RegisterScreen} 
          options={{
            headerTitle: '', 
            headerBackTitleVisible: false, 
            headerTintColor: '#0d0d0d', 
            headerTransparent: true,
        }}         />
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
    </NavigationContainer>
  );
};

export default AuthNavigator;

