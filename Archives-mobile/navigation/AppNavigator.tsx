import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity, Text } from 'react-native';
import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import ProfileSetUpScreen from '../screens/Main/ProfileSetUpScreen';
import { AppStackParamList, CloseButtonProps } from './types';
import { NavigationContainer } from '@react-navigation/native';
import MainTabNavigator from './MainTabNavigator';
const AppStack = createNativeStackNavigator<AppStackParamList>();

const CloseButton: React.FC<CloseButtonProps> = ({ navigation }) => {
  return (
    <TouchableOpacity onPress={() => navigation.navigate('ProfileScreen', { name: '', username: '', bio: '' })}>
      <Text style={{ fontSize: 16 }}>Skip</Text>
    </TouchableOpacity>
  );
};

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <AppStack.Navigator
        screenOptions={{
          headerTitle: '',
          headerBackTitleVisible: false,
          tabBarStyle: {     backgroundColor:'#F7F3FA'      },
          headerTintColor: '#0d0d0d',
          headerTransparent: true,
        }}
      >
        <AppStack.Screen name="LoginScreen" component={LoginScreen} />
        <AppStack.Screen name="RegisterScreen" component={RegisterScreen} />
        <AppStack.Screen
          name="ProfileSetUpScreen"
          component={ProfileSetUpScreen}
          options={({ navigation }) => ({
            headerLeftShown: false,
            headerBackVisible: false,
            headerRight: () => <CloseButton navigation={navigation} />,
          })}
        />
        <AppStack.Screen
          name="MainTabNavigator"
          component={MainTabNavigator} 
          options={{ headerShown: false }}
        />
        
      </AppStack.Navigator>
    </NavigationContainer>
  );
}