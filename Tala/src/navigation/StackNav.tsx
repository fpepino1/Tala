import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity, Text } from 'react-native';
import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import ProfileSetUpScreen from '../screens/Main/ProfileSetUpScreen';
import { StackParamList, CloseButtonProps } from './types';
import { NavigationContainer } from '@react-navigation/native';
import TabNav from './TabNav';
import PostDetailScreen from '../screens/Posts/PostDetailScreen';
import MenuScreen from '../screens/Main/MenuScreen';
import MenuButton from '../screens/Main/MenuButton';
import EditProfileScreen from '../screens/Main/EditProfileScreen';
import UserProfile from '../screens/Main/UserProfile';
import SearchScreen from '../screens/Main/SearchScreen';
import MessageScreen from '../screens/Messages/MessageScreen';
import Messages from '../screens/Messages/Messages';
import ForgotPasswordScreen from '../screens/Auth/ForgotPasswordScreen';
import ConnectionsList from '../screens/Main/ConnectionsList';
import NotificationScreen from '../screens/Main/NotificationScreen';
import LikesScreen from '../screens/Main/LikesScreen';
const Stack = createNativeStackNavigator<StackParamList>();

const CloseButton: React.FC<CloseButtonProps> = ({ navigation }) => {

  return (
    <TouchableOpacity onPress={() => navigation.navigate('ProfileScreen', { name: '', username: '', bio: '' })}>
      <Text style={{ fontSize: 16 }}>Skip</Text>
    </TouchableOpacity>
  );
};

export default function StackNav() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerTintColor: '#0D0D0D',
          headerShown: false,
          headerBackTitleVisible: false,
          headerStyle: { backgroundColor: '#F8F3FA' },
        }}
      >
        <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false, headerTitle: '' }} />
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} options={{ headerTitle: '', headerShown: true }} />
        <Stack.Screen name="NotificationScreen" component={NotificationScreen} />
        <Stack.Screen name="LikesScreen" component={LikesScreen} options={{ headerTitle: 'Likes', headerShown: true }} />

        <Stack.Screen
          name="ProfileSetUpScreen"
          component={ProfileSetUpScreen}
          options={({ navigation }) => ({
            headerTitle: '',
            headerRight: () => <CloseButton navigation={navigation} />,
          })}
        />
        <Stack.Screen name="ConnectionsList" component={ConnectionsList}
        options={({ route }) => ({
          title: route.params.type === 'followers' ? 'Followers' : 'Following',
          headerShown: true,
        })}
      />
        <Stack.Screen name="TabNav" component={TabNav} options={{}} />
        <Stack.Screen
          name="PostDetailScreen"
          component={PostDetailScreen}
          options={{
            title: 'Posts',
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="MenuScreen"
          component={MenuScreen}
          options={{
            title: 'Settings & Activity',
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="EditProfileScreen"
          component={EditProfileScreen}
          options={{
            title: 'Edit Profile',
            headerShown: true,
          }}
        />
          <Stack.Screen
          name="UserProfile"
          component={UserProfile}
          options={{
            title: '',
            headerShown: true,
          }}
         
        />
        <Stack.Screen
          name="MessageScreen"
          component={MessageScreen}
          options={{
            title: '',
            headerShown: true,
          }}
         
        />
          <Stack.Screen
          name="ForgotPasswordScreen"
          component={ForgotPasswordScreen}
          options={{
            title: '',
            headerShown: true,
          }}
         
        />
         <Stack.Screen
          name="Messages"
          component={Messages}
          options={{
            title: 'Messages',
            headerShown: true,
          }}
         
        />

          <Stack.Screen
          name="SearchScreen"
          component={SearchScreen}
         
        />
        <Stack.Screen name="MenuButton" component={MenuButton} />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}