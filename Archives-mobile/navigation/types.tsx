import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

export type StackParamList = {
  Profile: { name: string; username: string; bio: string };
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
  MessageListScreen: undefined;
  UserProfile: {
    username: string;
    name: string;
    photoUrl: string;
    bio: string;
    userId: string;
    posts: Array<{ id: string; imageUrl: string }>; 
  };};

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

export type PostGridNavigationProp = StackNavigationProp<TabParamList, 'Feed'>;

export interface PostData {
  postImage: string;
  description: string;
  postId: string;
  posts: any[];
}

export type MenuScreenNavigationProp = StackNavigationProp<StackParamList, 'MenuScreen'>;
export type MenuButtonNavigationProp = StackNavigationProp<StackParamList, 'MenuButton'>;
export type RegisterScreenNavigationProp = StackNavigationProp<StackParamList, 'RegisterScreen'>;

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

export type LogInScreenNavigationProp = StackNavigationProp<StackParamList, 'LoginScreen'>;
export type LoginScreenRouteProp = RouteProp<StackParamList, 'LoginScreen'>;

export type LoginScreenProps = {
  navigation: LogInScreenNavigationProp;
  route: LoginScreenRouteProp;
};

export type CloseButtonProps = {
  navigation: NativeStackNavigationProp<StackParamList>;
};

export type ProfileSetUpScreenNavigationProp = StackNavigationProp<StackParamList, 'ProfileSetUpScreen'>;
export type ProfileSetUpScreenRouteProp = RouteProp<StackParamList, 'ProfileSetUpScreen'>;

export type ProfileSetUpScreenProps = {
  navigation: ProfileSetUpScreenNavigationProp;
  route: ProfileSetUpScreenRouteProp;
};
