import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity, Text } from 'react-native';
import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import ProfileSetUpScreen from '../screens/Profile/ProfileSetUpScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import { AppStackParamList, CloseButtonProps } from './types';
import { NavigationContainer } from '@react-navigation/native';

const AppStack = createNativeStackNavigator<AppStackParamList>();

const CloseButton: React.FC<CloseButtonProps> = ({ navigation }) => {
  return (
    <TouchableOpacity onPress={() => navigation.navigate('ProfileScreen', { name: '', username: '', bio: '' })}>
      <Text style={{ fontSize: 16 }}>Skip</Text>
    </TouchableOpacity>
  );
};

export default function AppNavigator(){
  return (
    <NavigationContainer>
    <AppStack.Navigator
      initialRouteName="TabsNavigator"
      screenOptions={{
        headerTitle: '',
        headerBackTitleVisible: false,
        headerTintColor: '#0d0d0d',
        headerTransparent: true,
      }}
    >
      <AppStack.Screen 
        name="LoginScreen" 
        component={LoginScreen} 
      />
      <AppStack.Screen 
        name="RegisterScreen" 
        component={RegisterScreen} 
      />
      <AppStack.Screen 
        name="ProfileScreen" 
        component={ProfileScreen} 
        options={{
          headerShown: false,           
        }} 
      />
      <AppStack.Screen 
        name="ProfileSetUpScreen" 
        component={ProfileSetUpScreen} 
        options={({ navigation }) => ({
          headerLeftShown: false,
          headerBackVisible: false, 
          headerRight: () => <CloseButton navigation={navigation} />,
        })}
      />
    
    </AppStack.Navigator>
    </NavigationContainer>
  );
}
