import React, { useState } from 'react';
import { SafeAreaView, TouchableOpacity, Text, StyleSheet, TextInput } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/RootNavigator';
import Avatar from './Avatar';
import { FIREBASE_DB } from '../../FirebaseConfig';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import { FIREBASE_AUTH } from '../../FirebaseConfig';

// Define navigation and route props types
type ProfileSetUpScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ProfileSetUpScreen'>;
type ProfileSetUpScreenRouteProp = RouteProp<RootStackParamList, 'ProfileSetUpScreen'> 

export type ProfileSetUpScreenProps = {
  navigation: ProfileSetUpScreenNavigationProp;
  route: ProfileSetUpScreenRouteProp;
};

const ProfileSetUpScreen: React.FC<ProfileSetUpScreenProps> = ({ navigation, route }) => {
  const { name, username, bio: initialBio } = route.params; // Destructure bio from route.params
  const [bio, setBio] = useState(initialBio); // Use initialBio as the initial state for bio

  // Get Firestore instance

  // Function to handle 'Update Bio' button press
  const handleNext = async (username: string, bio: string) => {
    const ARCHIVES_DB = FIREBASE_DB;
    const auth = FIREBASE_AUTH;
    const userId = auth.currentUser?.uid; // Get current user's UID from auth

    if (!userId) {
      console.error("User not authenticated.");
      return;
    }

    try {
      const userDocRef = doc(ARCHIVES_DB, 'users', userId);

      await updateDoc(userDocRef, {
        bio: bio,
      });

      console.log("Bio updated successfully!");

      // Navigate to ProfileScreen with updated data
      navigation.navigate('ProfileScreen', { name: name, username: username, bio: bio });
    } catch (error: any) {
      console.error("Error updating bio: ", error);
      alert("Error updating bio. Please try again later.");
    }
  };

  // Render UI
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.biggerText}>Finish setting up your account</Text>
      <Avatar />
      <Text style={[styles.nameText, styles.boldText]}>{name}</Text>
      <Text style={styles.normalText}>{username}</Text>
      <TextInput
        style={styles.input}
        placeholder="Add a bio"
        keyboardType="default"
        autoCapitalize="none"
        value={bio}
        onChangeText={(text) => setBio(text)}
      />
<TouchableOpacity style={styles.submit} onPress={() => handleNext( username, bio)}>
        <Text style={styles.submitText}>Next</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

// Styles definition
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  biggerText: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: '10%',
  },
  nameText: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 2,
  },
  boldText: {
    fontWeight: 'bold',
  },
  normalText: {
    fontSize: 13,
    marginBottom: 20,
  },
  input: {
    width: '80%',
    borderRadius: 16,
    backgroundColor: '#E3E3E3',
    paddingHorizontal: '5%',
    paddingTop: '5%',
    paddingBottom: '19%',
    marginBottom: 30,
  },
  submit: {
    backgroundColor: '#0d0d0d',
    borderRadius: 16,
    height: 50,
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ProfileSetUpScreen;
