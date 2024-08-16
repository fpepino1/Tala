import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { FIREBASE_DB } from '../../../FirebaseConfig';
import { collection, doc, onSnapshot, getDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StackParamList } from '../../navigation/types';

type ProfileStatsScreenNavigationProp = StackNavigationProp<
  StackParamList,
  'ProfileStats'
>;

export default function ProfileStats({ userId }: { userId: string }) {
  const navigation = useNavigation<ProfileStatsScreenNavigationProp>();
  const [postsCount, setPostsCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [followersCount, setFollowersCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      const postsRef = collection(FIREBASE_DB, 'users', userId, 'posts');
      const userDocRef = doc(FIREBASE_DB, 'users', userId);

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
        async (docSnapshot) => {
          if (docSnapshot.exists()) {
            const userData = docSnapshot.data();

            const filterNonExistentUsers = async (list: string[]) => {
              const filteredList = [];
              for (const id of list) {
                const userRef = doc(FIREBASE_DB, 'users', id);
                const userSnapshot = await getDoc(userRef);
                if (userSnapshot.exists()) {
                  filteredList.push(id);
                }
              }
              return filteredList;
            };

            const filteredFollowing = await filterNonExistentUsers(userData.following || []);
            const filteredFollowers = await filterNonExistentUsers(userData.followers || []);

            setFollowingCount(filteredFollowing.length);
            setFollowersCount(filteredFollowers.length);
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

  const handleNavigate = (type: 'followers' | 'following') => {
    navigation.navigate('ConnectionsList', { userId, type });
  };

 

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.stat}>
        <Text style={styles.boldText}>{postsCount}</Text>
        <Text>posts</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.stat} onPress={() => handleNavigate('following')}>
        <Text style={styles.boldText}>{followingCount}</Text>
        <Text>following</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.stat} onPress={() => handleNavigate('followers')}>
        <Text style={styles.boldText}>{followersCount}</Text>
        <Text>followers</Text>
      </TouchableOpacity>
    </View>
  );
}

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
