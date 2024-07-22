import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ProfileScreen from '../screens/Main/ProfileScreen';
import FeedScreen from '../screens/Main/Feed';
import { RootTabParamList } from './types';
import Post from '../screens/Posts/Post';
import PostDetailScreen from '../screens/Main/PostDetailScreen';
const Tab = createBottomTabNavigator<RootTabParamList>();


export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false, 
        tabBarStyle: {     backgroundColor:'#F7F3FA'      },
        tabBarActiveTintColor: '#D9D9D9',
        tabBarInactiveTintColor: '#0d0d0d',
      }}
    >
     
      <Tab.Screen
      name='Feed'
        component={FeedScreen}
        options={{ title: 'Feed' }}
      />
     <Tab.Screen
        name="Post"
        component={Post}
        options={{ title: 'New Post', headerShown: true, 
    }}
      />
      <Tab.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{ title: 'Profile',
      }}
      />

    </Tab.Navigator>
  );
}
