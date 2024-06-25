import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TouchableOpacity, Text } from 'react-native';
import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import ProfileSetUpScreen from '../screens/Profile/ProfileSetUpScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import { RootStackParamList, CloseButtonProps } from './types';

const RootStack = createNativeStackNavigator<RootStackParamList>();

const CloseButton: React.FC<CloseButtonProps> = ({ navigation }) => {
  return (
    <TouchableOpacity onPress={() => navigation.navigate('ProfileScreen', { name: '', username: '', bio: '' })}>
      <Text style={{ fontSize: 16 }}>Skip</Text>
    </TouchableOpacity>
  );
};

export default function RootNavigator(){

  return (
    <NavigationContainer>
      <RootStack.Navigator
        screenOptions={{
          headerTitle: '',
          headerBackTitleVisible: false,
          headerTintColor: '#0d0d0d',
          headerTransparent: true,
        }}
      >
        <RootStack.Screen 
          name="LoginScreen" 
          component={LoginScreen} 
        />
        <RootStack.Screen 
          name="RegisterScreen" 
          component={RegisterScreen} 
        />
        <RootStack.Screen 
          name="ProfileScreen" 
          component={ProfileScreen} 
          options={{
            headerShown: false,           }} 
        />
        <RootStack.Screen 
          name="ProfileSetUpScreen" 
          component={ProfileSetUpScreen} 
          options={({ navigation }) => ({
            headerLeftShown: false,
            headerBackVisible: false, 
            headerRight: () => <CloseButton navigation={navigation} />,
          })}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );


        }
