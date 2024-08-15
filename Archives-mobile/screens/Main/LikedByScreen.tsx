import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Avatar } from 'react-native-paper';
import { doc, getDoc } from 'firebase/firestore';
import { FIREBASE_DB } from '../../FirebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { UserProfileScreenNavigationProp } from '../../navigation/types';

interface LikedUsersScreenProps {
  route: { params: { userIds: string[] } };
}

const LikedByScreen = ({ route }: LikedUsersScreenProps) => {
  const { userIds } = route.params;
  const [likedUsers, setLikedUsers] = useState<{ userId: string; username: string; photoUrl: string }[]>([]);
  const navigation = useNavigation<UserProfileScreenNavigationProp>();

  useEffect(() => {
    const fetchLikedUsers = async () => {
      const users = await Promise.all(
        userIds.map(async (userId) => {
          const userRef = doc(FIREBASE_DB, 'users', userId);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            return {
              userId,
              username: userSnap.data()?.username || 'Unknown User',
              photoUrl: userSnap.data()?.photoUrl || '',
            };
          }
          return null;
        })
      );
      setLikedUsers(users.filter(user => user !== null) as any);
    };

    fetchLikedUsers();
  }, [userIds]);

//   const goToUserProfile = (userId: string) => {
//     navigation.navigate('UserProfile', { userId });
//   };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Liked by</Text>
      <FlatList
        data={likedUsers}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.userContainer}
        //    onPress={() => goToUserProfile(item.userId)}
           >
            <Avatar.Image source={{ uri: item.photoUrl }} size={40} />
            <Text style={styles.username}>{item.username}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.userId}
      />
    </View>
  );
};

export default LikedByScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  username: {
    marginLeft: 15,
    fontSize: 18,
  },
});
