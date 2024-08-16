import React from 'react';
import { TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ProfileScreen from '../screens/Main/ProfileScreen';
import FeedScreen from '../screens/Main/Feed';
import Post from '../screens/Posts/Post';
import SearchScreen from '../screens/Main/SearchScreen';
import NotificationScreen from '../screens/Main/NotificationScreen'; 
import { TabParamList } from './types';
import { useNavigation, CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StackParamList } from './types';
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import Messages from '../screens/Messages/Messages';
const Tab = createBottomTabNavigator<TabParamList>();

type TabNavProp = CompositeNavigationProp<
  StackNavigationProp<StackParamList>,
  StackNavigationProp<TabParamList>
>;

export default function TabNav() {
  const navigation = useNavigation<TabNavProp>();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Feed') {
            iconName = 'home-outline';
          } else if (route.name === 'Post') {
            iconName = 'add-outline';
          } else if (route.name === 'ProfileScreen') {
            iconName = 'person-outline';
          } else if (route.name === 'SearchScreen') {
            iconName = 'search-outline';
          } else if (route.name === 'NotificationScreen') {
            iconName = 'heart-outline';  
          }

          return <Ionicons name={iconName} size={25} color={color} />;
        },
        tabBarActiveTintColor: '#d9d9d9',
        tabBarInactiveTintColor: '#0d0d0d',
        headerStyle: {
          backgroundColor: '#F8F3FA',
        },
        tabBarStyle: {
          backgroundColor: '#F8F3FA',
          borderTopWidth: 0,
          height: '8%',
          paddingTop: 0,
          paddingBottom: 0,
        },
      })}
    >
      <Tab.Screen
        name="Feed"
        component={FeedScreen}
        options={{
          title: '',
          tabBarLabel: '',
          headerRight: () => (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Messages');
              }}
              style={{ marginRight: 10 }}
            >
              <Ionicons name="chatbubbles-outline" size={25} color="#0d0d0d" />
            </TouchableOpacity>
          ),
        }}
      />
      <Tab.Screen
        name="SearchScreen"
        component={SearchScreen}
        options={{
          headerShown: false,
          title: '',
        }}
      />
      <Tab.Screen
        name="Post"
        component={Post}
        options={{ title: 'New Post', tabBarLabel: '' }}
      />
      <Tab.Screen
        name="NotificationScreen"
        component={NotificationScreen}
        options={{
          headerShown: false,
          title: '',
        }}
      />
      <Tab.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{
          headerShown: false,
          title: '',
        }}
      />
      
    </Tab.Navigator>
  );
}