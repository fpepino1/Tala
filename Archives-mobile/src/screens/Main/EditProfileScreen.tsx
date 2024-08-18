import React, { useState, useEffect } from 'react';
import { View, SafeAreaView, TouchableOpacity, Text, StyleSheet, TextInput, Alert } from 'react-native';
import Avatar from './Avatar'; // Ensure Avatar component is imported
import { StackNavigationProp } from '@react-navigation/stack';
import { StackParamList } from '../../navigation/types';
import { useNavigation } from '@react-navigation/native';
import { FIREBASE_DB, FIREBASE_AUTH } from '../../../FirebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { reauthenticateWithCredential, EmailAuthProvider, updatePassword } from 'firebase/auth'; // Import additional methods
import { ScrollView } from 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function EditProfileScreen() {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const userDocRef = doc(FIREBASE_DB, 'users', FIREBASE_AUTH.currentUser?.uid);
  const navigation = useNavigation<StackNavigationProp<StackParamList>>();

  useEffect(() => {
    const fetchUserData = async () => {
      const docSnap = await getDoc(userDocRef);
      if (docSnap.exists()) {
        const userData = docSnap.data();
        setName(userData.name || '');
        setUsername(userData.username || '');
        setBio(userData.bio || '');
        setPhotoUrl(userData.photoUrl || '');
      }
    };
    fetchUserData();
  }, []);

  const handleSaveChanges = async () => {
    try {
      await updateDoc(userDocRef, {
        name,
        username,
        bio,
        photoUrl,
      });
      Alert.alert('Success', 'Profile updated successfully!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile.');
    }
  };

  const handleChangePassword = async () => {
    const user = FIREBASE_AUTH.currentUser;
    if (!user) {
      Alert.alert('Error', 'No user is currently logged in.');
      return;
    }
    const credential = EmailAuthProvider.credential(user.email || '', currentPassword);
    try {
      // Reauthenticate the user
      await reauthenticateWithCredential(user, credential);
      // Update password
      await updatePassword(user, newPassword);
      Alert.alert('Success', 'Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
    } catch (error) {
      Alert.alert('Error', 'Failed to change password. Please check your current password.');
    }
  };

  return ( 
    <GestureHandlerRootView style={styles.container}>
     <ScrollView>
    <SafeAreaView style={styles.container}>
      <View style={styles.containerAvatar}>
        <Avatar initialPhotoUrl={photoUrl} />
      </View>
      <TextInput
        style={styles.input}
        placeholder="Change name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Change username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.inputBio}
        placeholder="Change bio"
        value={bio}
        onChangeText={setBio}
      />
      <TextInput
        style={styles.input}
        placeholder="Current password"
        secureTextEntry
        value={currentPassword}
        onChangeText={setCurrentPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="New password"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />
      <View style={styles.containerButton}>
        <TouchableOpacity style={styles.submit} onPress={handleSaveChanges}>
          <Text style={styles.submitText}>Save changes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.submit} onPress={handleChangePassword}>
          <Text style={styles.submitText}>Change Password</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.submit, { backgroundColor: '#df3b47' }]}>
          <Text style={styles.submitText}>Delete account</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
    </ScrollView>
    </GestureHandlerRootView>


  );
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F3FA',
  },
  containerAvatar: {
    marginBottom: '10%',
    alignItems: 'center',
  },
  containerButton: {
    marginTop: '5%',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'row',
    width: '90%',
  },
  input: {
    width: '80%',
    borderRadius: 16,
    backgroundColor: '#E3E3E3',
    paddingHorizontal: '5%',
    paddingTop: '4%',
    paddingBottom: '4%',
    marginBottom: 10,
  },
  inputBio: {
    width: '80%',
    borderRadius: 16,
    backgroundColor: '#E3E3E3',
    paddingHorizontal: '5%',
    paddingTop: '4%',
    paddingBottom: '4%',
    marginBottom: 10,
  },
  submit: {
    borderRadius: 50,
    padding: 10,
    width: '30%', // Adjust width to fit all buttons
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#a4d5b2',
  },
  submitText: {
    fontWeight: 'bold',
    color: '#FFF',
  },
});
