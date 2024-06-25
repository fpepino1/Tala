import React from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';


export type RootStackParamList = {
    Profile: { name: string; username: string; bio: string };
    ProfileSetUpScreen: { name: string; username: string; bio: string };
    LoginScreen: { name: string; username: string };
    RegisterScreen: undefined;
    ProfileScreen: { name: string; username: string; bio: string };
  };
export type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'RegisterScreen'>;
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
 export type LogInScreenNavigationProp = StackNavigationProp<RootStackParamList, 'LoginScreen'>;
  export type LoginScreenRouteProp = RouteProp<RootStackParamList, 'LoginScreen'>;
  
  export type LoginScreenProps = {
    navigation: LogInScreenNavigationProp;
    route: LoginScreenRouteProp;
  };
  
  export type CloseButtonProps = {
    navigation: NativeStackNavigationProp<RootStackParamList>;
  };

  export type ProfileSetUpScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ProfileSetUpScreen'>;
  export type ProfileSetUpScreenRouteProp = RouteProp<RootStackParamList, 'ProfileSetUpScreen'> 
  
  export type ProfileSetUpScreenProps = {
    navigation: ProfileSetUpScreenNavigationProp;
    route: ProfileSetUpScreenRouteProp;
  };
  