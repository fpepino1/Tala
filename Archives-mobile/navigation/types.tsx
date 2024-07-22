import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';



export type AppStackParamList = {
  Profile: { name: string; username: string; bio: string };
  ProfileSetUpScreen: { name: string; username: string; bio: string };
  LoginScreen: { name: string; username: string };
  RegisterScreen: undefined;
  ProfileScreen: { name: string; username: string; bio: string };
  MainTabNavigator: { screen: string; params: { name: string; username: string; bio: string; } } | undefined;
};

export type PostGridNavigationProp = StackNavigationProp<RootTabParamList, 'Feed'>;

  export interface PostData {
    postImage: string;
    description: string;
    postId: string;
  }
  export type RootTabParamList = {
    ProfileScreen: { name: string; username: string; bio: string };
    Feed: {postId: string; userId: string;postImage: string; description: string};
    PostDetailScreen: { postId: string; userId: string;postImage: string; description: string };
    Post:{ postId: string; userId: string;postImage: string; description: string };
  };


export type RegisterScreenNavigationProp = StackNavigationProp<AppStackParamList, 'RegisterScreen'>;
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
  }
 export type LogInScreenNavigationProp = StackNavigationProp<AppStackParamList, 'LoginScreen'>;
  export type LoginScreenRouteProp = RouteProp<AppStackParamList, 'LoginScreen'>;
  
  export type LoginScreenProps = {
    navigation: LogInScreenNavigationProp;
    route: LoginScreenRouteProp;
  };
  
  export type CloseButtonProps = {
    navigation: NativeStackNavigationProp<AppStackParamList>;
  };

  export type ProfileSetUpScreenNavigationProp = StackNavigationProp<AppStackParamList, 'ProfileSetUpScreen'>;
  export type ProfileSetUpScreenRouteProp = RouteProp<AppStackParamList, 'ProfileSetUpScreen'> 
  
  export type ProfileSetUpScreenProps = {
    navigation: ProfileSetUpScreenNavigationProp;
    route: ProfileSetUpScreenRouteProp;
  };
  