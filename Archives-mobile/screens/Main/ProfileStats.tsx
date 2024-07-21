import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { FIREBASE_DB, FIREBASE_AUTH } from '../../FirebaseConfig';
import { collection, doc, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

export default function ProfileStats() {
  const [postsCount, setPostsCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [followersCount, setFollowersCount] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      const postsRef = collection(FIREBASE_DB, "users", userId, "posts");
      const unsubscribePosts = onSnapshot(postsRef, (snapshot) => {
        setPostsCount(snapshot.size);
      });

      const userDocRef = doc(FIREBASE_DB, "users", userId);
      const unsubscribeUserDoc = onSnapshot(userDocRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          const userData = docSnapshot.data();
          setFollowingCount(userData.followingCount || 0);
          setFollowersCount(userData.followersCount || 0);
        }
      });

      return () => {
        unsubscribePosts();
        unsubscribeUserDoc();
      };
    }
  }, [userId]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        console.error("User is not authenticated.");
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.stat}>
        <Text style={styles.boldText}>{postsCount}</Text>
        <Text>posts</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.stat}>
        <Text style={styles.boldText}>{followingCount}</Text>
        <Text>following</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.stat}>
        <Text style={styles.boldText}>{followersCount}</Text>
        <Text>followers</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    width: '80%',
    padding: 20,
    paddingBottom: 40,
  },
  stat: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  boldText: {
    fontWeight: 'bold',
  },
});
