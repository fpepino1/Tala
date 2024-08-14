import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import MessageScreen from '../screens/Messages/MessageScreen';
import Messages from '../screens/Messages/Messages';
import { StackNavigationProp } from '@react-navigation/stack';
export type MessageScreenNavigationProp = NativeStackNavigationProp<StackParamList, 'MessageScreen'>;

export interface ChatRoom {
  userId: string;
  chatRoomId: string;
  photoUrl: string;
  name: string;
  username: string;
  lastMessage?: string; 
}

// Define navigation prop type for ConnectionsList screen
export type ConnectionsListScreenNavigationProp = StackNavigationProp<
StackParamList,
  'ConnectionsList'
>;

// Define route prop type for ConnectionsList screen
export type ConnectionsListScreenRouteProp = RouteProp<
  StackParamList,
  'ConnectionsList'
>;

// Combine props for ConnectionsList screen
export type ConnectionsListProps = {
  navigation: ConnectionsListScreenNavigationProp;
  route: ConnectionsListScreenRouteProp;
};
export type StackParamList = {
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
  ForgotPasswordScreen:{
    email:string;
  }
  Messages:{
    userId: string;
    name: string;
    username: string;
    photoUrl: string;
    chatRoomId?: string;
    currentUserId: string;
    message?: string;
  }
}

 
  
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

export type PostGridNavigationProp = NativeStackNavigationProp<TabParamList, 'Feed'>;

export interface PostData {
  postImage: string;
  description: string;
  postId: string;
  posts: any[];
  timestamp: Date; 
}

export type MenuScreenNavigationProp = NativeStackNavigationProp<StackParamList, 'MenuScreen'>;
export type MenuButtonNavigationProp = NativeStackNavigationProp<StackParamList, 'MenuButton'>;
export type RegisterScreenNavigationProp = NativeStackNavigationProp<StackParamList, 'RegisterScreen'>;

export type RegisterScreenProps = {
  navigation: RegisterScreenNavigationProp;
};

export interface UserData {
  name: string;
  username: string;
  email: string;
  createdAt: Date;
  bio: string;
  photoUrl: string;
  userId: string;
}

export type LogInScreenNavigationProp = NativeStackNavigationProp<StackParamList, 'LoginScreen'>;
export type LoginScreenRouteProp = RouteProp<StackParamList, 'LoginScreen'>;

export type LoginScreenProps = {
  navigation: LogInScreenNavigationProp;
  route: LoginScreenRouteProp;
};

export type CloseButtonProps = {
  navigation: NativeStackNavigationProp<StackParamList>;
};

export type ProfileSetUpScreenNavigationProp = NativeStackNavigationProp<StackParamList, 'ProfileSetUpScreen'>;
export type ProfileSetUpScreenRouteProp = RouteProp<StackParamList, 'ProfileSetUpScreen'>;
export type UserProfileScreenNavigationProp = NativeStackNavigationProp<StackParamList, 'UserProfile'>;

export type ProfileSetUpScreenProps = {
  navigation: ProfileSetUpScreenNavigationProp;
  route: ProfileSetUpScreenRouteProp;
};
