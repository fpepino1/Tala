import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TouchableOpacity, Text } from 'react-native';
import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import ProfileSetUpScreen from '../screens/Profile/ProfileSetUpScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import Icon from 'react-native-vector-icons/MaterialIcons'; 

export type RootStackParamList = {
  Profile: { name: string; username: string; bio: string };
  ProfileSetUpScreen: { name: string; username: string; bio: string };
  LoginScreen: { name: string; username: string };
  RegisterScreen: undefined;
  ProfileScreen: { name: string; username: string; bio: string };
};

const RootStack = createNativeStackNavigator<RootStackParamList>();

type CloseButtonProps = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

const CloseButton: React.FC<CloseButtonProps> = ({ navigation }) => {
  return (
    <TouchableOpacity onPress={() => navigation.navigate('ProfileScreen', { name: '', username: '', bio: '' })}>
      <Text style={{ fontSize: 16 }}>Skip</Text>
    </TouchableOpacity>
  );
};

const RootNavigator: React.FC = () => {
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
            headerRight: () => <CloseButton navigation={navigation} />,
          })}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;

