// types.ts

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';

export type StackParamList = {
  NotificationScreen: undefined;
  LikesScreen: { postId: string; userId: string };
  ConnectionsList: { userId: string; type: 'followers' | 'following' };
  Profile: { name: string; username: string; bio: string };
  ProfileStats: { userId: string };
  ProfileSetUpScreen: { name: string; username: string; bio: string };
  LoginScreen: { name: string; username: string };
  RegisterScreen: undefined;
  ProfileScreen: { name: string; username: string; bio: string };
  TabNav: { screen: string; params: { name: string; username: string; bio: string } } | undefined;
  PostDetailScreen: {
    postId: string;
    userId: string;
    postImage: string;
    description: string;
    posts: any[];
  };
  EditProfileScreen: { name: string; username: string; bio: string };
  MenuScreen: undefined;
  MenuButton: undefined;
  SearchScreen: undefined;
  UserProfile: {
    username: string;
    name: string;
    photoUrl: string;
    bio: string;
    userId: string;
    posts: any[];
    chatId?: string;
  };
  MessageScreen: {
    userId: string;
    name: string;
    username: string;
    photoUrl: string;
    chatRoomId?: string;
    currentUserId: string;
    message?: string;
  };
  ForgotPasswordScreen: {
    email: string;
  };
  Messages: {
    userId: string;
    name: string;
    username: string;
    photoUrl: string;
    chatRoomId?: string;
    currentUserId: string;
    message?: string;
  };
};

export type TabParamList = {
  ProfileScreen: { name: string; username: string; bio: string };
  Feed: { postId: string; userId: string; postImage: string; description: string };
  Post: { postId: string; userId: string; postImage: string; description: string };
  PostDetailScreen: {
    postId: string;
    userId: string;
    postImage: string;
    description: string;
    posts: any[];
  };
  StackNav: { screen: string | undefined };
  SearchScreen: undefined;
  NotificationScreen: undefined;
};

export type MessageScreenNavigationProp = NativeStackNavigationProp<StackParamList, 'MessageScreen'>;
export type ConnectionsListScreenNavigationProp = NativeStackNavigationProp<StackParamList, 'ConnectionsList'>;
export type ProfileSetUpScreenNavigationProp = NativeStackNavigationProp<StackParamList, 'ProfileSetUpScreen'>;
export type UserProfileScreenNavigationProp = NativeStackNavigationProp<StackParamList, 'UserProfile'>;
export type LogInScreenNavigationProp = NativeStackNavigationProp<StackParamList, 'LoginScreen'>;
export type RegisterScreenNavigationProp = NativeStackNavigationProp<StackParamList, 'RegisterScreen'>;
