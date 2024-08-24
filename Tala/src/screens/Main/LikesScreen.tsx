import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import { Avatar } from 'react-native-paper';
import { doc, getDoc } from 'firebase/firestore';
import { FIREBASE_DB } from '../../../FirebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StackParamList } from '../../navigation/types';

interface User {
  id: string;
  username: string;
  photoUrl: string;
  name: string;
  bio: string;
  posts: any[];
}

interface LikesScreenProps {
  route: {
    params: {
      postId: string;
      userId: string;
    };
  };
}

type LikesScreenNavigationProp = StackNavigationProp<StackParamList, 'LikesScreen'>;

const LikesScreen = ({ route }: LikesScreenProps) => {
  const { postId, userId } = route.params;
  const [likedUsers, setLikedUsers] = useState<{ [userId: string]: User }>({});
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation<LikesScreenNavigationProp>();

  useEffect(() => {
    const fetchLikedUsers = async () => {
      try {
        const postRef = doc(FIREBASE_DB, 'users', userId, 'posts', postId);
        const postSnap = await getDoc(postRef);

        if (postSnap.exists()) {
          const postData = postSnap.data();
          const likes = postData?.likes || [];

          const users = await Promise.all(likes.map(async (likeId: string) => {
            const userRef = doc(FIREBASE_DB, 'users', likeId);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
              return { id: likeId, ...userSnap.data() } as User;
            }
            return null;
          }));

          const usersObject = users.reduce((acc: any, user) => {
            if (user) {
              acc[user.id] = user;
            }
            return acc;
          }, {});

          setLikedUsers(usersObject);
        }
      } catch (error) {
        console.error('Error fetching liked users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLikedUsers();
  }, [postId, userId]);



  return (
    <View style={styles.container}>
      <FlatList
        data={Object.values(likedUsers)}
        keyExtractor={(item) => item.username}
        renderItem={({ item }) => (
          <View style={styles.userContainer}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('UserProfile', {
                  username: item.username,
                  name: item.name,
                  photoUrl: item.photoUrl,
                  bio: item.bio,
                  userId: item.id,
                  posts: item.posts,
                });
              }}
              style={styles.touchableOpacity}
            >
              <Avatar.Image source={{ uri: item.photoUrl }} size={50} />
              <Text style={styles.username}>{item.username}</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F8F3FA',
  },
  userContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
  },
  touchableOpacity: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  username: {
    marginLeft: 10,
    fontSize: 16,
  },
});

export default LikesScreen;
