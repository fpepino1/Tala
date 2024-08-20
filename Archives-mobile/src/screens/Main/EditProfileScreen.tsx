import React, { useState, useEffect } from 'react';
import { View, SafeAreaView, TouchableOpacity, Text, StyleSheet, TextInput, Alert } from 'react-native';
import Avatar from './Avatar';
import { StackNavigationProp } from '@react-navigation/stack';
import { StackParamList } from '../../navigation/types';
import { useNavigation } from '@react-navigation/native';
import { FIREBASE_DB, FIREBASE_AUTH, FIREBASE_STORAGE } from '../../../FirebaseConfig';
import { doc, getDoc, updateDoc, deleteDoc, onSnapshot, getDocs, where, query, collection, arrayRemove } from 'firebase/firestore';
import { reauthenticateWithCredential, EmailAuthProvider, updatePassword } from 'firebase/auth'; 
import { ScrollView } from 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { deleteUser } from 'firebase/auth';
import { ref, deleteObject } from 'firebase/storage'; 


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
  
  const handleDeleteAccount = async () => {
      const userId = FIREBASE_AUTH.currentUser?.uid;
      if (!userId) {
          Alert.alert('Error', 'No user is currently logged in.');
          return;
      }
  
      try {
          // Fetch and delete the current user's posts
          const userPostsRef = collection(FIREBASE_DB, 'users', userId, 'posts');
          const userPostsSnapshot = await getDocs(userPostsRef);
  
          for (const postDoc of userPostsSnapshot.docs) {
              const postId = postDoc.id;
  
              // Fetch and remove comments and likes from the current user's posts
              await updateDoc(doc(FIREBASE_DB, 'users', userId, 'posts', postId), {
                  comments: [],
                  likes: []
              });
          }
  
          // Process other users' posts
          const allUsersRef = collection(FIREBASE_DB, 'users');
          const allUsersSnapshot = await getDocs(allUsersRef);
          console.log(`Found ${allUsersSnapshot.docs.length} users`);
  
          for (const docSnapshot of allUsersSnapshot.docs) {
              const otherUserId = docSnapshot.id;
              console.log(`Processing user ${otherUserId}`);
  
              const otherUserPostsRef = collection(FIREBASE_DB, 'users', otherUserId, 'posts');
              const otherUserPostsSnapshot = await getDocs(otherUserPostsRef);
              console.log(`Found ${otherUserPostsSnapshot.docs.length} posts for user ${otherUserId}`);
  
              for (const postDoc of otherUserPostsSnapshot.docs) {
                  const postId = postDoc.id;
                  const postData = postDoc.data();
                  console.log(`Processing post ${postId}`);
  
                  // Filter out comments and likes related to the current user
                  const updatedComments = postData.comments.filter((comment: any) => comment.userId !== userId);
                  const updatedLikes = postData.likes.filter((likeId: string) => likeId !== userId);
  
                  // Update the post document
                  await updateDoc(doc(FIREBASE_DB, 'users', otherUserId, 'posts', postId), {
                      comments: updatedComments,
                      likes: updatedLikes
                  });
              }
          }
  
          // Delete notifications for this user
        const notificationsRef = collection(FIREBASE_DB, 'notifications');
        const notificationsQueryForUser = query(
            notificationsRef,
            where('userId', '==', userId)
        );
        const notificationsSnapshotForUser = await getDocs(notificationsQueryForUser);
        notificationsSnapshotForUser.forEach(async (doc) => {
            await deleteDoc(doc.ref);
        });

        // Delete notifications related to this user
        const notificationsQueryFromUser = query(
            notificationsRef,
            where('fromUserId', '==', userId)
        );
        const notificationsSnapshotFromUser = await getDocs(notificationsQueryFromUser);
        notificationsSnapshotFromUser.forEach(async (doc) => {
            await deleteDoc(doc.ref);
        });

        const storageRef = ref(FIREBASE_STORAGE, `users/${userId}`);
          await deleteObject(storageRef);
          
          const userDocRef = doc(FIREBASE_DB, 'users', userId);
          await deleteDoc(userDocRef);
          await deleteUser(FIREBASE_AUTH.currentUser);
  
          // Alert.alert('Account Deleted', 'Your account has been successfully deleted.');
          navigation.navigate('LoginScreen');
      } catch (error) {
          console.error('Error deleting account:', error);
          Alert.alert('Error', 'Failed to delete account. Please try again later.');
      }
  };
  

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
      await reauthenticateWithCredential(user, credential);
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
            <TouchableOpacity onPress={handleDeleteAccount} style={[styles.submit, { backgroundColor: '#df3b47' }]}>
              <Text style={styles.submitText}>Delete account</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </ScrollView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
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
    height: 150,
    borderRadius: 16,
    backgroundColor: '#E3E3E3',
    paddingHorizontal: '5%',
    paddingTop: '4%',
    paddingBottom: '4%',
    marginBottom: 10,
  },
  submit: {
    width: '45%',
    height: 45,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#009B77',
  },
  submitText: {
    fontSize: 18,
    color: 'white',
  },
});
