import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { FIREBASE_DB } from '../../FirebaseConfig';
import { collection, doc, onSnapshot } from 'firebase/firestore';

export default function ProfileStats({ userId }) {
  const [postsCount, setPostsCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [followersCount, setFollowersCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (userId) {
      const postsRef = collection(FIREBASE_DB, "users", userId, "posts");
      const userDocRef = doc(FIREBASE_DB, "users", userId);

      const unsubscribePosts = onSnapshot(postsRef, 
        (snapshot) => {
          setPostsCount(snapshot.size);
        }, 
        (err) => {
          setError(err.message);
          setLoading(false);
        }
      );

      const unsubscribeUserDoc = onSnapshot(userDocRef, 
        (docSnapshot) => {
          if (docSnapshot.exists()) {
            const userData = docSnapshot.data();
            console.log('User data snapshot:', userData);
            setFollowingCount(userData.following?.length || 0);
            setFollowersCount(userData.followers?.length || 0);
          }
          setLoading(false);
        },
        (err) => {
          setError(err.message);
          setLoading(false);
        }
      );

      return () => {
        unsubscribePosts();
        unsubscribeUserDoc();
      };
    }
  }, [userId]);



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
    paddingTop: 20,
    paddingBottom: 50,
  },
  stat: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 30,
    paddingRight: 40,
  },
  boldText: {
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontWeight: 'bold',
  },
});
