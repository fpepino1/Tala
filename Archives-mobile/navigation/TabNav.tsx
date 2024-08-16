// TabNav.tsx

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ProfileScreen from '../screens/Main/ProfileScreen';
import FeedScreen from '../screens/Main/Feed';
import Post from '../screens/Posts/Post';
import SearchScreen from '../screens/Main/SearchScreen';
import NotificationScreen from '../screens/Main/NotificationScreen';
import { TabParamList } from './types';
import { useNavigation } from '@react-navigation/native';

const Tab = createBottomTabNavigator<TabParamList>();

export default function TabNav() {
  const navigation = useNavigation();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          switch (route.name) {
            case 'Feed': iconName = 'home-outline'; break;
            case 'Post': iconName = 'add-outline'; break;
            case 'ProfileScreen': iconName = 'person-outline'; break;
            case 'SearchScreen': iconName = 'search-outline'; break;
            case 'NotificationScreen': iconName = 'heart-outline'; break;
          }
          return <Ionicons name={iconName} size={25} color={color} />;
        },
        tabBarActiveTintColor: '#d9d9d9',
        tabBarInactiveTintColor: '#0d0d0d',
        tabBarStyle: {
          backgroundColor: '#F8F3FA',
          borderTopWidth: 0,
          height: '8%',
        },
      })}
    >
      <Tab.Screen
        name="Feed"
        component={FeedScreen}
        options={{
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate('Messages')}
              style={{ marginRight: 10 }}
            >
              <Ionicons name="chatbubbles-outline" size={25} color="#0d0d0d" />
            </TouchableOpacity>
          ),
        }}
      />
      <Tab.Screen name="SearchScreen" component={SearchScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Post" component={Post} options={{ title: 'New Post' }} />
      <Tab.Screen name="NotificationScreen" component={NotificationScreen} options={{ headerShown: false }} />
      <Tab.Screen name="ProfileScreen" component={ProfileScreen} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}
