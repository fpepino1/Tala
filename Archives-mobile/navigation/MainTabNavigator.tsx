import React from 'react';
import { TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ProfileScreen from '../screens/Main/ProfileScreen';
import FeedScreen from '../screens/Main/Feed';
import Post from '../screens/Posts/Post';
import { RootTabParamList } from './types';

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Feed') {
            iconName = 'home-outline';
          } else if (route.name === 'Post') {
            iconName = 'add-circle-outline';
          } else if (route.name === 'ProfileScreen') {
            iconName = 'person-outline';
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
          paddingBottom: 0
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
              onPress={() => alert('Message button pressed')}
              style={{ marginRight: 10 }}
            >
              <Ionicons name="chatbubble-outline" size={25} color="#0d0d0d" />
            </TouchableOpacity>
          ),
        }}
      />
        <Tab.Screen
        name="Post"
        component={Post}
        options={{ title: 'New Post', tabBarLabel: '' }} 
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
