import React, { useState } from 'react';
import { SafeAreaView, Image, TouchableOpacity, Text, StyleSheet, TextInput, ScrollView, SafeAreaViewBase } from 'react-native';
import Logo from '../../components/common/logo';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/RootNavigator'
import Avatar from './Avatar';


type ProfileScreenRouteProp = RouteProp<RootStackParamList, 'ProfileScreen'>;
type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ProfileScreen'>;

type Props = {
  route: ProfileScreenRouteProp;
  navigation: ProfileScreenNavigationProp;
};

export default function ProfileScreen( {route, navigation} : Props){
    const { name, username, bio } = route.params;

return(
    <SafeAreaView style={styles.container}>
            <Logo />
        <ScrollView>
            <Avatar />
        </ScrollView>
    </SafeAreaView>
);

}


const styles = StyleSheet.create({
    container: {
        marginTop: "-15%",
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: 130,
        height: 130,
        marginBottom: 10,
        borderRadius: 100,
      },
  });