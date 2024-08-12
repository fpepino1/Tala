import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ProfileStats from './ProfileStats';
import PostGrid from '../Posts/PostGrid';
import { useNavigation } from '@react-navigation/native';
import { arrayUnion, arrayRemove, doc, updateDoc, getDoc } from 'firebase/firestore';
import { FIREBASE_DB, FIREBASE_AUTH } from '../../FirebaseConfig';
import { UserProfileScreenNavigationProp } from '../../navigation/types';
import { createChatRoom } from '../Messages/ChatRoom';

export default function UserProfile({ route }: { route: { params: { username: string; name: string; photoUrl: string; bio: string; userId: string; chatId?: string; } } }) {
  const { username, name, photoUrl, bio, userId, chatId } = route.params;
  const navigation = useNavigation<UserProfileScreenNavigationProp>(); 
  const [isFollowing, setIsFollowing] = useState(false);
  const [isCurrentUser, setIsCurrentUser] = useState(false); 

  useEffect(() => {
    const checkFollowingStatus = async () => {
      try {
        const currentUser = FIREBASE_AUTH.currentUser;
        if (currentUser) {
          const currentUserId = currentUser.uid;
          setIsCurrentUser(currentUserId === userId);

          const currentUserDocRef = doc(FIREBASE_DB, 'users', currentUserId);
          const currentUserDoc = await getDoc(currentUserDocRef);

          if (currentUserDoc.exists()) {
            const currentUserData = currentUserDoc.data();
            setIsFollowing(currentUserData.following?.includes(userId) || false);
          }
        }
      } catch (error) {
        console.error("Error checking following status:", error);
      }
    };

    checkFollowingStatus();
  }, [userId]);
  const handleMessage = async () => {
    try {
      const currentUser = FIREBASE_AUTH.currentUser;
      if (currentUser) {
        const currentUserId = currentUser.uid;
        const chatRoomId = chatId || await createChatRoom(currentUserId, userId);
  
        navigation.navigate('MessageScreen', {
          userId,
          currentUserId,
          chatRoomId,
          name,
          username,
          photoUrl,
        });
      }
    } catch (error) {
      console.error("Error starting chat:", error);
    }
  };
  

  const handleFollow = async () => {
    try {
      const currentUser = FIREBASE_AUTH.currentUser;
      if (currentUser) {
        const currentUserId = currentUser.uid;
        const currentUserDocRef = doc(FIREBASE_DB, 'users', currentUserId);
        const targetUserDocRef = doc(FIREBASE_DB, 'users', userId);

        await updateDoc(currentUserDocRef, { following: arrayUnion(userId) });
        await updateDoc(targetUserDocRef, { followers: arrayUnion(currentUserId) });

        setIsFollowing(true);
      }
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  const handleUnfollow = async () => {
    try {
      const currentUser = FIREBASE_AUTH.currentUser;
      if (currentUser) {
        const currentUserId = currentUser.uid;
        const currentUserDocRef = doc(FIREBASE_DB, 'users', currentUserId);
        const targetUserDocRef = doc(FIREBASE_DB, 'users', userId);

        await updateDoc(currentUserDocRef, { following: arrayRemove(userId) });
        await updateDoc(targetUserDocRef, { followers: arrayRemove(currentUserId) });

        setIsFollowing(false);
      }
    } catch (error) {
      console.error("Error unfollowing user:", error);
    }
  };

  return (
    <ScrollView style={{ backgroundColor: '#F8F3FA' }}>
      <View style={styles.container}>
        <Image source={{ uri: photoUrl }} style={styles.profile} />
        <Text style={styles.nameText}>{name}</Text>
        <Text style={[styles.normalText, { opacity: 0.6 }]}>{username}</Text>
        <Text style={[styles.bioText, styles.bioContainer]}>{bio}</Text>
        {!isCurrentUser && ( 
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={[styles.submit, { backgroundColor: isFollowing ? '#d9d9d9' : '#0d0d0d' }]}
              onPress={isFollowing ? handleUnfollow : handleFollow}
            >
              <Text style={[styles.submitText, { color: isFollowing ? '#0d0d0d' : '#fff' }]}>
                {isFollowing ? 'Following' : 'Follow'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleMessage} style={styles.messageButton}>
              <Ionicons style={{justifyContent: 'center', alignItems: 'center'}} name="chatbubbles-outline" size={30} color="#0d0d0d" />
            </TouchableOpacity>
          </View>
        )}
        <ProfileStats userId={userId} />
        </View>

        <PostGrid userId={userId} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#F8F3FA',
    justifyContent: 'center',
    width: '100%',
  },
  nameText: {
    fontSize: 24,
  },
  normalText: {
    fontSize: 16,
    marginBottom: 10,
  },
  bioText: {
    fontSize: 16,
    marginTop: 20,
    marginBottom: 15,
    textAlign: 'center',
  },
  bioContainer: {
    marginLeft: 40,
    marginRight: 50,
  },
  profile: {
    width: 130,
    height: 130,
    marginTop: '4%',
    marginBottom: 10,
    borderRadius: 100,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '3%',
  },
  submit: {
    backgroundColor: '#0d0d0d',
    borderRadius: 16,
    height: 51,
    justifyContent: 'center',
    alignItems: 'center',
    width: '40%',
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
  },
  messageButton: {
    marginLeft: '5%',
    paddingBottom: '1.5%',
  },
});
