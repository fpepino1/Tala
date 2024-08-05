import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity, Text } from 'react-native';
import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import ProfileSetUpScreen from '../screens/Main/ProfileSetUpScreen';
import { AppStackParamList, CloseButtonProps } from './types';
import { NavigationContainer } from '@react-navigation/native';
import MainTabNavigator from './MainTabNavigator';
import PostDetailScreen from '../screens/Main/PostDetailScreen';
import MenuScreen from '../screens/Main/MenuScreen';
import MenuButton from '../screens/Main/MenuButton';
import EditProfileScreen from '../screens/Main/EditProfileScreen';

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
          headerTintColor: '#0D0D0D',
          headerShown: false, 
          headerBackTitleVisible: false,
          headerStyle:{ backgroundColor: '#F8F3FA', 

        },
       
        }}
      >
        <AppStack.Screen name="LoginScreen" component={LoginScreen} options={    {    headerShown: false,              headerTitle: '',
    

}} />
        <AppStack.Screen name="RegisterScreen" component={RegisterScreen} options={    {  headerTitle: '',  headerShown: true,  
    

  }}/>
        <AppStack.Screen
          name="ProfileSetUpScreen"
          component={ProfileSetUpScreen}
          options={({ navigation }) => ({
           
            headerTitle: '',
            headerRight: () => <CloseButton navigation={navigation} />,
          })}
        />
        <AppStack.Screen
          name="MainTabNavigator"
          component={MainTabNavigator} 
          options={{   
          }}
      />
       <AppStack.Screen
  name="PostDetailScreen"
  component={PostDetailScreen}
  options={{
    title: 'Posts',
    headerShown: true, 
  }}
/>

      <AppStack.Screen
        name="MenuScreen"
        component={MenuScreen}
        options={{
          title: 'Settings & Activity',
          headerShown: true, 
        }}
      />
       <AppStack.Screen
        name="EditProfileScreen"
        component={EditProfileScreen}
        options={{
          title: 'Edit Profile',
          headerShown: true, 
        }}
      />
   <AppStack.Screen
        name="MenuButton"
        component={MenuButton}
      />
      </AppStack.Navigator>
    </NavigationContainer>
  );
}