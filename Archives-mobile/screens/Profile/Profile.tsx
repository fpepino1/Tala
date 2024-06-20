import React from 'react';
import { SafeAreaView, Text, ScrollView, StyleSheet } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/RootNavigator';
import Logo from '../../components/common/logo';
import Avatar from './Avatar';

type ProfileRouteProp = RouteProp<RootStackParamList, 'Profile'>;

type ProfileProps = {
  route: ProfileRouteProp;
};

const Profile: React.FC<ProfileProps> = ({ route }) => {
  const { name, username, bio } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Logo />
        <Avatar />
        <Text>{name}</Text>
        <Text>{username}</Text>
        <Text>{bio}</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: '-15%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Profile;
